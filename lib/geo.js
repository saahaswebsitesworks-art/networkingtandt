// Free, keyless place search + driving-distance calculation, using
// OpenStreetMap's public services instead of a paid API:
//  - A curated list of Bengaluru localities (lib/bangalore-areas.js) for
//    instant, typo-tolerant suggestions that cover the whole city.
//  - Photon (photon.komoot.io) for Uber/Ola-style search-as-you-type over
//    every OSM place: shops, apartments, hospitals, tech parks, PGs, etc.
//  - Ola Maps Places Autocomplete — same place database the Ola app uses.
//  - Nominatim (nominatim.openstreetmap.org) as a last fallback for full
//    addresses when the other sources return little.
//  - Driving distance is computed server-side at /api/distance (OSRM/Valhalla)
//    so the browser never talks to a routing server directly.
//
// These OSM services are free and need no API key or billing account. They ARE
// shared public demo servers with a light usage policy (~1 request/second), so
// for a small business site this is fine; if traffic grows a lot you may want
// to self-host Nominatim/OSRM/Photon — see the README for notes on that.

import { searchLocalAreas } from './bangalore-areas';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const PHOTON_URL = 'https://photon.komoot.io/api/';
const OLA_AUTOCOMPLETE_URL = 'https://api.olamaps.io/places/v1/autocomplete';

// Ola Maps API key (Krutrim → Ola Maps → Maps Credentials).
const OLA_MAPS_API_KEY = 'XopUkWlNiK1KbJBoPIWjbHHvw4MEeitczQYtS6Gi';

const OLA_ENABLED =
  Boolean(OLA_MAPS_API_KEY) && OLA_MAPS_API_KEY !== 'PASTE_YOUR_OLA_MAPS_KEY_HERE';

// Bengaluru city centre — used to rank nearby places first.
const BLR_CENTER = { lat: 12.9716, lng: 77.5946 };

// Bias Nominatim toward the Bengaluru metro area (soft preference, not a hard
// filter) so local streets rank above same-named places elsewhere in India.
// Format: left,top,right,bottom  (lon,lat,lon,lat).
const BLR_VIEWBOX = '77.30,13.35,77.95,12.65';

const MAX_RESULTS = 10;

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

function hasCoords(p) {
  return p && Number.isFinite(p.lat) && Number.isFinite(p.lng);
}

// Build a readable "Name, Street, Area, City, State" label from a Photon
// feature, skipping empty and repeated parts.
function photonLabel(props) {
  const street =
    props.street && props.housenumber ? `${props.housenumber} ${props.street}` : props.street;
  const parts = [
    props.name,
    street,
    props.locality,
    props.district,
    props.city,
    props.county,
    props.state,
  ];
  const seen = new Set();
  const out = [];
  for (const part of parts) {
    if (!part) continue;
    const key = part.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(part.trim());
  }
  return out.join(', ');
}

// Photon: OSM search built for autocomplete. Finds POIs (shops, apartments,
// hospitals, offices...) from partial input, ranked nearest Bengaluru first.
async function searchPhoton(q) {
  try {
    const res = await fetch(
      `${PHOTON_URL}?q=${encodeURIComponent(q)}&limit=12&lang=en` +
        `&lat=${BLR_CENTER.lat}&lon=${BLR_CENTER.lng}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || [])
      .filter((f) => (f.properties?.countrycode || '').toUpperCase() === 'IN')
      .map((f) => ({
        address: photonLabel(f.properties || {}),
        lat: f.geometry?.coordinates?.[1],
        lng: f.geometry?.coordinates?.[0],
      }))
      .filter((p) => p.address && hasCoords(p));
  } catch {
    return [];
  }
}

// Ola Maps Places Autocomplete — the same POI database as the Ola app.
async function searchOla(q) {
  if (!OLA_ENABLED) return [];
  try {
    const res = await fetch(
      `${OLA_AUTOCOMPLETE_URL}?input=${encodeURIComponent(q)}` +
        `&location=${BLR_CENTER.lat},${BLR_CENTER.lng}&api_key=${OLA_MAPS_API_KEY}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.predictions || [])
      .map((p) => ({
        address: p.description,
        lat: p.geometry?.location?.lat,
        lng: p.geometry?.location?.lng,
      }))
      .filter((p) => p.address && hasCoords(p));
  } catch {
    return [];
  }
}

// Nominatim: full-address geocoder. Used only as a fallback because it does
// not do partial-word matching and its policy discourages autocomplete use.
async function searchNominatim(q) {
  try {
    const res = await fetch(
      `${NOMINATIM_URL}/search?format=jsonv2&addressdetails=0&dedupe=1&limit=6` +
        `&countrycodes=in&viewbox=${BLR_VIEWBOX}&q=${encodeURIComponent(q)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .map((d) => ({ address: d.display_name, lat: parseFloat(d.lat), lng: parseFloat(d.lon) }))
      .filter(hasCoords);
  } catch {
    return [];
  }
}

// Add results to the list, skipping anything at (almost) the same spot, or a
// same-named place very close to one already listed. Different branches of a
// chain (e.g. two "Domino's" in different areas) are kept.
function mergeUnique(target, items) {
  for (const item of items) {
    const name = normName(item.address.split(',')[0]);
    const dup = target.some(
      (t) =>
        isNear(t, item) ||
        (normName(t.address.split(',')[0]) === name && isNear(t, item, 0.02))
    );
    if (!dup) target.push(item);
  }
  return target;
}

/**
 * Suggest places for a (possibly misspelled) query. Combines, in order:
 *   1. pinned landmarks (airport / bus / rail),
 *   2. curated Bengaluru localities (instant + typo-tolerant),
 *   3. Ola Maps POIs,
 *   4. Photon POIs — shops, apartments, offices, hospitals, etc.,
 *   5. Nominatim full addresses (only if the above return little).
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

  // Curated localities: show more for short input, fewer once POIs kick in.
  const local = searchLocalAreas(q, q.length >= 3 ? 3 : 6).map((a) => ({
    address: a.address,
    lat: a.lat,
    lng: a.lng,
    refine: true, // approximate centre — refine to precise coords on select
  }));

  // Only hit the network once there are enough characters to be meaningful;
  // curated matches already cover 2-character prefixes instantly.
  let ola = [];
  let photon = [];
  let nominatim = [];
  if (q.length >= 3) {
    [ola, photon] = await Promise.all([searchOla(q), searchPhoton(q)]);
    if (ola.length + photon.length < 4) {
      nominatim = await searchNominatim(q);
    }
  }

  const results = [];
  mergeUnique(results, pinned);
  mergeUnique(results, local);
  mergeUnique(results, ola);
  mergeUnique(results, photon);
  mergeUnique(results, nominatim);

  return results.slice(0, MAX_RESULTS);
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