import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getRatesData, upsertVehicle, updateSettings, slugify } from '@/lib/rates-store';

function isAdmin() {
  return cookies().get('ntt_admin')?.value === '1';
}

// Public: anyone can read current rates (needed to price a trip on the
// booking pages).
export async function GET() {
  const data = await getRatesData();
  return NextResponse.json(data);
}

// Admin only: create a new vehicle, or update GST settings.
export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

  const body = await req.json();

  if (body.type === 'settings') {
    const data = await updateSettings({ gstRate: Number(body.gstRate) });
    return NextResponse.json({ ok: true, ...data });
  }

  const vehicle = body.vehicle;
  if (!vehicle?.label) {
    return NextResponse.json({ error: 'Vehicle needs at least a label' }, { status: 400 });
  }
  const id = body.id || slugify(vehicle.label);
  const data = await upsertVehicle(id, vehicle);
  return NextResponse.json({ ok: true, id, ...data });
}
