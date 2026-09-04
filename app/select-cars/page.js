'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehicleCard, { getVehicleImage } from '@/components/VehicleCard';
import { TRIP_TYPES, vehiclesForTripType, calculatePrice, formatINR } from '@/lib/pricing';
import { groupVehicles, getGroupLabel } from '@/lib/vehicleGrouping';

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
  // Group tt_ac / tt_nonac (and any other configured variant pairs) into a
  // single logical vehicle so they render as one story avatar and one card.
  const vehicleGroups = groupVehicles(vehicles);

  function handleSelect({ vehicleId, localPackageIdx, price }) {
    const next = new URLSearchParams(params.toString());
    next.set('vehicleId', vehicleId);
    next.set('localPackageIdx', String(localPackageIdx));
    router.push(`/booking?${next.toString()}`);
  }

  // Story row now selects/scrolls by group id (e.g. 'tt'), not raw vehicle id.
  function handleStoryClick(baseId) {
    setSelectedId(baseId);
    const node = cardRefs.current.get(baseId);
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
        ) : vehicleGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-sm text-asphalt/50">
            No vehicles are configured for this trip type yet. Please call or WhatsApp us directly.
          </div>
        ) : (
          <>
            <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
              {vehicleGroups.map((group) => {
                // Representative variant for the story avatar's image/price
                // preview (defaults to the first variant, e.g. tt_ac).
                const representative = group.variants[0];
                const storyPrice = calculatePrice({
                  vehicles: rates.vehicles,
                  vehicleId: representative.id,
                  tripType,
                  km,
                  days,
                  localPackageIdx: 0,
                  gstRate: rates.settings?.gstRate,
                });
                return (
                  <button
                    key={group.baseId}
                    type="button"
                    onClick={() => handleStoryClick(group.baseId)}
                    className="flex shrink-0 flex-col items-center gap-1"
                  >
                    <div
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 bg-mist p-1.5 ${
                        selectedId === group.baseId ? 'border-route-teal' : 'border-black/10'
                      }`}
                    >
                      <Image
                        src={getVehicleImage(representative)}
                        alt={getGroupLabel(group)}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <span
                      className={`max-w-[72px] truncate text-xs font-semibold ${
                        selectedId === group.baseId ? 'text-route-teal' : 'text-asphalt/70'
                      }`}
                    >
                      {getGroupLabel(group)}
                    </span>
                    <span className="text-[11px] font-bold text-asphalt/80">
                      {storyPrice?.enquiryOnly ? 'Enquire' : formatINR(storyPrice?.subtotal)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {vehicleGroups.map((group) => (
                <div
                  key={group.baseId}
                  ref={(node) => {
                    if (node) cardRefs.current.set(group.baseId, node);
                  }}
                  className={
                    selectedId === group.baseId
                      ? 'rounded-2xl ring-2 ring-route-teal ring-offset-2'
                      : ''
                  }
                >
                  <VehicleCard
                    group={group}
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