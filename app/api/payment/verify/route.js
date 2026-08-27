import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Verifies a completed Razorpay payment by recomputing the HMAC-SHA256
// signature server-side. Never trust the browser's "payment succeeded"
// callback on its own — this is the check that proves the payment is real.
//
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
export async function POST(req) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ ok: false, error: 'Payment is not configured' }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ ok: false, error: 'Missing payment details' }, { status: 400 });
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  // Constant-time compare to avoid leaking timing information.
  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    return NextResponse.json({ ok: false, error: 'Payment could not be verified' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
