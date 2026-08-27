// Neon (serverless Postgres) client + schema.
//
// This replaces the old Cloudflare R2 object storage. Set DATABASE_URL to your
// Neon connection string (Neon dashboard -> your project -> Connection string,
// the "pooled" one that looks like:
//   postgresql://user:pass@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require
// and everything (bookings + rates) is stored there.
//
// If DATABASE_URL is NOT set, the app still runs — it falls back to a local
// in-memory store for bookings and the data/rates.json file for rates (see
// lib/db.js and lib/rates-store.js). That fallback is only meant for quick
// local testing; on Vercel/production you must set DATABASE_URL so data
// actually persists.

import { neon } from '@neondatabase/serverless';

const DATABASE_URL =
  process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';

export const hasNeon = Boolean(DATABASE_URL);

let _sql = null;

/** Returns the tagged-template SQL function, or null if Neon isn't configured. */
export function getSql() {
  if (!hasNeon) return null;
  if (!_sql) _sql = neon(DATABASE_URL);
  return _sql;
}

let _schemaReady = null;

/** Creates the tables the first time we touch the database (idempotent). */
export function ensureSchema() {
  const sql = getSql();
  if (!sql) return Promise.resolve();
  if (_schemaReady) return _schemaReady;

  _schemaReady = (async () => {
    // One statement per call — Neon's HTTP driver doesn't allow multiple
    // statements in a single tagged-template query.
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id         TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ,
        status     TEXT NOT NULL DEFAULT 'Pending',
        phone      TEXT,
        data       JSONB NOT NULL
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS rates (
        id         TEXT PRIMARY KEY,
        data       JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
  })().catch((err) => {
    // Reset so a later request can retry after a transient failure.
    _schemaReady = null;
    throw err;
  });

  return _schemaReady;
}
