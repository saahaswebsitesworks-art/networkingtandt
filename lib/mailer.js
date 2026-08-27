import nodemailer from 'nodemailer';

// If SMTP_* env vars aren't set, we simply skip sending — the booking is
// still saved and the customer still gets WhatsApp/Call/mailto options.
export async function sendBookingEmail(booking) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_TO) {
    return { skipped: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const priceLine = booking.price?.enquiryOnly
      ? 'Enquiry only — price on request'
      : `₹${booking.price?.total ?? '—'} (incl. GST)`;

    const payLine =
      booking.paymentStatus === 'paid'
        ? `Paid in full online: ₹${booking.amountPaid} (ref ${booking.razorpayPaymentId || '-'})`
        : booking.paymentStatus === 'advance_paid'
        ? `Advance paid online: ₹${booking.amountPaid} (ref ${booking.razorpayPaymentId || '-'}); balance ₹${booking.balanceDue} to driver`
        : 'Pay after ride (cash/UPI to driver)';

    await transporter.sendMail({
      from: `"${booking.name}" <${SMTP_USER}>`,
      to: SMTP_TO,
      subject: `New Booking ${booking.id} — ${booking.vehicleLabel} — ${booking.tripTypeLabel}`,
      text: [
        `New booking received`,
        `Booking ID: ${booking.id}`,
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        `Email: ${booking.email || '-'}`,
        `Trip type: ${booking.tripTypeLabel}`,
        `Vehicle: ${booking.vehicleLabel}`,
        `Pickup: ${booking.pickup || '-'}`,
        `Drop: ${booking.drop || '-'}`,
        `Date: ${booking.date || '-'} ${booking.time || ''}`,
        `Estimated fare: ${priceLine}`,
        `Payment: ${payLine}`,
        `Notes: ${booking.notes || '-'}`,
      ].join('\n'),
    });
    return { sent: true };
  } catch (err) {
    console.error('Email send failed:', err.message);
    return { error: err.message };
  }
}
