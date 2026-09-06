'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehicleCard, { getVehicleImage } from '@/components/VehicleCard';
import { TRIP_TYPES, vehiclesForTripType, calculatePrice, formatINR } from '@/lib/pricing';

// ---- Combined AC / Non-AC card (e.g. Tempo Traveller) ----
function TTCombinedCard({ variants, vehicles, tripType, km, days, gstRate, onSelect }) {
  const sorted = useMemo(
    () =>
      [...variants].sort((a, b) => {
        const aAc = /(^|[_-])ac($|[_-])/i.test(a.id) && !/non/i.test(a.id);
        const bAc = /(^|[_-])ac($|[_-])/i.test(b.id) && !/non/i.test(b.id);
        return aAc === bAc ? 0 : aAc ? -1 : 1;
      }),
    [variants]
  );

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [localPackageIdx, setLocalPackageIdx] = useState(0);
  const vehicle = sorted[selectedIdx];
  const imageSrc = getVehicleImage(vehicle);

  function labelFor(v) {
    return /non/i.test(v.id) ? 'Non-AC' : 'AC';
  }

  const price = useMemo(
    () =>
      calculatePrice({
        vehicles,
        vehicleId: vehicle.id,
        tripType,
        km,
        days,
        localPackageIdx,
        gstRate,
      }),
    [vehicles, vehicle.id, tripType, km, days, localPackageIdx, gstRate]
  );

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-mist p-2 sm:h-24 sm:w-32">
          <Image src={imageSrc} alt={vehicle.label} fill sizes="128px" className="object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-asphalt">{vehicle.label}</span>
            <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-route-teal">
              12 seats
            </span>
          </div>
          <div className="text-sm text-asphalt/50">12 seater, {labelFor(vehicle)}</div>

          <div className="mt-3 flex flex-wrap gap-2">
            {sorted.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setLocalPackageIdx(0);
                }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  selectedIdx === idx
                    ? 'border-route-teal bg-route-teal/10 text-route-teal'
                    : 'border-black/10 text-asphalt/60 hover:border-asphalt/30'
                }`}
              >
                {labelFor(v)}
              </button>
            ))}
          </div>

          {tripType === 'local' && vehicle.local?.packages?.length > 1 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {vehicle.local.packages.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLocalPackageIdx(idx)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    localPackageIdx === idx
                      ? 'border-route-teal bg-route-teal/10 text-route-teal'
                      : 'border-black/10 text-asphalt/60 hover:border-asphalt/30'
                  }`}
                >
                  {p.hrs} hrs / {p.km} km
                </button>
              ))}
            </div>
          )}

          {price?.error && <p className="mt-2 text-xs font-medium text-amber-dark">{price.error}</p>}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        {price?.enquiryOnly ? (
          <span className="text-sm font-semibold text-asphalt/60">Price on request</span>
        ) : price?.subtotal !== undefined ? (
          <>
            <span className="font-display text-2xl font-extrabold text-asphalt">{formatINR(price.subtotal)}</span>
            <span className="text-[11px] text-asphalt/40">+ GST · choose payment at checkout</span>
          </>
        ) : null}
        <button
          type="button"
          disabled={!!price?.error}
          onClick={() => onSelect({ vehicleId: vehicle.id, localPackageIdx, price })}
          className="focus-ring rounded-full bg-amber px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-dark disabled:opacity-40"
        >
          {price?.enquiryOnly ? 'Request Quote' : 'Select Car'}
        </button>
      </div>
    </div>
  );
}

// Groups vehicles like tt_ac / tt_nonac into one entry; leaves everything else untouched
function groupVehicles(vehicles) {
  const groups = {};
  const singles = [];
  for (const v of vehicles) {
    const m = v.id.match(/^(.*?)_?(non_?ac|nonac|ac)$/i);
    if (m && m[1]) {
      const base = m[1];
      groups[base] = groups[base] || [];
      groups[base].push(v);
    } else {
      singles.push(v);
    }
  }
  const combined = [];
  Object.entries(groups).forEach(([base, arr]) => {
    if (arr.length >= 2) {
      combined.push({ base, variants: arr });
    } else {
      singles.push(...arr);
    }
  });
  return { combined, singles };
}

function SelectCarsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const cardRefs = useRef(new Map());

  const tripType = params.get('tripType') || 'airport';
  const pickup = params.get('pickup') || '';
  const drop = params.get('drop') || '';
  const date = params.get('date') || '';
  const time = params.get('time') || '';
  const returnDate = params.get('returnDate') || '';
  const km = Number(params.get('km')) || 0;
  const stops = (() => {
    try {
      return JSON.parse(params.get('stops') || '[]');
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
      .then((data) => setRates(data))
      .finally(() => setLoading(false));
  }, []);

  const tripTypeLabel = TRIP_TYPES.find((t) => t.id === tripType)?.label || tripType;
  const vehicles = rates ? vehiclesForTripType(rates.vehicles, tripType) : [];
  const { combined, singles } = groupVehicles(vehicles);

  function handleSelect({ vehicleId, localPackageIdx, price }) {
    const next = new URLSearchParams(params.toString());
    next.set('vehicleId', vehicleId);
    next.set('localPackageIdx', String(localPackageIdx));
    router.push(`/booking?${next.toString()}`);
  }

  function handleStoryClick(key) {
    setSelectedId(key);
    const node = cardRefs.current.get(key);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return (
    <main>
      <Header />
      <div className="bg-mist">
        <div className="mx-auto max-w-5xl px-5 py-6">
          <button
            onClick={() => router.push('/')}
            className="focus-ring text-sm font-semibold text-route-teal hover:underline"
          >
            ← Modify search
          </button>
          <h1 className="mt-2 font-display text-2xl font-bold text-asphalt sm:text-3xl">
            {[pickup, ...stops, drop].filter(Boolean).join(' → ')}
          </h1>
          <p className="mt-1 text-sm text-asphalt/60">
            {tripTypeLabel} · {date} {time} {tripType === 'outstation' ? `· ${days} day(s)` : ''}
            {km ? ` · ${km} km` : ''}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {loading ? (
          <p className="text-sm text-asphalt/50">Loading cabs…</p>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-sm text-asphalt/50">
            No vehicles are configured for this trip type yet. Please call or WhatsApp us directly.
          </div>
        ) : (
          <>
            <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
              {singles.map((v) => {
                const storyPrice = calculatePrice({
                  vehicles: rates.vehicles,
                  vehicleId: v.id,
                  tripType,
                  km,
                  days,
                  localPackageIdx: 0,
                  gstRate: rates.settings?.gstRate,
                });
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleStoryClick(v.id)}
                    className="flex shrink-0 flex-col items-center gap-1"
                  >
                    <div
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 bg-mist p-1.5 ${
                        selectedId === v.id ? 'border-route-teal' : 'border-black/10'
                      }`}
                    >
                      <Image src={getVehicleImage(v)} alt={v.label} fill sizes="64px" className="object-contain" />
                    </div>
                    <span
                      className={`max-w-[72px] truncate text-xs font-semibold ${
                        selectedId === v.id ? 'text-route-teal' : 'text-asphalt/70'
                      }`}
                    >
                      {v.label}
                    </span>
                    <span className="text-[11px] font-bold text-asphalt/80">
                      {storyPrice?.enquiryOnly ? 'Enquire' : formatINR(storyPrice?.subtotal)}
                    </span>
                  </button>
                );
              })}

              {combined.map(({ base, variants }) => {
                const first = variants[0];
                const storyPrice = calculatePrice({
                  vehicles: rates.vehicles,
                  vehicleId: first.id,
                  tripType,
                  km,
                  days,
                  localPackageIdx: 0,
                  gstRate: rates.settings?.gstRate,
                });
                return (
                  <button
                    key={base}
                    type="button"
                    onClick={() => handleStoryClick(base)}
                    className="flex shrink-0 flex-col items-center gap-1"
                  >
                    <div
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 bg-mist p-1.5 ${
                        selectedId === base ? 'border-route-teal' : 'border-black/10'
                      }`}
                    >
                      <Image src={getVehicleImage(first)} alt={first.label} fill sizes="64px" className="object-contain" />
                    </div>
                    <span
                      className={`max-w-[72px] truncate text-xs font-semibold ${
                        selectedId === base ? 'text-route-teal' : 'text-asphalt/70'
                      }`}
                    >
                      {first.label}
                    </span>
                    <span className="text-[11px] font-bold text-asphalt/80">
                      {storyPrice?.enquiryOnly ? 'Enquire' : formatINR(storyPrice?.subtotal)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {singles.map((v) => (
                <div
                  key={v.id}
                  ref={(node) => {
                    if (node) cardRefs.current.set(v.id, node);
                  }}
                  className={selectedId === v.id ? 'rounded-2xl ring-2 ring-route-teal ring-offset-2' : ''}
                >
                  <VehicleCard
                    vehicle={v}
                    vehicles={rates.vehicles}
                    tripType={tripType}
                    km={km}
                    days={days}
                    gstRate={rates.settings?.gstRate}
                    onSelect={handleSelect}
                  />
                </div>
              ))}

              {combined.map(({ base, variants }) => (
                <div
                  key={base}
                  ref={(node) => {
                    if (node) cardRefs.current.set(base, node);
                  }}
                  className={selectedId === base ? 'rounded-2xl ring-2 ring-route-teal ring-offset-2' : ''}
                >
                  <TTCombinedCard
                    variants={variants}
                    vehicles={rates.vehicles}
                    tripType={tripType}
                    km={km}
                    days={days}
                    gstRate={rates.settings?.gstRate}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function SelectCarsPage() {
  return (
    <Suspense fallback={null}>
      <SelectCarsInner />
    </Suspense>
  );
}