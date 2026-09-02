// Rates store (admin-editable vehicle rates + settings).
//
// Backed by Neon (serverless Postgres) when DATABASE_URL is set; otherwise
// falls back to the local data/rates.json file so the site still runs locally
// without a database. See lib/neon.js.

import fs from 'fs/promises';
import path from 'path';
import { DEFAULT_VEHICLES, DEFAULT_SETTINGS } from './default-rates';
import { getSql, hasNeon, ensureSchema } from './neon';

const RATES_ID = 'current';

function seedData() {
  return { vehicles: DEFAULT_VEHICLES, settings: DEFAULT_SETTINGS };
}

/* ----------------------------- Neon backend ----------------------------- */

async function readNeonRates() {
  const sql = getSql();
  await ensureSchema();

  const rows = await sql`SELECT data FROM rates WHERE id = ${RATES_ID}`;
  if (!rows.length) {
    const seed = seedData();
    await sql`
      INSERT INTO rates (id, data) VALUES (${RATES_ID}, ${JSON.stringify(seed)}::jsonb)
      ON CONFLICT (id) DO NOTHING
    `;
    return seed;
  }
  return rows[0].data;
}

async function writeNeonRates(data) {
  const sql = getSql();
  await ensureSchema();
  await sql`
    INSERT INTO rates (id, data, updated_at)
    VALUES (${RATES_ID}, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = now()
  `;
}

/* --------------------------- File fallback ------------------------------ */

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rates.json');

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedData(), null, 2), 'utf8');
  }
}

async function readRatesFile() {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    if (!raw.trim()) {
      await fs.writeFile(DATA_FILE, JSON.stringify(seedData(), null, 2), 'utf8');
      return seedData();
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read rates.json:', error);
    const seed = seedData();
    await fs.writeFile(DATA_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
}

async function writeRatesFile(data) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/* ------------------------- Backend selection ---------------------------- */

async function readRates() {
  return hasNeon ? readNeonRates() : readRatesFile();
}

async function writeRates(data) {
  return hasNeon ? writeNeonRates(data) : writeRatesFile(data);
}

/* ------------------------------ Public API ------------------------------ */

// Controls display order everywhere `vehicles` is consumed (booking page,
// admin fleet list). Vehicles not listed here fall back to their original
// (insertion) order, appended after the ones listed. If your actual vehicle
// ids differ from these (check the admin Fleet list), update this array.
const VEHICLE_ORDER = ['sedan', 'suv', 'crysta', 'tempo', 'bus'];

function sortVehicles(vehicles) {
  const ids = Object.keys(vehicles);
  const sortedIds = [...ids].sort((a, b) => {
    const ai = VEHICLE_ORDER.indexOf(a);
    const bi = VEHICLE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return 0; // keep original relative order
    if (ai === -1) return 1; // unlisted ids go after listed ones
    if (bi === -1) return -1;
    return ai - bi;
  });
  return Object.fromEntries(sortedIds.map((id) => [id, vehicles[id]]));
}

export async function getRatesData() {
  const data = await readRates();
  return {
    vehicles: sortVehicles(data.vehicles || {}),
    settings: {
      ...DEFAULT_SETTINGS,
      ...(data.settings || {}),
    },
  };
}

export async function upsertVehicle(id, vehicle) {
  const data = await getRatesData();
  data.vehicles[id] = vehicle;
  await writeRates(data);
  return data;
}

export async function deleteVehicle(id) {
  const data = await getRatesData();
  delete data.vehicles[id];
  await writeRates(data);
  return data;
}

export async function updateSettings(settings) {
  const data = await getRatesData();
  data.settings = {
    ...data.settings,
    ...settings,
  };
  await writeRates(data);
  return data;
}

export function slugify(label) {
  return (
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || `vehicle_${Date.now()}`
  );
}