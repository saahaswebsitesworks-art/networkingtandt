'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TRIP_TYPES } from '@/lib/pricing';
import { PlaneIcon, ClockIcon, RouteIcon, ShieldIcon, RupeeIcon } from './Icons';
import PlaceInput from './PlaceInput';
import { geocodeAddress, calcRouteKm } from '@/lib/geo';

const todayStr = () => new Date().toISOString().slice(0, 10);

// Short banner shown between the trip-type tabs and the form fields —
// purely decorative branding text, easy to change here in one place.
const TAGLINE = "BENGALURU'S TRUSTED CAB SERVICE";

// The "group / enquiry" trip type lives in the nav bar (Group Booking page)
// instead of as a tab here, since it doesn't take a normal search. "oneway"
// is also excluded from the main tab row — it's folded into the Outstation
// tab as a One Way / Round Trip sub-toggle instead of being its own tab
// (see the toggle below). Its tripType value ('oneway') is unchanged, so
// pricing/booking on the results page keeps working exactly as before.
const MAIN_TABS = TRIP_TYPES.filter((t) => t.id !== 'group' && t.id !== 'oneway');

const TAB_ICONS = {
  airport: PlaneIcon,
  local: ClockIcon,
  outstation: RouteIcon,
};

let stopIdCounter = 0;
const newStop = () => ({ _id: ++stopIdCounter, address: '', place: null });

// Small inline icons specific to this form's card styling — kept local
// rather than added to Icons.js since they're single-purpose UI glyphs,
// not vehicle/trust icons used elsewhere.
function PinIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function CalendarIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function SwapIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v14M8 17l-4-4M8 17l4-4" />
      <path d="M16 21V7M16 7l4 4M16 7l-4 4" />
    </svg>
  );
}

function HeadsetIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2" y="13" width="5" height="7" rx="2" />
      <rect x="17" y="13" width="5" height="7" rx="2" />
      <path d="M20 20a4 4 0 0 1-4 4h-2" />
    </svg>
  );
}

