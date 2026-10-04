import nodemailer from 'nodemailer';

// If SMTP_* env vars aren't set, we simply skip sending — the booking is
// still saved and the customer still gets WhatsApp/Call/mailto options.
export async function sendBookingEmail(booking) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO } = process.env;

  const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_TO'].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    // Log loudly so a missing env var on the live site is easy to spot.
    console.warn('Booking email skipped — missing env vars:', missing.join(', '));
    return { skipped: true, missing };
  }

  // Gmail app passwords are often copied with spaces ("abcd efgh ijkl mnop").
  const pass = String(SMTP_PASS).replace(/\s/g, '');
  const port = Number(SMTP_PORT) || 587;

  // Strip characters that can break the email "From" header.
  const safeName = String(booking.name || 'Customer').replace(/["<>\r\n]/g, '').trim();

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user: SMTP_USER, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
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

    const info = await transporter.sendMail({
      // Sent from the website account; the customer's name is shown in the subject.
      from: `"Networking Tours Website" <${SMTP_USER}>`,
      to: SMTP_TO,
      // Hitting "Reply" in Gmail goes straight to the customer (if they gave an email).
      ...(booking.email ? { replyTo: `"${safeName}" <${booking.email}>` } : {}),
      subject: `New Booking ${booking.id} — ${safeName} — ${booking.vehicleLabel} — ${booking.tripTypeLabel}`,
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

    console.log('Booking email sent:', info.messageId, 'accepted:', info.accepted);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email send failed:', err.code || '', err.message);
    return { error: err.message, code: err.code };
  }
}