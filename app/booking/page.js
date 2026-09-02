'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConfirmationCard from '@/components/ConfirmationCard';
import RouteMapEmbed from '@/components/RouteMapEmbed';
import { TRIP_TYPES, calculatePrice, formatINR } from '@/lib/pricing';
import { PAYMENT_OPTIONS, paymentBreakdown } from '@/lib/payments';

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

// Inline icons (no external icon package needed)
function ChevronDownIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function buildInclusionsExclusions({ tripType, vehicle, price, localPackageIdx, gstRate }) {
  const inclusions = ['Base Fare and Fuel Charges'];
  const exclusions = [];

  const effectiveGstRate = price?.gstRate ?? gstRate ?? 0.05;
  inclusions.push(`GST (${Math.round(effectiveGstRate * 100)}%)`);

  if (tripType === 'outstation' && vehicle?.outstation) {
    inclusions.push(`Driver Allowance (₹${vehicle.outstation.da}/day)`);
    exclusions.push('Toll, State Tax & Parking — pay as applicable');
  } else if (tripType === 'oneway' && vehicle?.oneWay) {
    inclusions.push(`Driver Allowance (₹${vehicle.oneWay.da})`);
    exclusions.push('Toll, State Tax & Parking — pay as applicable');
  } else if (tripType === 'airport') {
    inclusions.push('Driver Allowance');
  }

  inclusions.push('AC');

  if (tripType === 'local' && vehicle?.local?.packages?.length) {
    const pkg = vehicle.local.packages[localPackageIdx] || vehicle.local.packages[0];
    exclusions.push(`Beyond package: ₹${vehicle.local.extraKmRate}/km after ${pkg.km} km`);
    exclusions.push(`Extra hour beyond ${pkg.hrs} hrs: ₹${vehicle.local.extraHrRate}/hr`);
  } else if (tripType === 'airport' && vehicle?.airport && !vehicle.airport.flat) {
    exclusions.push(`Beyond min ${vehicle.airport.minKm} km, charged at ₹${vehicle.airport.ratePerKm}/km`);
  }

  exclusions.push('Multiple pickups/drops not in original route');

  return { inclusions, exclusions };
}

const TERMS_TEXT = [
  'Your trip has a KM limit. If your usage exceeds this limit, you will be charged for the excess KM used.',
  'Your trip includes one pick-up and one drop as per the details provided. It does not include within-city travel beyond the route.',
  'If your trip has hill climbs, cab AC may be switched off during such climbs.',
  'Waiting time beyond 15 minutes at pickup may be chargeable as per driver discretion.',
];

function BookingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [rates, setRates] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);

  const tripType = params.get('tripType') || 'airport';
  const vehicleId = params.get('vehicleId') || '';
  const pickup = params.get('pickup') || '';
  const drop = params.get('drop') || '';
  const date = params.get('date') || '';
  const time = params.get('time') || '';
  const returnDate = params.get('returnDate') || '';
  const km = Number(params.get('km')) || 0;
  const localPackageIdx = Number(params.get('localPackageIdx')) || 0;
  const stops = (() => {
    try {
      return JSON.parse(params.get('stops') || '[]');
    } catch {
      return [];
    }
  })();
  const routePts = (() => {
    try {
      return JSON.parse(params.get('routePts') || '[]');
    } catch {
      return [];
    }
  })();

  const days = (() => {
    if (tripType !== 'outstation' || !date || !returnDate) return 1;
    const diff = Math.round((new Date(returnDate) - new Date(date)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff + 1 : 1;
  })();

  useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then(setRates);
  }, []);

  // Load Razorpay Checkout once (only needed for the advance / full options).
  useEffect(() => {
    if (typeof window === 'undefined' || document.getElementById('razorpay-checkout-js')) return;
    const s = document.createElement('script');
    s.id = 'razorpay-checkout-js';
    s.src = RAZORPAY_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const price = useMemo(() => {
    if (!rates) return null;
    return calculatePrice({ vehicles: rates.vehicles, vehicleId, tripType, km, days, localPackageIdx, gstRate: rates.settings?.gstRate });
  }, [rates, vehicleId, tripType, km, days, localPackageIdx]);

  const vehicle = rates?.vehicles?.[vehicleId];
  const tripTypeLabel = TRIP_TYPES.find((t) => t.id === tripType)?.label || tripType;

  const { inclusions, exclusions } = useMemo(() => {
    if (!vehicle) return { inclusions: [], exclusions: [] };
    return buildInclusionsExclusions({ tripType, vehicle, price, localPackageIdx, gstRate: rates?.settings?.gstRate });
  }, [tripType, vehicle, price, localPackageIdx, rates]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentOption, setPaymentOption] = useState('later');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const enquiryOnly = !!price?.enquiryOnly;
  const total = price?.total || 0;
  const split = useMemo(
    () => paymentBreakdown(total, enquiryOnly ? 'later' : paymentOption),
    [total, enquiryOnly, paymentOption]
  );

  async function bookNow(payment) {
    const booking = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      tripType,
      tripTypeLabel,
      vehicleId,
      vehicleLabel: vehicle?.label || vehicleId,
      pickup,
      drop,
      stops,
      date,
      time,
      days,
      km,
      notes,
      price,
      payment,
    };
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    setResult(data.booking);
    setSubmitting(false);
  }

  function openRazorpay({ order, keyId }) {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.Razorpay) {
        setError('The payment window is still loading — please try again in a moment.');
        setSubmitting(false);
        resolve(null);
        return;
      }
      const rzp = new window.Razorpay({
        key: keyId,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Networking Tours & Travels',
        description: `${vehicle?.label || ''} · ${tripTypeLabel}`.trim(),
        prefill: { name: name.trim(), contact: phone.trim(), email: email.trim() },
        theme: { color: '#0B84C4' },
        handler: (resp) => resolve(resp),
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError('Payment was cancelled. You can try again, or choose "Pay after ride".');
            resolve(null);
          },
        },
      });
      rzp.on('payment.failed', (r) => {
        setError(r?.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    setSubmitting(true);

    try {
      // Pay-after-ride (or enquiry): just record the booking, no gateway.
      if (!split.requiresPayment) {
        await bookNow({ optionId: split.optionId });
        return;
      }

      // Advance / full: create a Razorpay order, collect payment, verify, book.
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: split.payNow,
          receipt: `NTT_${Date.now()}`,
          notes: { name: name.trim(), phone: phone.trim(), tripType: tripTypeLabel },
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error || 'Could not start the payment. Please try again.');
        setSubmitting(false);
        return;
      }

      const resp = await openRazorpay({ order: orderData.order, keyId: orderData.keyId });
      if (!resp) return; // cancelled/failed — error already shown

      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: resp.razorpay_order_id,
          razorpay_payment_id: resp.razorpay_payment_id,
          razorpay_signature: resp.razorpay_signature,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.ok) {
        setError('We couldn’t verify your payment. If money was deducted, please call us — don’t pay again.');
        setSubmitting(false);
        return;
      }

      await bookNow({
        optionId: split.optionId,
        razorpayOrderId: resp.razorpay_order_id,
        razorpayPaymentId: resp.razorpay_payment_id,
      });
    } catch (err) {
      setError((err.message || 'Something went wrong') + ' — please call or WhatsApp us instead.');
      setSubmitting(false);
    }
  }

  const submitLabel = submitting
    ? 'Processing…'
    : enquiryOnly
    ? 'Send Booking Enquiry'
    : !split.requiresPayment
    ? 'Confirm Booking — Pay After Ride'
    : `Pay ${formatINR(split.payNow)} & Confirm`;

  if (!rates) {
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-3xl px-5 py-16 text-sm text-asphalt/50">Loading…</div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-10">
        {result ? (
          <ConfirmationCard booking={result} onReset={() => router.push('/')} />
        ) : (
          <>
            <button onClick={() => router.back()} className="focus-ring text-sm font-semibold text-route-teal hover:underline">
              ← Back to cabs
            </button>

            <div className="mt-4 rounded-2xl border border-black/5 bg-white p-6 shadow-ticket sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Review your booking</div>
              <h1 className="mt-1 font-display text-2xl font-bold text-asphalt">
                {[pickup, ...stops, drop].filter(Boolean).join(' → ')}
              </h1>
              <p className="mt-1 text-sm text-asphalt/60">
                {vehicle?.label} · {tripTypeLabel} · {date} {time} {tripType === 'outstation' ? `· ${days} day(s)` : ''}
              </p>

              {routePts.length >= 2 && (
                <div className="mt-4">
                  <RouteMapEmbed points={routePts} />
                  <p className="mt-1 text-center text-[11px] text-asphalt/40">
                    Route shown on Google Maps · distance {km ? `${km} km` : 'estimated'} for fare
                  </p>
                </div>
              )}

              {!price?.enquiryOnly && price?.breakdown && (
                <div className="mt-4 rounded-xl bg-mist p-4">
                  <ul className="space-y-1 text-sm text-asphalt/80">
                    {price.breakdown.map((b, i) => (
                      <li key={i} className="flex items-center justify-between gap-4">
                        <span>{b.label}</span>
                        {b.amount !== null && <span className="font-medium">{formatINR(b.amount)}</span>}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
                    <span className="font-display font-semibold text-asphalt">Total (incl. GST)</span>
                    <span className="font-display text-xl font-bold text-asphalt">{formatINR(price.total)}</span>
                  </div>
                  <div className="mt-1 text-xs text-asphalt/50">
                    GST ({Math.round((price.gstRate || 0) * 100)}%) included. Choose how you’d like to pay below.
                  </div>
                </div>
              )}

              {price?.enquiryOnly && (
                <div className="mt-4 rounded-xl bg-mist p-4 text-sm text-asphalt/70">
                  Price on request — our team will call you with a quote for this group trip.
                </div>
              )}

              {/* Inclusions / Exclusions */}
              {(inclusions.length > 0 || exclusions.length > 0) && (
                <div className="mt-4 rounded-xl border border-black/5 p-4 sm:p-5">
                  <h2 className="font-display text-base font-bold text-asphalt">Inclusions/Exclusions</h2>

                  {inclusions.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-600">Inclusions</span>
                      </div>
                      <ul className="mt-2 space-y-2">
                        {inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-asphalt/80">
                            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exclusions.length > 0 && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-sm font-semibold text-red-500">Exclusions</span>
                      </div>
                      <ul className="mt-2 space-y-2">
                        {exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-asphalt/80">
                            <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setTermsOpen((o) => !o)}
                    className="focus-ring mt-5 flex w-full items-center justify-between border-t border-black/10 pt-4 text-sm font-semibold text-route-teal"
                  >
                    <span>Read Terms and Conditions</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${termsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {termsOpen && (
                    <ul className="mt-3 space-y-2 rounded-lg bg-mist p-4 text-xs text-asphalt/70">
                      {TERMS_TEXT.map((t, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-asphalt/40" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Payment options */}
              {!enquiryOnly && (
                <div className="mt-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-asphalt/50">
                    Payment
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {PAYMENT_OPTIONS.map((opt) => {
                      const b = paymentBreakdown(total, opt.id);
                      const active = paymentOption === opt.id;
                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setPaymentOption(opt.id)}
                          className={`focus-ring rounded-xl border-2 px-3 py-2.5 text-left transition ${
                            active
                              ? 'border-route-teal bg-route-teal/5'
                              : 'border-black/10 hover:border-route-teal/40'
                          }`}
                        >
                          <div className="text-xs font-bold text-asphalt">
                            {opt.pct === 0 ? 'Book at ₹0' : opt.pct === 1 ? 'Pay 100%' : `Pay ${Math.round(opt.pct * 100)}%`}
                          </div>
                          <div className="mt-0.5 text-[11px] text-asphalt/50">
                            {opt.pct > 0 ? `${formatINR(b.payNow)} now` : 'Pay later'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {split.requiresPayment && (
                    <p className="mt-2 text-[11px] text-asphalt/40">
                      Payments are processed securely by Razorpay (UPI, cards, netbanking &amp; wallets).
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border-2 border-black/10 bg-mist px-4 py-4 text-base font-bold text-asphalt placeholder:font-bold placeholder:text-asphalt/40 outline-none transition focus:border-route-teal focus:bg-route-teal/5"
                    required
                  />
                </div>

                <div className="flex gap-2 sm:col-span-2">
                  <div className="flex w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-black/10 bg-mist text-base font-bold text-asphalt/70">
                    +91
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Mobile No."
                    className="w-full rounded-2xl border-2 border-black/10 bg-mist px-4 py-4 text-base font-bold text-asphalt placeholder:font-bold placeholder:text-asphalt/40 outline-none transition focus:border-route-teal focus:bg-route-teal/5"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email ID (optional)"
                    className="w-full rounded-2xl border-2 border-black/10 bg-mist px-4 py-4 text-base font-bold text-asphalt placeholder:font-bold placeholder:text-asphalt/40 outline-none transition focus:border-route-teal focus:bg-route-teal/5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes — flight number, luggage, etc. (optional)"
                    className="w-full rounded-2xl border-2 border-black/10 bg-mist px-4 py-4 text-base font-bold text-asphalt placeholder:font-bold placeholder:text-asphalt/40 outline-none transition focus:border-route-teal focus:bg-route-teal/5"
                  />
                </div>

                {error && <p className="text-sm font-medium text-amber-dark sm:col-span-2">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring mt-2 w-full rounded-full bg-amber py-4 text-center font-display text-base font-bold uppercase tracking-wide text-white transition hover:bg-amber-dark disabled:opacity-60 sm:col-span-2 sm:w-auto sm:px-12"
                >
                  {submitLabel}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingInner />
    </Suspense>
  );
}