import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== correct) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('ntt_admin', '1', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ntt_admin', '', { maxAge: 0, path: '/' });
  return res;
}