// Rounded, pale-tinted card used for the From / To / Trip-start fields.
function CardField({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl border border-route-teal/15 bg-route-teal/[0.04] px-4 py-3 transition focus-within:border-route-teal/50">
      <div className="flex items-start gap-3">
        {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-route-teal" />}
        <div className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-route-teal/70">{label}</span>
          {children}
        </div>
      </div>
    </div>
  );
}

const cardInputClass =
  'w-full border-0 bg-transparent p-0 text-base font-semibold text-asphalt placeholder:font-normal placeholder:text-asphalt/40 focus:outline-none focus:ring-0';

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
  // 'idle' | 'calculating' | 'auto' | 'error' — distance is always computed
  // from a real route, and calculated silently in the background; it's
  // only surfaced near the submit button if something needs attention.
  const [kmStatus, setKmStatus] = useState('idle');
  const [error, setError] = useState('');

  const isOutstationGroup = tripType === 'outstation' || tripType === 'oneway';
  const usesRoute = tripType === 'airport' || isOutstationGroup;

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
        // Outstation round trip: pickup -> stops -> destination -> back to pickup.
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

  function swapLocations() {
    const prevPickup = pickup;
    const prevPickupPlace = pickupPlace;
    setPickup(drop);
    setPickupPlace(dropPlace);
    setDrop(prevPickup);
    setDropPlace(prevPickupPlace);
    setKmStatus('idle');
  }

  // Clicking a main tab: Airport/Local switch directly. The Outstation tab
  // represents a group of two tripType values (oneway / outstation) — if
  // neither is already active, default to One Way (matches the reference
  // design, which highlights "One Way" by default).
  function selectMainTab(id) {
    const nextType = id === 'outstation' ? (isOutstationGroup ? tripType : 'oneway') : id;
    setTripType(nextType);
    setError('');
    if (nextType !== 'outstation') setStops([]);
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
      {/* Trip type tabs — one connected segmented control */}
      <div className="flex overflow-hidden rounded-2xl border-2 border-black/10">
        {MAIN_TABS.map((t, i) => {
          const Icon = TAB_ICONS[t.id];
          const active = t.id === 'outstation' ? isOutstationGroup : tripType === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => selectMainTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-3 text-[11px] font-bold uppercase tracking-wide transition sm:text-sm ${
                i !== 0 ? 'border-l border-black/10' : ''
              } ${active ? 'bg-route-teal text-white' : 'bg-white text-asphalt/70 hover:bg-route-teal/5'}`}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Decorative tagline banner */}
      <div className="mt-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-route-teal/30" />
        <span className="shrink-0 text-center text-xs font-extrabold uppercase tracking-wide text-asphalt sm:text-sm">{TAGLINE}</span>
        <span className="h-px flex-1 bg-route-teal/30" />
      </div>

      {/* One Way / Round Trip sub-toggle — only for the Outstation group */}
      {isOutstationGroup && (
        <div className="mt-4 flex overflow-hidden rounded-2xl border-2 border-black/10">
          <button
            type="button"
            onClick={() => {
              setTripType('oneway');
              setError('');
              setStops([]);
            }}
            className={`flex-1 border-r border-black/10 px-3 py-2.5 text-center transition ${
              tripType === 'oneway' ? 'bg-route-teal text-white' : 'bg-white text-asphalt hover:bg-route-teal/5'
            }`}
          >
            <span className="block text-sm font-extrabold uppercase tracking-wide">One Way</span>
            <span className={`block text-[11px] ${tripType === 'oneway' ? 'text-white/80' : 'text-asphalt/50'}`}>Drop-off Only</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTripType('outstation');
              setError('');
            }}
            className={`flex-1 px-3 py-2.5 text-center transition ${
              tripType === 'outstation' ? 'bg-route-teal text-white' : 'bg-white text-asphalt hover:bg-route-teal/5'
            }`}
          >
            <span className="block text-sm font-extrabold uppercase tracking-wide">Round Trip</span>
            <span className={`block text-[11px] ${tripType === 'outstation' ? 'text-white/80' : 'text-asphalt/50'}`}>Return With Same Cab</span>
          </button>
        </div>
      )}

      {/* Route: From / To, stacked, with a swap button floating at the seam */}
      <div className="relative mt-4 flex flex-col gap-3">
        <CardField icon={PinIcon} label="From">
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
              className={cardInputClass}
            />
          ) : (
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g. Manyata Tech Park"
              className={cardInputClass}
              required
            />
          )}
        </CardField>

        {tripType !== 'local' && (
          <CardField icon={PinIcon} label="To">
            <PlaceInput
              value={drop}
              onChange={(v) => {
                setDrop(v);
                setKmStatus('idle');
              }}
              onPlaceSelect={setDropPlace}
              placeholder="e.g. Thanisandra, Bengaluru"
              required
              className={cardInputClass}
            />
          </CardField>
        )}

        {tripType !== 'local' && (
          <button
            type="button"
            onClick={swapLocations}
            aria-label="Swap pickup and drop"
            className="focus-ring absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-route-teal/30 bg-white text-route-teal shadow-md transition hover:bg-route-teal/5 active:scale-95"
          >
            <SwapIcon />
          </button>
        )}
      </div>

      {/* Stops — only for outstation round trips */}
      {tripType === 'outstation' && (
        <div className="mt-3">
          {stops.length > 0 && (
            <div className="mb-2 space-y-2">
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
          )}
          {stops.length < 5 && (
            <button
              type="button"
              onClick={addStop}
              className="focus-ring rounded-full border-2 border-route-teal px-4 py-2 text-xs font-bold text-route-teal transition hover:bg-route-teal/5"
            >
              + Add a stop
            </button>
          )}
        </div>
      )}

      {/* Trip start — date and time stacked in one card */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <CardField icon={CalendarIcon} label={tripType === 'outstation' ? 'Trip start' : 'Date & time'}>
          <div className="flex flex-col gap-0.5">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cardInputClass} required />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-auto border-0 bg-transparent p-0 text-sm font-medium text-asphalt/50 focus:outline-none focus:ring-0"
              required
            />
          </div>
        </CardField>

        {tripType === 'outstation' && (
          <CardField icon={CalendarIcon} label="Return date">
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className={cardInputClass}
              required
            />
          </CardField>
        )}
      </div>

      {/* Quiet status line — only appears while calculating or on error */}
      {usesRoute && (kmStatus === 'calculating' || kmStatus === 'error') && (
        <p className={`mt-3 text-center text-xs font-medium ${kmStatus === 'error' ? 'text-amber-dark' : 'text-asphalt/50'}`}>
          {kmStatus === 'calculating' ? 'Calculating distance…' : "Couldn't calculate distance — try re-selecting pickup and drop."}
        </p>
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

      {/* Trust badges */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-asphalt/60">
        <span className="flex items-center gap-1.5">
          <ShieldIcon className="h-4 w-4 text-route-teal" />
          Verified Drivers
        </span>
        <span className="flex items-center gap-1.5">
          <RupeeIcon className="h-4 w-4 text-route-teal" />
          Transparent Pricing
        </span>
        <span className="flex items-center gap-1.5">
          <HeadsetIcon className="h-4 w-4 text-route-teal" />
          24x7 Support
        </span>
      </div>
    </form>
  );
}

export default function SearchForm() {
  return (
    <Suspense fallback={null}>
      <SearchFormInner />
    </Suspense>
  );
}