import { NextResponse } from 'next/server';

// Keyless driving-distance calculation. The browser posts an ordered list of
// points ({ lat, lng }) and we return total road distance in km.
//
// We try two free, no-API-key OpenStreetMap routing engines in order:
//   1. Valhalla  (valhalla1.openstreetmap.de) — POST, usually more accurate
//   2. OSRM demo (router.project-osrm.org)     — GET, reliable fallback
//
// Straight OSM routing tends to slightly under-count vs real driving (it
// doesn't know about diversions, one-ways taken the long way, tolls, etc.),
// so we add a small configurable buffer (DISTANCE_BUFFER, default 10%) to the
// raw distance before returning it, matching how fares are quoted per km.

const VALHALLA_URL = 'https://valhalla1.openstreetmap.de/route';
const OSRM_URL = 'https://router.project-osrm.org';
const TIMEOUT_MS = 6000;

function withTimeout(promise, ms, controller) {
  const t = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(t));
}

async function viaValhalla(points) {
  const controller = new AbortController();
  const res = await withTimeout(
    fetch(VALHALLA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        locations: points.map((p) => ({ lat: p.lat, lon: p.lng })),
        costing: 'auto',
        directions_options: { units: 'kilometers' },
      }),
    }),
    TIMEOUT_MS,
    controller
  );
  if (!res.ok) throw new Error('valhalla failed');
  const data = await res.json();
  const km = data?.trip?.summary?.length;
  if (typeof km !== 'number' || !isFinite(km)) throw new Error('valhalla no route');
  return km; // already kilometers
}

async function viaOsrm(points) {
  const controller = new AbortController();
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
  const res = await withTimeout(
    fetch(`${OSRM_URL}/route/v1/driving/${coords}?overview=false`, { signal: controller.signal }),
    TIMEOUT_MS,
    controller
  );
  if (!res.ok) throw new Error('osrm failed');
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('osrm no route');
  return data.routes[0].distance / 1000; // meters -> km
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const points = Array.isArray(body?.points)
    ? body.points.filter((p) => p && typeof p.lat === 'number' && typeof p.lng === 'number')
    : [];

  if (points.length < 2) {
    return NextResponse.json({ ok: false, error: 'Need at least a pickup and a drop' }, { status: 400 });
  }

  let rawKm = null;
  try {
    rawKm = await viaValhalla(points);
  } catch {
    try {
      rawKm = await viaOsrm(points);
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Could not calculate distance for this route right now' },
        { status: 502 }
      );
    }
  }

  const buffer = Number(process.env.DISTANCE_BUFFER);
  const factor = 1 + (isFinite(buffer) ? buffer : 0.1);
  const km = Math.max(1, Math.round(rawKm * factor));

  return NextResponse.json({ ok: true, km, rawKm: Math.round(rawKm) });
}
