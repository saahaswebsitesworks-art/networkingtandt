'use client';

import { useState } from 'react';

const ALL_TRIP_TYPES = [
  { id: 'airport', label: 'Airport' },
  { id: 'local', label: 'Local' },
  { id: 'outstation', label: 'Outstation' },
  { id: 'oneway', label: 'One Way' },
  { id: 'group', label: 'Group / Enquiry' },
];

function blankVehicle() {
  return {
    label: '',
    subLabel: '',
    seats: 4,
    tripTypes: ['airport'],
    enquiryOnly: false,
    airport: { minKm: 30, ratePerKm: 30, extraRatePerKm: 30 },
    local: { packages: [{ hrs: 8, km: 80, price: 2000 }], extraKmRate: 15, extraHrRate: 150 },
    outstation: { minKmPerDay: 300, ratePerKm: 15, da: 400, extraRatePerKm: 15 },
    oneWay: { minKm: 150, ratePerKm: 18, da: 400, extraRatePerKm: 18 },
    // Toll & Border charges — off by default, amount only meaningful when applicable is true.
    tollBorder: { applicable: false, amount: 0 },
  };
}

// Maps a form "section" key (as used by updateSection) to the save-status
// bucket it belongs to. tollBorder lives inside the Local section visually,
// so it shares Local's save button/status.
const STATUS_KEY = {
  airport: 'airport',
  local: 'local',
  tollBorder: 'local',
  outstation: 'outstation',
  oneWay: 'oneway',
};

