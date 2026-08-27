// Payment options shown at checkout.
//
//  - later     : pay nothing now, settle with the driver after the ride
//  - advance25 : pay 25% now to lock the booking, balance to the driver
//  - full      : pay the whole fare now, nothing left for the driver
//
// The two paid options go through Razorpay. "later" needs no payment gateway.

export const PAYMENT_OPTIONS = [
  {
    id: 'later',
    label: 'Pay after ride',
    pct: 0,
    tagline: '0 advance',
    desc: 'Book now, pay the driver by cash or UPI after your trip.',
  },
  {
    id: 'advance25',
    label: 'Pay 25% now',
    pct: 0.25,
    tagline: '25% advance',
    desc: 'Lock your ride with a 25% advance. Pay the balance to the driver.',
  },
  {
    id: 'full',
    label: 'Pay 100% now',
    pct: 1,
    tagline: 'Full advance',
    desc: 'Pay the full fare now. Nothing to pay the driver.',
  },
];

export function getPaymentOption(id) {
  return PAYMENT_OPTIONS.find((o) => o.id === id) || PAYMENT_OPTIONS[0];
}

/**
 * Given a GST-inclusive total and a payment option id, work out how much is
 * due now (online) and how much is left for the driver.
 */
export function paymentBreakdown(total, optionId) {
  const option = getPaymentOption(optionId);
  const safeTotal = Math.max(0, Math.round(Number(total) || 0));
  const payNow = Math.round(safeTotal * option.pct);
  const balance = Math.max(0, safeTotal - payNow);

  let status = 'not_paid';
  if (option.pct >= 1) status = 'paid';
  else if (option.pct > 0) status = 'advance_paid';

  return {
    optionId: option.id,
    label: option.label,
    pct: option.pct,
    total: safeTotal,
    payNow, // amount collected online now (INR)
    balance, // amount to pay the driver (INR)
    status, // paymentStatus to store on the booking
    requiresPayment: option.pct > 0,
  };
}
