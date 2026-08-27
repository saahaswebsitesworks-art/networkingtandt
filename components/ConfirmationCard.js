'use client';

import { useEffect, useRef } from 'react';
import { formatINR } from '@/lib/pricing';

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917975630631';

function paymentLine(b) {
  if (b.paymentStatus === 'paid') return `Payment: Paid in full online — ${formatINR(b.amountPaid)}`;
  if (b.paymentStatus === 'advance_paid')
    return `Payment: Advance ${formatINR(b.amountPaid)} paid online; balance ${formatINR(b.balanceDue)} to driver`;
  return 'Payment: Pay after ride (cash / UPI to driver)';
}

function buildWhatsAppMessage(b) {
  const lines = [
    `*New Booking — Networking Tours & Travels*`,
    `Booking ID: ${b.id}`,
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Trip type: ${b.tripTypeLabel}`,
    `Vehicle: ${b.vehicleLabel}`,
    b.pickup ? `Pickup: ${b.pickup}` : null,
    b.stops?.length ? `Stops: ${b.stops.join(', ')}` : null,
    b.drop ? `Drop: ${b.drop}` : null,
    b.date ? `Date: ${b.date} ${b.time || ''}` : null,
    b.tripType === 'outstation' ? `Days: ${b.days}` : null,
    b.km ? `Estimated distance: ${b.km} km` : null,
    b.price?.enquiryOnly ? `Fare: Enquiry — please share a quote` : `Estimated fare: ${formatINR(b.price?.total)} (incl. GST)`,
    paymentLine(b),
    b.razorpayPaymentId ? `Payment ref: ${b.razorpayPaymentId}` : null,
    b.notes ? `Notes: ${b.notes}` : null,
  ].filter(Boolean);
  return encodeURIComponent(lines.join('\n'));
}

export default function ConfirmationCard({ booking, onReset }) {
  const waDetails = `https://wa.me/${WHATSAPP}?text=${buildWhatsAppMessage(booking)}`;

  const paid = booking.paymentStatus === 'paid';
  const advance = booking.paymentStatus === 'advance_paid';

  // Auto-notify the business on WhatsApp the moment a booking is confirmed,
  // so the admin doesn't have to rely on email alone. This opens a new tab
  // pre-filled with the full booking details, addressed to the business
  // number — nobody needs to click the WhatsApp button below for it to fire.
  // Note: some browsers block a tab that opens without a direct click; if
  // that happens the manual "WhatsApp" button below still works as a fallback.
  const notified = useRef(false);
  useEffect(() => {
    if (notified.current) return;
    notified.current = true;
    try {
      window.open(waDetails, '_blank', 'noopener,noreferrer');
    } catch {
      // Ignore — the visible WhatsApp button is the fallback.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id]);

  return (
    <div className="ticket-notch rounded-2xl border border-black/5 bg-white p-8 shadow-ticket">
      <div className="route-line mb-6 rounded-full" />
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-route-green">✅ Ride Confirmed</div>
      <h3 className="font-display text-2xl font-bold text-asphalt">Thank you, {booking.name}!</h3>
      <p className="mt-2 text-sm text-asphalt/70">
        Booking ID <span className="font-semibold text-asphalt">{booking.id}</span>. Our team will call you shortly to
        finalize the details.
      </p>

      {/* Fare + payment status */}
      {!booking.price?.enquiryOnly && (
        <div className="mt-4 rounded-xl bg-mist p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-asphalt/70">Total fare (incl. GST)</span>
            <span className="font-display text-lg font-bold text-asphalt">{formatINR(booking.price?.total)}</span>
          </div>

          {paid && (
            <div className="mt-2 flex items-center justify-between text-sm text-route-green">
              <span>Paid online</span>
              <span className="font-semibold">{formatINR(booking.amountPaid)} · nothing due to driver</span>
            </div>
          )}
          {advance && (
            <>
              <div className="mt-2 flex items-center justify-between text-sm text-route-green">
                <span>Advance paid online</span>
                <span className="font-semibold">{formatINR(booking.amountPaid)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-asphalt/70">
                <span>Balance to driver</span>
                <span className="font-semibold">{formatINR(booking.balanceDue)}</span>
              </div>
            </>
          )}
          {!paid && !advance && (
            <div className="mt-2 text-sm text-asphalt/60">
              No advance needed — pay {formatINR(booking.price?.total)} to the driver by cash or UPI after your ride.
            </div>
          )}
        </div>
      )}

      {/* After confirmation: two ways to reach us — Call and WhatsApp */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={`tel:${PHONE}`}
          className="focus-ring flex items-center justify-center gap-2 rounded-full border-2 border-asphalt px-4 py-3 text-sm font-semibold text-asphalt hover:bg-asphalt hover:text-white"
        >
          📞 Call Us
        </a>
        <a
          href={waDetails}
          target="_blank"
          rel="noreferrer"
          className="focus-ring flex items-center justify-center gap-2 rounded-full bg-amber px-4 py-3 text-sm font-semibold text-white hover:bg-amber-dark"
        >
          💬 WhatsApp
        </a>
      </div>

      {onReset && (
        <button onClick={onReset} className="focus-ring mt-6 text-sm font-medium text-route-teal underline underline-offset-4">
          Make another booking
        </button>
      )}
    </div>
  );
}
