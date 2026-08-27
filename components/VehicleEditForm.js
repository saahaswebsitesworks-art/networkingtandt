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
    airport: { minKm: 30, ratePerKm: 30 },
    local: { packages: [{ hrs: 8, km: 80, price: 2000 }], extraKmRate: 15, extraHrRate: 150 },
    outstation: { minKmPerDay: 300, ratePerKm: 15, da: 400 },
    oneWay: { minKm: 150, ratePerKm: 18, da: 400 },
  };
}

export default function VehicleEditForm({ vehicleId, initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...blankVehicle(), ...(initial || {}) }));
  const [idField, setIdField] = useState(vehicleId || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const has = (t) => form.tripTypes?.includes(t);

  function toggleTripType(t) {
    setForm((f) => ({
      ...f,
      tripTypes: has(t) ? f.tripTypes.filter((x) => x !== t) : [...(f.tripTypes || []), t],
    }));
  }

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }
  function updateSection(section, patch) {
    setForm((f) => ({ ...f, [section]: { ...f[section], ...patch } }));
  }

  function updatePackage(idx, patch) {
    setForm((f) => {
      const packages = [...(f.local?.packages || [])];
      packages[idx] = { ...packages[idx], ...patch };
      return { ...f, local: { ...f.local, packages } };
    });
  }
  function addPackage() {
    setForm((f) => ({
      ...f,
      local: { ...f.local, packages: [...(f.local?.packages || []), { hrs: 4, km: 40, price: 1000 }] },
    }));
  }
  function removePackage(idx) {
    setForm((f) => ({
      ...f,
      local: { ...f.local, packages: (f.local?.packages || []).filter((_, i) => i !== idx) },
    }));
  }

  async function handleSave() {
    setError('');
    if (!form.label.trim()) {
      setError('Vehicle name is required.');
      return;
    }
    if (!vehicleId && !idField.trim()) {
      setError('Please give this vehicle a short ID (e.g. "sedan").');
      return;
    }

    const payload = {
      ...form,
      seats: Number(form.seats) || 1,
      airport: has('airport') && !form.enquiryOnly ? sanitizeAirport(form.airport) : undefined,
      local: has('local') && !form.enquiryOnly ? sanitizeLocal(form.local) : undefined,
      outstation: has('outstation') && !form.enquiryOnly ? sanitizeOutstation(form.outstation) : undefined,
      oneWay: has('oneway') && !form.enquiryOnly ? sanitizeOneWay(form.oneWay) : undefined,
    };

    setSaving(true);
    try {
      await onSave(vehicleId || idField.trim(), payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border-2 border-route-teal/30 bg-mist p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {!vehicleId && (
          <Field label="Vehicle ID (short, no spaces)">
            <input value={idField} onChange={(e) => setIdField(e.target.value)} placeholder="e.g. sedan_premium" className="input" />
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
          </div>
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
          </div>
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
          </div>
        </Section>
      )}

      {error && <p className="mt-4 text-sm font-medium text-amber-dark">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="focus-ring rounded-full bg-route-teal px-6 py-2.5 text-sm font-bold text-white hover:bg-asphalt disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save vehicle'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold text-asphalt/70">
          Cancel
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

function sanitizeAirport(a) {
  if (!a) return { minKm: 30, ratePerKm: 30 };
  return a.flat !== undefined ? { flat: Number(a.flat) || 0, minKm: Number(a.minKm) || 0 } : { minKm: Number(a.minKm) || 0, ratePerKm: Number(a.ratePerKm) || 0 };
}
function sanitizeLocal(l) {
  return {
    extraKmRate: Number(l?.extraKmRate) || 0,
    extraHrRate: Number(l?.extraHrRate) || 0,
    packages: (l?.packages || []).map((p) => ({ hrs: Number(p.hrs) || 0, km: Number(p.km) || 0, price: Number(p.price) || 0 })),
  };
}
function sanitizeOutstation(o) {
  return { minKmPerDay: Number(o?.minKmPerDay) || 0, ratePerKm: Number(o?.ratePerKm) || 0, da: Number(o?.da) || 0 };
}
function sanitizeOneWay(o) {
  return { minKm: Number(o?.minKm) || 0, ratePerKm: Number(o?.ratePerKm) || 0, da: Number(o?.da) || 0 };
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
