import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateBookingStatus } from '@/lib/db';

export async function PATCH(req, { params }) {
  const isAdmin = cookies().get('ntt_admin')?.value === '1';
  if (!isAdmin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  const { status } = await req.json();
  const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const updated = await updateBookingStatus(params.id, status);
  if (!updated) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, booking: updated });
}
