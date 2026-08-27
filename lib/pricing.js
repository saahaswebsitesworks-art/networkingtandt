// -----------------------------------------------------------------------
// Networking Tours & Travels — fare calculator
//
// This file is now purely functional: it takes the vehicle rate data as a
// parameter instead of importing a hardcoded list, because rates are
// managed live from /admin/rates and stored in Neon Postgres (see
// lib/rates-store.js). See lib/default-rates.js for the original numbers
// you gave us, used only to seed the store the first time.
//
// Notes / assumptions baked into the math:
// - "add X rs per km + Y rs" on local packages is applied as: extra-km rate
//   (beyond the package km) + extra-hour rate (beyond the package hours) —
//   the standard convention cab operators use.
// - Outstation & one-way fares include the per-km rate + Driver Allowance
//   (DA). Toll, state tax, permits & parking are shown as "extra, pay as
//   applicable" since they vary trip to trip.
// - GST is added on top of every computed fare, at the rate configured in
//   admin settings (default 5%).
// -----------------------------------------------------------------------

export const TRIP_TYPES = [
  { id: 'airport', label: 'Airport Transfer' },
  { id: 'local', label: 'Local / Sightseeing' },
  { id: 'outstation', label: 'Outstation (Round Trip)' },
  { id: 'oneway', label: 'One Way Drop' },
  { id: 'group', label: 'Bus / Tempo Traveller (Enquiry)' },
];

export function vehiclesForTripType(vehicles, tripType) {
  return Object.entries(vehicles || {})
    .filter(([, v]) => v.tripTypes?.includes(tripType))
    .map(([id, v]) => ({ id, ...v }));
}

const round = (n) => Math.round(n);

/**
 * Calculate a fare estimate.
 * params:
 *  - vehicles: the full { [id]: vehicleDef } map (from /api/rates)
 *  - vehicleId
 *  - tripType: airport | local | outstation | oneway | group
 *  - km: estimated total distance (number)
 *  - days: number of days (outstation only, default 1)
 *  - localPackageIdx: index into vehicle.local.packages
 *  - gstRate: decimal GST rate, e.g. 0.05 for 5%
 */
export function calculatePrice({ vehicles, vehicleId, tripType, km = 0, days = 1, localPackageIdx = 0, gstRate = 0.05 }) {
  const v = vehicles?.[vehicleId];
  if (!v) return { error: 'Unknown vehicle' };
  if (v.enquiryOnly || tripType === 'group') {
    return { enquiryOnly: true, label: v.label };
  }

  const breakdown = [];
  let subtotal = 0;
  const safeKm = Math.max(0, Number(km) || 0);
  const safeDays = Math.max(1, Number(days) || 1);

  if (tripType === 'airport') {
    if (!v.airport) return { error: `${v.label} is not available for airport transfers` };
    if (v.airport.flat) {
      subtotal = v.airport.flat;
      breakdown.push({ label: `Airport transfer package (up to ${v.airport.minKm} km)`, amount: subtotal });
      if (safeKm > v.airport.minKm && v.local) {
        const extraKm = safeKm - v.airport.minKm;
        const extraAmt = extraKm * v.local.extraKmRate;
        subtotal += extraAmt;
        breakdown.push({ label: `Extra ${extraKm} km x ₹${v.local.extraKmRate}/km`, amount: extraAmt });
      }
    } else {
      const chargeableKm = Math.max(safeKm, v.airport.minKm);
      subtotal = chargeableKm * v.airport.ratePerKm;
      breakdown.push({
        label: `${chargeableKm} km x ₹${v.airport.ratePerKm}/km (min ${v.airport.minKm} km)`,
        amount: subtotal,
      });
    }
  } else if (tripType === 'local') {
    if (!v.local?.packages?.length) return { error: `${v.label} is not available for local rentals` };
    const pkg = v.local.packages[localPackageIdx] || v.local.packages[0];
    subtotal = pkg.price;
    breakdown.push({ label: `${pkg.hrs} hrs / ${pkg.km} km package`, amount: pkg.price });
    if (safeKm > pkg.km) {
      const extraKm = safeKm - pkg.km;
      const extraAmt = extraKm * v.local.extraKmRate;
      subtotal += extraAmt;
      breakdown.push({ label: `Extra ${extraKm} km x ₹${v.local.extraKmRate}/km`, amount: extraAmt });
    }
    breakdown.push({ label: `Extra hour beyond ${pkg.hrs} hrs, if any: ₹${v.local.extraHrRate}/hr (charged as used)`, amount: null });
  } else if (tripType === 'outstation') {
    if (!v.outstation) return { error: `${v.label} is not available for outstation trips` };
    const totalMinKm = v.outstation.minKmPerDay * safeDays;
    const chargeableKm = Math.max(safeKm, totalMinKm);
    const fare = chargeableKm * v.outstation.ratePerKm;
    const da = v.outstation.da * safeDays;
    subtotal = fare + da;
    breakdown.push({
      label: `${chargeableKm} km x ₹${v.outstation.ratePerKm}/km (min ${totalMinKm} km for ${safeDays} day${safeDays > 1 ? 's' : ''})`,
      amount: fare,
    });
    breakdown.push({ label: `Driver Allowance (₹${v.outstation.da} x ${safeDays} day${safeDays > 1 ? 's' : ''})`, amount: da });
    breakdown.push({ label: 'Toll, state tax & parking — extra, pay as applicable', amount: null });
  } else if (tripType === 'oneway') {
    if (!v.oneWay) return { error: `${v.label} is not available for one-way drops` };
    const chargeableKm = Math.max(safeKm, v.oneWay.minKm);
    const fare = chargeableKm * v.oneWay.ratePerKm;
    subtotal = fare + v.oneWay.da;
    breakdown.push({
      label: `${chargeableKm} km x ₹${v.oneWay.ratePerKm}/km (min ${v.oneWay.minKm} km)`,
      amount: fare,
    });
    breakdown.push({ label: `Driver Allowance`, amount: v.oneWay.da });
    breakdown.push({ label: 'Toll, state tax & parking — extra, pay as applicable', amount: null });
  } else {
    return { error: 'Unknown trip type' };
  }

  const gst = round(subtotal * gstRate);
  const total = round(subtotal + gst);

  return {
    breakdown,
    subtotal: round(subtotal),
    gstRate,
    gst,
    total,
  };
}

export function formatINR(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return '₹' + Number(n).toLocaleString('en-IN');
}
