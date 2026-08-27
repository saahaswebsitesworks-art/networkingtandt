import { NextResponse } from 'next/server';
import { addBooking, getBookings, makeBookingId } from '@/lib/db';
import { sendBookingEmail } from '@/lib/mailer';
import { paymentBreakdown } from '@/lib/payments';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Work out the payment split on the server from the fare + chosen option,
    // so the recorded amounts can't be tampered with from the browser. Group /
    // enquiry-only trips can't be prepaid, so they're always "pay after".
    const isEnquiry = !!body.price?.enquiryOnly;
    const optionId = isEnquiry ? 'later' : body.payment?.optionId || 'later';
    const split = paymentBreakdown(body.price?.total || 0, optionId);

    const paid = body.payment?.razorpayPaymentId && split.requiresPayment;
    const paymentStatus = paid ? split.status : 'not_paid';
    const amountPaid = paid ? split.payNow : 0;
    const balanceDue = paid ? split.balance : split.total;

    const paymentMode = !split.requiresPayment
      ? 'Pay after ride (cash / UPI to driver)'
      : paid
      ? split.pct >= 1
        ? 'Paid in full online (Razorpay)'
        : '25% advance paid online (Razorpay); balance to driver'
      : 'Advance selected — payment not completed';

    const booking = {
      id: makeBookingId(),
      createdAt: new Date().toISOString(),
      // A completed online payment confirms the ride immediately; otherwise
      // the team confirms manually.
      status: paid ? 'Confirmed' : 'Pending',
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      tripType: body.tripType,
      tripTypeLabel: body.tripTypeLabel,
      vehicleId: body.vehicleId,
      vehicleLabel: body.vehicleLabel,
      pickup: body.pickup || '',
      drop: body.drop || '',
      stops: Array.isArray(body.stops) ? body.stops : [],
      date: body.date || '',
      time: body.time || '',
      days: body.days || 1,
      km: body.km || 0,
      notes: body.notes || '',
      price: body.price || null,
      // Payment
      paymentOption: optionId,
      paymentMode,
      paymentStatus, // 'not_paid' | 'advance_paid' | 'paid'
      amountPaid, // INR collected online now
      balanceDue, // INR still to pay the driver
      razorpayOrderId: body.payment?.razorpayOrderId || '',
      razorpayPaymentId: body.payment?.razorpayPaymentId || '',
    };

    await addBooking(booking);

    // Fire-and-forget email; never block the booking on this, but DO log
    // failures so they're visible in the server console instead of vanishing.
    sendBookingEmail(booking).catch((err) => {
      console.error('[booking email] failed to send for', booking.id, err?.message || err);
    });

    return NextResponse.json({ ok: true, booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong. Please call us instead.' }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  // This endpoint is public (used by the "My Bookings" phone lookup) and
  // must always filter by phone — it never returns the full list, even to
  // an admin browsing from the same device. The admin dashboard reads
  // bookings directly via getBookings() server-side, not through this route.
  if (!phone) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const all = await getBookings();
  const mine = all.filter((b) => b.phone.replace(/\D/g, '').endsWith(phone.replace(/\D/g, '')));
  return NextResponse.json({ bookings: mine });
}
