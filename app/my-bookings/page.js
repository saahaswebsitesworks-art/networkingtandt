'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatINR } from '@/lib/pricing';

export default function MyBookings() {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/book?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">My bookings</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-asphalt">Track your rides</h1>
        <p className="mt-2 text-sm text-asphalt/60">Enter the phone number you booked with to see your bookings.</p>

        <form onSubmit={search} className="mt-6 flex gap-3">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            className="flex-1 rounded-xl border-2 border-asphalt/10 px-4 py-3 focus:border-route-teal focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-route-gradient px-6 py-3 font-display font-bold text-asphalt hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {bookings && (
          <div className="mt-8 space-y-4">
            {bookings.length === 0 && (
              <p className="text-sm text-asphalt/50">No bookings found for that number.</p>
            )}
            {bookings.map((b) => (
              <div key={b.id} className="rounded-2xl border border-asphalt/10 bg-white p-5 shadow-ticket">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-asphalt">{b.id}</span>
                  <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-asphalt/70">{b.status}</span>
                </div>
                <div className="mt-2 text-sm text-asphalt/70">{b.tripTypeLabel} · {b.vehicleLabel}</div>
                <div className="text-sm text-asphalt/70">{[b.pickup, ...(b.stops || []), b.drop].filter(Boolean).join(' → ')}</div>
                <div className="text-xs text-asphalt/50">{b.date} {b.time}</div>
                <div className="mt-2 font-display font-semibold text-asphalt">
                  {b.price?.enquiryOnly ? 'Enquiry' : formatINR(b.price?.total)}
                </div>
                {!b.price?.enquiryOnly && (
                  <div className="mt-1 text-xs">
                    {b.paymentStatus === 'paid' ? (
                      <span className="font-semibold text-route-green">Paid in full online</span>
                    ) : b.paymentStatus === 'advance_paid' ? (
                      <span className="font-semibold text-route-teal">
                        {formatINR(b.amountPaid)} advance paid · {formatINR(b.balanceDue)} to driver
                      </span>
                    ) : (
                      <span className="text-asphalt/50">Pay after ride</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
