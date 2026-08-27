// Free, keyless place search + driving-distance calculation, using
// OpenStreetMap's public services instead of a paid API:
//  - A curated list of Bengaluru localities (lib/bangalore-areas.js) for
//    instant, typo-tolerant suggestions that cover the whole city.
//  - Nominatim (nominatim.openstreetmap.org) for live address geocoding.
//  - Driving distance is computed server-side at /api/distance (OSRM/Valhalla)
//    so the browser never talks to a routing server directly.
//
// These OSM services are free and need no API key or billing account. They ARE
// shared public demo servers with a light usage policy (~1 request/second), so
// for a small business site this is fine; if traffic grows a lot you may want
// to self-host Nominatim/OSRM — see the README for notes on that.

import { searchLocalAreas } from './bangalore-areas';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

// Bias Nominatim toward the Bengaluru metro area (soft preference, not a hard
// filter) so local streets rank above same-named places elsewhere in India.
// Format: left,top,right,bottom  (lon,lat,lon,lat).
const BLR_VIEWBOX = '77.30,13.35,77.95,12.65';

// Ambiguous-name landmarks that OSM/Nominatim can resolve to the wrong
// place (e.g. "Kempegowda" alone matches the city-centre bus station
// before the international airport 35km away). Pinning known-good
// coordinates for these means the correct option always appears, clearly
// labeled, instead of silently picking the wrong "Kempegowda".
const KNOWN_PLACES = [
  {
    keywords: ['kempegowda international airport', 'bengaluru airport', 'bangalore airport', 'blr airport', 'kia airport'],
    address: 'Kempegowda International Airport (BLR), Devanahalli, Bengaluru, Karnataka',
    lat: 13.1986,
    lng: 77.7066,
  },
  {
    keywords: ['majestic bus station', 'kempegowda bus station', 'kbs majestic'],
    address: 'Kempegowda Bus Station (Majestic), Bengaluru, Karnataka',
    lat: 12.9772,
    lng: 77.572,
  },
  {
    keywords: ['ksr bengaluru', 'bangalore city railway station', 'majestic railway station', 'krantivira sangolli rayanna'],
    address: 'KSR Bengaluru City Railway Station, Majestic, Bengaluru, Karnataka',
    lat: 12.9767,
    lng: 77.5713,
  },
];

function matchesKnownPlace(query, place) {
  const q = query.toLowerCase();
  return place.keywords.some((k) => k.includes(q) || q.includes(k.split(' ')[0]));
}

function isNear(a, b, tol = 0.008) {
  return Math.abs(a.lat - b.lat) < tol && Math.abs(a.lng - b.lng) < tol;
}

function normName(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Suggest places for a (possibly misspelled) query. Combines, in order:
 *   1. pinned landmarks (airport / bus / rail),
 *   2. curated Bengaluru localities (instant + typo-tolerant),
 *   3. live Nominatim results (exact streets / anywhere in India).
 * Curated entries carry `refine: true` so PlaceInput can fetch exact
 * coordinates when one is chosen.
 */
export async function searchPlaces(query) {
  const q = query?.trim();
  if (!q || q.length < 2) return [];

  const pinned = KNOWN_PLACES.filter((p) => matchesKnownPlace(q, p)).map((p) => ({
    address: p.address,
    lat: p.lat,
    lng: p.lng,
  }));

  const local = searchLocalAreas(q, 6).map((a) => ({
    address: a.address,
    lat: a.lat,
    lng: a.lng,
    refine: true, // approximate centre — refine to precise coords on select
  }));

  // Only hit the network once there are enough characters to be meaningful;
  // curated matches already cover 2-character prefixes instantly.
  let live = [];
  if (q.length >= 3) {
    try {
      const res = await fetch(
        `${NOMINATIM_URL}/search?format=jsonv2&addressdetails=0&dedupe=1&limit=6` +
          `&countrycodes=in&viewbox=${BLR_VIEWBOX}&q=${encodeURIComponent(q)}`,
        { headers: { Accept: 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        live = data.map((d) => ({ address: d.display_name, lat: parseFloat(d.lat), lng: parseFloat(d.lon) }));
      }
    } catch {
      // Network hiccup — fall through with pinned + curated matches.
    }
  }

  // Dedupe: drop pinned dupes from curated, then drop live results that
  // coincide with a pinned/curated point or repeat a curated locality name.
  const localFiltered = local.filter((l) => !pinned.some((p) => isNear(p, l)));
  const chosen = [...pinned, ...localFiltered];
  const localNames = new Set(localFiltered.map((l) => normName(l.address.split(',')[0])));

  const liveFiltered = live.filter((l) => {
    if (chosen.some((c) => isNear(c, l))) return false;
    if (localNames.has(normName(l.address.split(',')[0]))) return false;
    return true;
  });

  return [...chosen, ...liveFiltered].slice(0, 8);
}

// Fetch precise coordinates for a curated locality when the user selects it.
// Falls back to the approximate curated centre if geocoding fails.
export async function refinePlace(entry) {
  try {
    const res = await fetch(
      `${NOMINATIM_URL}/search?format=jsonv2&addressdetails=0&limit=1` +
        `&countrycodes=in&viewbox=${BLR_VIEWBOX}&q=${encodeURIComponent(entry.address)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // ignore — use the approximate centre below
  }
  return { lat: entry.lat, lng: entry.lng };
}

export async function geocodeAddress(address) {
  const results = await searchPlaces(address);
  if (!results.length) throw new Error('Could not locate that address');
  return results[0];
}

// Total driving distance in km for origin -> waypoints (in order) ->
// destination. Delegates to our server route (/api/distance), which tries
// Valhalla then OSRM and applies a small real-road buffer.
export async function calcRouteKm(origin, destination, waypoints = []) {
  const points = [origin, ...waypoints, destination]
    .filter((p) => p && typeof p.lat === 'number' && typeof p.lng === 'number')
    .map((p) => ({ lat: p.lat, lng: p.lng }));

  if (points.length < 2) throw new Error('Please pick both a pickup and drop location');

  const res = await fetch('/api/distance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok || typeof data.km !== 'number') {
    throw new Error(data?.error || 'Could not calculate distance for this route');
  }
  return data.km;
}
