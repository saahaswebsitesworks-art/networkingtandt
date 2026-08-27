'use client';

import { useState } from 'react';
import VehicleEditForm from './VehicleEditForm';

export default function RatesManager({ initialVehicles, initialSettings }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [settings, setSettings] = useState(initialSettings);
  const [editingId, setEditingId] = useState(null); // vehicle id being edited, or 'new'
  const [gstDraft, setGstDraft] = useState(String((initialSettings?.gstRate ?? 0.05) * 100));
  const [savingGst, setSavingGst] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleSaveVehicle(id, payload) {
    const isNew = editingId === 'new';
    const res = await fetch(isNew ? '/api/rates' : `/api/rates/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isNew ? { id, vehicle: payload } : payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not save vehicle');
    setVehicles(data.vehicles);
    setEditingId(null);
  }

  async function handleDelete(id) {
    if (!confirm(`Delete "${vehicles[id]?.label}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rates/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) setVehicles(data.vehicles);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveGst() {
    setSavingGst(true);
    try {
      const res = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', gstRate: Number(gstDraft) / 100 }),
      });
      const data = await res.json();
      if (res.ok) setSettings(data.settings);
    } finally {
      setSavingGst(false);
    }
  }

  const ids = Object.keys(vehicles);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-asphalt/50">GST rate (%)</div>
          <input
            type="number"
            step="0.1"
            value={gstDraft}
            onChange={(e) => setGstDraft(e.target.value)}
            className="mt-1 w-28 rounded-lg border-2 border-black/10 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleSaveGst}
          disabled={savingGst}
          className="focus-ring rounded-full bg-route-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-asphalt disabled:opacity-60"
        >
          {savingGst ? 'Saving…' : 'Save GST rate'}
        </button>
        <span className="text-xs text-asphalt/40">Applied on top of every fare across all vehicles.</span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-asphalt">Fleet &amp; rates ({ids.length})</h2>
        {editingId !== 'new' && (
          <button
            onClick={() => setEditingId('new')}
            className="focus-ring rounded-full bg-amber px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-dark"
          >
            + Add vehicle
          </button>
        )}
      </div>

      {editingId === 'new' && (
        <div className="mb-4">
          <VehicleEditForm vehicleId={null} initial={null} onSave={handleSaveVehicle} onCancel={() => setEditingId(null)} />
        </div>
      )}

      <div className="space-y-3">
        {ids.map((id) => {
          const v = vehicles[id];
          if (editingId === id) {
            return (
              <VehicleEditForm
                key={id}
                vehicleId={id}
                initial={v}
                onSave={handleSaveVehicle}
                onCancel={() => setEditingId(null)}
              />
            );
          }
          return (
            <div key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-asphalt">{v.label}</span>
                  <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-route-teal">{v.seats} seats</span>
                  {v.enquiryOnly && (
                    <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[11px] font-semibold text-amber-dark">Enquiry only</span>
                  )}
                </div>
                <div className="text-xs text-asphalt/50">{v.subLabel}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(v.tripTypes || []).map((t) => (
                    <span key={t} className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-semibold uppercase text-asphalt/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(id)}
                  className="focus-ring rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-asphalt hover:border-asphalt"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  disabled={deletingId === id}
                  className="focus-ring rounded-full border border-amber/40 px-4 py-2 text-xs font-semibold text-amber-dark hover:bg-amber/10 disabled:opacity-50"
                >
                  {deletingId === id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