export default function VehicleEditForm({ vehicleId, initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...blankVehicle(), ...(initial || {}) }));
  const [idField, setIdField] = useState(vehicleId || '');
  // Per-section save state: { [key]: { saving, error, savedAt } }
  // keys: 'basic' | 'airport' | 'local' | 'outstation' | 'oneway'
  const [sectionStatus, setSectionStatus] = useState({});

  const has = (t) => form.tripTypes?.includes(t);

  function setStatus(key, patch) {
    setSectionStatus((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  }
  // Clears a section's "Saved" / error state whenever its fields change,
  // so the button goes back to a plain "Save" until it's saved again.
  function clearStatus(key) {
    setSectionStatus((s) => ({ ...s, [key]: { saving: false, error: null, savedAt: null } }));
  }

  function toggleTripType(t) {
    setForm((f) => ({
      ...f,
      tripTypes: has(t) ? f.tripTypes.filter((x) => x !== t) : [...(f.tripTypes || []), t],
    }));
    clearStatus('basic');
  }

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
    clearStatus('basic');
  }
  function updateSection(section, patch) {
    setForm((f) => ({ ...f, [section]: { ...f[section], ...patch } }));
    clearStatus(STATUS_KEY[section] || 'basic');
  }

  function updatePackage(idx, patch) {
    setForm((f) => {
      const packages = [...(f.local?.packages || [])];
      packages[idx] = { ...packages[idx], ...patch };
      return { ...f, local: { ...f.local, packages } };
    });
    clearStatus('local');
  }
  function addPackage() {
    setForm((f) => ({
      ...f,
      local: { ...f.local, packages: [...(f.local?.packages || []), { hrs: 4, km: 40, price: 1000 }] },
    }));
    clearStatus('local');
  }
  function removePackage(idx) {
    setForm((f) => ({
      ...f,
      local: { ...f.local, packages: (f.local?.packages || []).filter((_, i) => i !== idx) },
    }));
    clearStatus('local');
  }

  function validateCore() {
    if (!form.label.trim()) return 'Vehicle name is required.';
    if (!vehicleId && !idField.trim()) return 'Please give this vehicle a short ID (e.g. "sedan").';
    return null;
  }

  function buildPayload() {
    return {
      ...form,
      seats: Number(form.seats) || 1,
      airport: has('airport') && !form.enquiryOnly ? sanitizeAirport(form.airport) : undefined,
      local: has('local') && !form.enquiryOnly ? sanitizeLocal(form.local) : undefined,
      outstation: has('outstation') && !form.enquiryOnly ? sanitizeOutstation(form.outstation) : undefined,
      oneWay: has('oneway') && !form.enquiryOnly ? sanitizeOneWay(form.oneWay) : undefined,
      // Saved regardless of trip type / enquiry-only, so the toggle keeps
      // its value even if the person switches trip types afterward.
      tollBorder: sanitizeTollBorder(form.tollBorder),
    };
  }

  // Every section saves the *whole* vehicle (the API replaces the record
  // as one object), but each button tracks its own saving/error/saved
  // state independently — saving one section never touches another
  // section's status, and the form never closes on save.
  async function saveSection(key) {
    const err = validateCore();
    if (err) {
      setStatus(key, { error: err, saving: false, savedAt: null });
      return;
    }
    setStatus(key, { saving: true, error: null });
    try {
      const payload = buildPayload();
      await onSave(vehicleId || idField.trim(), payload);
      setStatus(key, { saving: false, error: null, savedAt: Date.now() });
    } catch (err) {
      setStatus(key, { saving: false, error: err.message, savedAt: null });
    }
  }

  return (
    <div className="rounded-2xl border-2 border-route-teal/30 bg-mist p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {!vehicleId && (
          <Field label="Vehicle ID (short, no spaces)">
            <input
              value={idField}
              onChange={(e) => {
                setIdField(e.target.value);
                clearStatus('basic');
              }}
              placeholder="e.g. sedan_premium"
              className="input"
            />
          </Field>
        )}
        <Field label="Display name">
          <input value={form.label} onChange={(e) => update({ label: e.target.value })} className="input" />
        </Field>
        <Field label="Subtitle">
          <input value={form.subLabel || ''} onChange={(e) => update({ subLabel: e.target.value })} className="input" />
        </Field>
        <Field label="Seats">
          <input type="number" min="1" value={form.seats} onChange={(e) => update({ seats: e.target.value })} className="input" />
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-asphalt">
        <input type="checkbox" checked={!!form.enquiryOnly} onChange={(e) => update({ enquiryOnly: e.target.checked })} />
        Enquiry only (no fixed price shown — customer just requests a quote)
      </label>

      <div className="mt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-asphalt/50">Available for</div>
        <div className="flex flex-wrap gap-2">
          {ALL_TRIP_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTripType(t.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                has(t.id) ? 'border-route-teal bg-route-teal text-white' : 'border-black/10 text-asphalt/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <SaveRow status={sectionStatus.basic} onClick={() => saveSection('basic')} label="Save basic info" />

      {!form.enquiryOnly && has('airport') && (
        <Section title="Airport transfer">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Pricing">
              <select
                value={form.airport?.flat ? 'flat' : 'perkm'}
                onChange={(e) =>
                  updateSection('airport', e.target.value === 'flat' ? { flat: form.airport?.flat || 0 } : { flat: undefined })
                }
                className="input"
              >
                <option value="perkm">Per km</option>
                <option value="flat">Flat price</option>
              </select>
            </Field>
            {form.airport?.flat !== undefined ? (
              <Field label="Flat price (₹)">
                <input type="number" value={form.airport?.flat || 0} onChange={(e) => updateSection('airport', { flat: Number(e.target.value) })} className="input" />
              </Field>
            ) : (
              <Field label="Rate per km (₹)">
                <input type="number" value={form.airport?.ratePerKm || 0} onChange={(e) => updateSection('airport', { ratePerKm: Number(e.target.value) })} className="input" />
              </Field>
            )}
            <Field label="Minimum km">
              <input type="number" value={form.airport?.minKm || 0} onChange={(e) => updateSection('airport', { minKm: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Rate after minimum km (₹/km)">
              <input
                type="number"
                value={form.airport?.extraRatePerKm ?? ''}
                onChange={(e) => updateSection('airport', { extraRatePerKm: Number(e.target.value) })}
                className="input"
              />
            </Field>
          </div>
          <p className="mt-2 text-[11px] text-asphalt/50">
            Charged per km once the trip goes past the minimum km above — separate from the base rate.
          </p>
          <SaveRow status={sectionStatus.airport} onClick={() => saveSection('airport')} label="Save airport rates" />
        </Section>
      )}

      {!form.enquiryOnly && has('local') && (
        <Section title="Local / sightseeing">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Extra km rate (₹/km)">
              <input type="number" value={form.local?.extraKmRate || 0} onChange={(e) => updateSection('local', { extraKmRate: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Extra hour rate (₹/hr)">
              <input type="number" value={form.local?.extraHrRate || 0} onChange={(e) => updateSection('local', { extraHrRate: Number(e.target.value) })} className="input" />
            </Field>
          </div>

          {/* Toll & Border — Yes/No toggle, amount field only shown when applicable. */}
          <div className="mt-3">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-asphalt/50">
              Toll &amp; Border charges applicable?
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateSection('tollBorder', { applicable: false })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  !form.tollBorder?.applicable ? 'border-route-teal bg-route-teal text-white' : 'border-black/10 text-asphalt/60'
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => updateSection('tollBorder', { applicable: true })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  form.tollBorder?.applicable ? 'border-route-teal bg-route-teal text-white' : 'border-black/10 text-asphalt/60'
                }`}
              >
                Yes
              </button>
              {form.tollBorder?.applicable && (
                <input
                  type="number"
                  min="0"
                  value={form.tollBorder?.amount ?? 0}
                  onChange={(e) => updateSection('tollBorder', { amount: Number(e.target.value) })}
                  placeholder="Amount (₹)"
                  className="input-sm"
                />
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {(form.local?.packages || []).map((p, idx) => (
              <div key={idx} className="flex flex-wrap items-end gap-2 rounded-xl bg-white p-3">
                <MiniField label="Hours">
                  <input type="number" value={p.hrs} onChange={(e) => updatePackage(idx, { hrs: Number(e.target.value) })} className="input-sm" />
                </MiniField>
                <MiniField label="Km">
                  <input type="number" value={p.km} onChange={(e) => updatePackage(idx, { km: Number(e.target.value) })} className="input-sm" />
                </MiniField>
                <MiniField label="Price (₹)">
                  <input type="number" value={p.price} onChange={(e) => updatePackage(idx, { price: Number(e.target.value) })} className="input-sm" />
                </MiniField>
                <button type="button" onClick={() => removePackage(idx)} className="ml-auto rounded-full border border-black/10 px-3 py-1 text-xs text-amber-dark">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addPackage} className="rounded-full border border-route-teal px-3 py-1.5 text-xs font-semibold text-route-teal">
              + Add package
            </button>
          </div>
          <SaveRow status={sectionStatus.local} onClick={() => saveSection('local')} label="Save local & toll rates" />
        </Section>
      )}

      {!form.enquiryOnly && has('outstation') && (
        <Section title="Outstation (round trip)">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Min km / day">
              <input type="number" value={form.outstation?.minKmPerDay || 0} onChange={(e) => updateSection('outstation', { minKmPerDay: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Rate per km (₹)">
              <input type="number" value={form.outstation?.ratePerKm || 0} onChange={(e) => updateSection('outstation', { ratePerKm: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Driver allowance / day (₹)">
              <input type="number" value={form.outstation?.da || 0} onChange={(e) => updateSection('outstation', { da: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Rate after minimum km/day (₹/km)">
              <input
                type="number"
                value={form.outstation?.extraRatePerKm ?? ''}
                onChange={(e) => updateSection('outstation', { extraRatePerKm: Number(e.target.value) })}
                className="input"
              />
            </Field>
          </div>
          <p className="mt-2 text-[11px] text-asphalt/50">
            Charged per km once the trip goes past the minimum km/day above — separate from the base rate.
          </p>
          <SaveRow status={sectionStatus.outstation} onClick={() => saveSection('outstation')} label="Save outstation rates" />
        </Section>
      )}

      {!form.enquiryOnly && has('oneway') && (
        <Section title="One way drop">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Minimum km">
              <input type="number" value={form.oneWay?.minKm || 0} onChange={(e) => updateSection('oneWay', { minKm: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Rate per km (₹)">
              <input type="number" value={form.oneWay?.ratePerKm || 0} onChange={(e) => updateSection('oneWay', { ratePerKm: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Driver allowance (₹)">
              <input type="number" value={form.oneWay?.da || 0} onChange={(e) => updateSection('oneWay', { da: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Rate after minimum km (₹/km)">
              <input
                type="number"
                value={form.oneWay?.extraRatePerKm ?? ''}
                onChange={(e) => updateSection('oneWay', { extraRatePerKm: Number(e.target.value) })}
                className="input"
              />
            </Field>
          </div>
          <p className="mt-2 text-[11px] text-asphalt/50">
            Charged per km once the trip goes past the minimum km above — separate from the base rate.
          </p>
          <SaveRow status={sectionStatus.oneway} onClick={() => saveSection('oneway')} label="Save one-way rates" />
        </Section>
      )}

      <div className="mt-5 flex gap-3 border-t border-black/5 pt-5">
        <button type="button" onClick={onCancel} className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold text-asphalt/70">
          Close
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.6rem;
          border: 2px solid rgba(11, 31, 42, 0.1);
          background: white;
          padding: 0.5rem 0.7rem;
          font-size: 0.85rem;
          color: #0b1f2a;
        }
        .input-sm {
          width: 6rem;
          border-radius: 0.5rem;
          border: 2px solid rgba(11, 31, 42, 0.1);
          padding: 0.35rem 0.5rem;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}

// Small save button + inline "Saving…" / "Saved" / error feedback, used
// once per section so each part of the form saves on its own.
function SaveRow({ status, onClick, label }) {
  const s = status || {};
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={s.saving}
        className="focus-ring rounded-full bg-route-teal px-5 py-2 text-xs font-bold text-white hover:bg-asphalt disabled:opacity-60"
      >
        {s.saving ? 'Saving…' : label}
      </button>
      {!s.saving && s.savedAt && <span className="text-xs font-semibold text-route-teal">Saved</span>}
      {!s.saving && s.error && <span className="text-xs font-medium text-amber-dark">{s.error}</span>}
    </div>
  );
}

function sanitizeAirport(a) {
  if (!a) return { minKm: 30, ratePerKm: 30, extraRatePerKm: 30 };
  const base =
    a.flat !== undefined
      ? { flat: Number(a.flat) || 0 }
      : { ratePerKm: Number(a.ratePerKm) || 0 };
  return {
    ...base,
    minKm: Number(a.minKm) || 0,
    // Rate applied per km once the trip exceeds minKm — kept for both
    // flat and per-km pricing modes.
    extraRatePerKm: Number(a.extraRatePerKm) || 0,
  };
}
function sanitizeLocal(l) {
  return {
    extraKmRate: Number(l?.extraKmRate) || 0,
    extraHrRate: Number(l?.extraHrRate) || 0,
    packages: (l?.packages || []).map((p) => ({ hrs: Number(p.hrs) || 0, km: Number(p.km) || 0, price: Number(p.price) || 0 })),
  };
}
function sanitizeOutstation(o) {
  return {
    minKmPerDay: Number(o?.minKmPerDay) || 0,
    ratePerKm: Number(o?.ratePerKm) || 0,
    da: Number(o?.da) || 0,
    extraRatePerKm: Number(o?.extraRatePerKm) || 0,
  };
}
function sanitizeOneWay(o) {
  return {
    minKm: Number(o?.minKm) || 0,
    ratePerKm: Number(o?.ratePerKm) || 0,
    da: Number(o?.da) || 0,
    extraRatePerKm: Number(o?.extraRatePerKm) || 0,
  };
}
function sanitizeTollBorder(t) {
  const applicable = !!t?.applicable;
  return { applicable, amount: applicable ? Number(t.amount) || 0 : 0 };
}

function Section({ title, children }) {
  return (
    <div className="mt-4 rounded-xl border border-black/5 bg-white/60 p-4">
      <div className="mb-3 text-xs font-bold uppercase tracking-wide text-route-teal">{title}</div>
      {children}
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-asphalt/50">{label}</span>
      {children}
    </label>
  );
}
function MiniField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-asphalt/40">{label}</span>
      {children}
    </label>
  );
}