'use client';

import { useMemo, useState } from 'react';
import { formatINR } from '@/lib/pricing';

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const STATUS_STYLES = {
  Pending: 'bg-amber/10 text-amber-dark',
  Confirmed: 'bg-route-teal/10 text-route-teal',
  Completed: 'bg-route-green/10 text-route-green',
  Cancelled: 'bg-asphalt/10 text-asphalt/50',
};

export default function BookingsTable({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('All');
  const [updating, setUpdating] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'All') return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  async function updateStatus(id, status) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              filter === s ? 'bg-asphalt text-paper' : 'bg-white text-asphalt/60 hover:text-asphalt'
            }`}
          >
            {s} {s !== 'All' && `(${bookings.filter((b) => b.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-asphalt/20 bg-white p-10 text-center text-sm text-asphalt/50">
          No bookings here yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-asphalt/10 bg-white shadow-ticket">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-asphalt/10 text-xs uppercase tracking-wide text-asphalt/50">
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Trip</th>
                <th className="px-4 py-3">Route / Date</th>
                <th className="px-4 py-3">Fare</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-asphalt/5 align-top">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-asphalt">{b.id}</div>
                    <div className="text-xs text-asphalt/50">{new Date(b.createdAt).toLocaleString('en-IN')}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-asphalt">{b.name}</div>
                    <div className="text-xs text-asphalt/60">{b.phone}</div>
                    {b.email && <div className="text-xs text-asphalt/40">{b.email}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-asphalt">{b.tripTypeLabel}</div>
                    <div className="text-xs text-asphalt/50">{b.vehicleLabel}</div>
                  </td>
                  <td className="px-4 py-3 text-asphalt/70">
                    <div>{[b.pickup, ...(b.stops || []), b.drop].filter(Boolean).join(' → ')}</div>
                    <div className="text-xs text-asphalt/50">
                      {b.date} {b.time} {b.tripType === 'outstation' ? `· ${b.days} day(s)` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-asphalt">
                    {b.price?.enquiryOnly ? 'Enquiry' : formatINR(b.price?.total)}
                  </td>
                  <td className="px-4 py-3">
                    {b.paymentStatus === 'paid' ? (
                      <div>
                        <span className="rounded-full bg-route-green/10 px-2 py-1 text-xs font-semibold text-route-green">Paid in full</span>
                        <div className="mt-1 text-xs text-asphalt/50">{formatINR(b.amountPaid)} online</div>
                      </div>
                    ) : b.paymentStatus === 'advance_paid' ? (
                      <div>
                        <span className="rounded-full bg-route-teal/10 px-2 py-1 text-xs font-semibold text-route-teal">Advance paid</span>
                        <div className="mt-1 text-xs text-asphalt/50">{formatINR(b.amountPaid)} online · {formatINR(b.balanceDue)} to driver</div>
                      </div>
                    ) : (
                      <span className="rounded-full bg-amber/10 px-2 py-1 text-xs font-semibold text-amber-dark">Pay after ride</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      disabled={updating === b.id}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`rounded-full border-0 px-2 py-1 text-xs font-semibold ${STATUS_STYLES[b.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a href={`tel:${b.phone}`} className="focus-ring rounded-full border border-asphalt/20 px-2 py-1 text-xs">
                        Call
                      </a>
                      <a
                        href={`https://wa.me/91${b.phone.replace(/\D/g, '').slice(-10)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring rounded-full border border-asphalt/20 px-2 py-1 text-xs"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
