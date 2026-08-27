'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/VehicleCard';
import { TRIP_TYPES, vehiclesForTripType } from '@/lib/pricing';

function SelectCarsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

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

  function handleSelect({ vehicleId, localPackageIdx, price }) {
    const next = new URLSearchParams(params.toString());
    next.set('vehicleId', vehicleId);
    next.set('localPackageIdx', String(localPackageIdx));
    router.push(`/booking?${next.toString()}`);
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
          <div className="space-y-4">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                vehicles={rates.vehicles}
                tripType={tripType}
                km={km}
                days={days}
                gstRate={rates.settings?.gstRate}
                onSelect={handleSelect}
              />
            ))}
          </div>
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
