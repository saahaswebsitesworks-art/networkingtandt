import { NextResponse } from 'next/server';

// Creates a Razorpay order for the amount due now. We call Razorpay's REST API
// directly with fetch + Basic auth so there's no extra npm dependency.
//
// Body: { amount: <INR rupees>, receipt?: string, notes?: object }
// Returns: { ok, order, keyId }  — keyId (publishable) is safe for the browser.
export async function POST(req) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        error:
          'Online payment isn’t set up yet. Please choose "Pay after ride", or call/WhatsApp us to pay.',
      },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const amountPaise = Math.round(Number(body.amount) * 100);
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    // Razorpay's minimum charge is ₹1.00 (100 paise).
    return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: String(body.receipt || `rcpt_${Date.now()}`),
        notes: body.notes && typeof body.notes === 'object' ? body.notes : {},
      }),
    });

    const order = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: order?.error?.description || 'Could not start the payment. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, order, keyId });
  } catch (err) {
    console.error('Razorpay order failed:', err);
    return NextResponse.json(
      { error: 'Could not reach the payment gateway. Please try again.' },
      { status: 502 }
    );
  }
}
