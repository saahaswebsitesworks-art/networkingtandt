// Bookings store.
//
// Backed by Neon (serverless Postgres) when DATABASE_URL is set; otherwise
// falls back to an in-memory list so the site still runs locally without a
// database. See lib/neon.js.

import { getSql, hasNeon, ensureSchema } from './neon';

// In-memory fallback (used only when Neon isn't configured).
let memBookings = [];

export function makeBookingId() {
  const d = new Date();
  const stamp = d.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `NTT-${stamp}-${rand}`;
}

// The full booking object lives in the `data` JSONB column; `status` is
// mirrored into its own column so admins can update it and we can order/filter
// efficiently. On read we let the column be the source of truth for status.
function rowToBooking(row) {
  return { ...row.data, status: row.status };
}

export async function getBookings() {
  if (!hasNeon) return memBookings;

  const sql = getSql();
  await ensureSchema();
  const rows = await sql`
    SELECT data, status FROM bookings ORDER BY created_at DESC
  `;
  return rows.map(rowToBooking);
}

export async function addBooking(booking) {
  if (!hasNeon) {
    memBookings.unshift(booking);
    return booking;
  }

  const sql = getSql();
  await ensureSchema();
  await sql`
    INSERT INTO bookings (id, created_at, status, phone, data)
    VALUES (
      ${booking.id},
      ${booking.createdAt || new Date().toISOString()},
      ${booking.status || 'Pending'},
      ${booking.phone || ''},
      ${JSON.stringify(booking)}::jsonb
    )
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data,
          status = EXCLUDED.status,
          phone = EXCLUDED.phone
  `;
  return booking;
}

export async function updateBookingStatus(id, status) {
  const now = new Date().toISOString();

  if (!hasNeon) {
    const idx = memBookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    memBookings[idx].status = status;
    memBookings[idx].updatedAt = now;
    return memBookings[idx];
  }

  const sql = getSql();
  await ensureSchema();
  const rows = await sql`
    UPDATE bookings
    SET status = ${status},
        updated_at = now(),
        data = jsonb_set(
          jsonb_set(data, '{status}', ${JSON.stringify(status)}::jsonb, true),
          '{updatedAt}', ${JSON.stringify(now)}::jsonb, true
        )
    WHERE id = ${id}
    RETURNING data, status
  `;
  if (!rows.length) return null;
  return rowToBooking(rows[0]);
}
