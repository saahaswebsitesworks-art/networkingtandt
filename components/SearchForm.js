'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TRIP_TYPES } from '@/lib/pricing';
import { PlaneIcon, ClockIcon, RouteIcon, ArrowRouteIcon } from './Icons';
import PlaceInput from './PlaceInput';
import { geocodeAddress, calcRouteKm } from '@/lib/geo';

const todayStr = () => new Date().toISOString().slice(0, 10);

// The "group / enquiry" trip type lives in the nav bar (Group Booking page)
// instead of as a tab here, since it doesn't take a normal search.
const HOME_TRIP_TYPES = TRIP_TYPES.filter((t) => t.id !== 'group');

const TAB_ICONS = {
  airport: PlaneIcon,
  local: ClockIcon,
  outstation: RouteIcon,
  oneway: ArrowRouteIcon,
};

let stopIdCounter = 0;
const newStop = () => ({ _id: ++stopIdCounter, address: '', place: null });

function SearchFormInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [tripType, setTripType] = useState(params.get('tripType') || 'airport');
  const [pickup, setPickup] = useState(params.get('pickup') || '');
  const [pickupPlace, setPickupPlace] = useState(null);
  const [drop, setDrop] = useState(params.get('drop') || '');
  const [dropPlace, setDropPlace] = useState(null);
  const [stops, setStops] = useState([]);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(todayStr());

  const [km, setKm] = useState(0);
  // 'idle' | 'calculating' | 'auto' | 'error' — there's no manual entry
  // anymore: distance always comes from a real route calculation.
  const [kmStatus, setKmStatus] = useState('idle');
  const [error, setError] = useState('');

  const usesRoute = tripType === 'airport' || tripType === 'outstation' || tripType === 'oneway';

  // Silently resolve any pre-filled pickup/drop text (from Popular Routes
  // links) into map coordinates, without forcing the user to re-pick from
  // the dropdown.
  useEffect(() => {
    if (pickup && !pickupPlace) geocodeAddress(pickup).then(setPickupPlace).catch(() => {});
    if (drop && !dropPlace) geocodeAddress(drop).then(setDropPlace).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-calculate distance whenever the route (pickup/drop/stops) changes.
  useEffect(() => {
    if (!usesRoute) return;
    if (!pickupPlace || !dropPlace) {
      setKmStatus('idle');
      return;
    }
    const unresolvedStop = stops.some((s) => s.address.trim() && !s.place);
    if (unresolvedStop) {
      setKmStatus('idle');
      return;
    }

    let cancelled = false;
    setKmStatus('calculating');
    (async () => {
      try {
        const stopPlaces = stops.filter((s) => s.place).map((s) => s.place);
        // Outstation is a round trip: pickup -> stops -> destination -> back to pickup.
        const destination = tripType === 'outstation' ? pickupPlace : dropPlace;
        const waypoints = tripType === 'outstation' ? [...stopPlaces, dropPlace] : [];
        const result = await calcRouteKm(pickupPlace, destination, waypoints);
        if (cancelled) return;
        setKm(result);
        setKmStatus('auto');
      } catch {
        if (!cancelled) setKmStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripType, pickupPlace, dropPlace, JSON.stringify(stops.map((s) => s.place))]);

  function addStop() {
    setStops((s) => (s.length >= 5 ? s : [...s, newStop()]));
  }
  function updateStop(id, patch) {
    setStops((s) => s.map((st) => (st._id === id ? { ...st, ...patch } : st)));
  }
  function removeStop(id) {
    setStops((s) => s.filter((st) => st._id !== id));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!pickup.trim()) {
      setError('Please enter a pickup location.');
      return;
    }
    if (tripType !== 'local' && !drop.trim()) {
      setError('Please enter a drop location.');
      return;
    }
    if (usesRoute) {
      if (!pickupPlace || !dropPlace) {
        setError('Please pick your pickup and drop location from the suggestions so we can calculate the exact distance.');
        return;
      }
      if (kmStatus === 'calculating') {
        setError('Still calculating distance — one moment and try again.');
        return;
      }
      if (kmStatus !== 'auto') {
        setError("We couldn't calculate the distance for this route. Please re-select the pickup and drop from the suggestions.");
        return;
      }
    }
    setError('');

    const stopAddresses = stops.map((s) => s.address.trim()).filter(Boolean);

    // Ordered coordinates (pickup -> stops -> drop) so the booking page can
    // draw the route on a keyless Google Maps embed.
    const routePts = [];
    if (usesRoute && pickupPlace && dropPlace) {
      routePts.push({ lat: pickupPlace.lat, lng: pickupPlace.lng });
      stops.filter((s) => s.place).forEach((s) => routePts.push({ lat: s.place.lat, lng: s.place.lng }));
      routePts.push({ lat: dropPlace.lat, lng: dropPlace.lng });
    }

    const searchParams = new URLSearchParams({
      tripType,
      pickup,
      drop,
      date,
      time,
      returnDate: tripType === 'outstation' ? returnDate : '',
      km: usesRoute ? String(km) : '0',
      stops: JSON.stringify(stopAddresses),
      routePts: JSON.stringify(routePts),
    });
    router.push(`/select-cars?${searchParams.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black/5 bg-white p-6 shadow-lift sm:p-8">
      {/* Trip type tabs, segmented-control style */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
        {HOME_TRIP_TYPES.map((t) => {
          const Icon = TAB_ICONS[t.id];
          const active = tripType === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => {
                setTripType(t.id);
                setError('');
                if (t.id !== 'outstation') setStops([]);
              }}
              className={`focus-ring flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-bold uppercase tracking-wide transition sm:text-sm ${
                active
                  ? 'border-route-teal bg-route-teal text-white shadow-sm'
                  : 'border-black/10 text-asphalt/60 hover:border-route-teal/40 hover:text-asphalt'
              }`}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />}
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Pickup location">
          {usesRoute ? (
            <PlaceInput
              value={pickup}
              onChange={(v) => {
                setPickup(v);
                setKmStatus('idle');
              }}
              onPlaceSelect={setPickupPlace}
              placeholder="e.g. Kempegowda Airport"
              required
            />
          ) : (
            <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="e.g. Manyata Tech Park" className="ntt-input" required />
          )}
        </Field>

        {tripType !== 'local' && (
          <Field label={tripType === 'outstation' ? 'Destination' : 'Drop location'}>
            <PlaceInput
              value={drop}
              onChange={(v) => {
                setDrop(v);
                setKmStatus('idle');
              }}
              onPlaceSelect={setDropPlace}
              placeholder="e.g. Thanisandra, Bengaluru"
              required
            />
          </Field>
        )}

        <Field label={tripType === 'outstation' ? 'Start date' : 'Date'}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="ntt-input" required />
        </Field>

        {tripType === 'outstation' ? (
          <Field label="Return date">
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="ntt-input" required />
          </Field>
        ) : (
          <Field label="Pickup time">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="ntt-input" required />
          </Field>
        )}

        {usesRoute && kmStatus === 'idle' && (
          <Field label="Distance">
            <div className="ntt-input flex items-center text-asphalt/40">Select pickup &amp; drop first</div>
          </Field>
        )}

        {usesRoute && kmStatus === 'calculating' && (
          <Field label="Distance">
            <div className="ntt-input flex items-center text-asphalt/50">Calculating distance…</div>
          </Field>
        )}

        {usesRoute && kmStatus === 'error' && (
          <Field label="Distance">
            <div className="ntt-input flex items-center text-amber-dark">Couldn&apos;t calculate — try re-selecting</div>
          </Field>
        )}

        {usesRoute && kmStatus === 'auto' && (
          <Field label="Distance (auto-calculated)">
            <div className="ntt-input font-semibold text-route-teal">{km} km</div>
          </Field>
        )}
      </div>

      {/* Stops — only for outstation round trips */}
      {tripType === 'outstation' && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-asphalt/50">
            Stops along the way (optional)
          </div>
          <div className="space-y-2">
            {stops.map((s, idx) => (
              <div key={s._id} className="flex items-center gap-2">
                <span className="shrink-0 text-xs font-semibold text-asphalt/40">{idx + 1}.</span>
                <div className="flex-1">
                  <PlaceInput
                    value={s.address}
                    onChange={(v) => updateStop(s._id, { address: v, place: null })}
                    onPlaceSelect={(p) => updateStop(s._id, { place: p })}
                    placeholder="e.g. Mysore Palace"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStop(s._id)}
                  className="focus-ring shrink-0 rounded-lg border border-black/10 px-2 py-2 text-xs text-amber-dark hover:border-amber/40"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {stops.length < 5 && (
            <button
              type="button"
              onClick={addStop}
              className="focus-ring mt-2 rounded-full border border-route-teal px-3 py-1.5 text-xs font-semibold text-route-teal"
            >
              + Add stop
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-center text-sm font-medium text-amber-dark">{error}</p>}

      <div className="mt-7 flex justify-center">
        <button
          type="submit"
          className="focus-ring w-full rounded-full bg-amber px-12 py-4 text-center font-display text-base font-bold uppercase tracking-wide text-white transition hover:bg-amber-dark sm:w-auto"
        >
          Explore Cabs
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-asphalt/40">
        Booking a bus or tempo traveller for a large group?{' '}
        <a href="/group-booking" className="font-semibold text-route-teal hover:underline">
          Enquire here
        </a>
      </p>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-asphalt/50">{label}</span>
      {children}
    </label>
  );
}

export default function SearchForm() {
  return (
    <Suspense fallback={null}>
      <SearchFormInner />
    </Suspense>
  );
}
