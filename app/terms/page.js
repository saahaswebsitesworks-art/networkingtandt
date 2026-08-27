import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Terms & Conditions — Networking Tours & Travels' };

export default function TermsPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Legal</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-asphalt">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-asphalt/50">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

        <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-asphalt/75">
          <Section title="1. Booking & confirmation">
            A booking made on this website or through our app is a request for a cab, confirmed once our team
            calls or messages you to verify the trip details. Fares shown at the time of booking are estimates
            based on the trip type, vehicle and distance you provide; the final fare is confirmed against the
            actual distance and time travelled.
          </Section>
          <Section title="2. Payment">
            We operate on a pay-after-ride basis. No advance payment is collected online. The fare is payable
            directly to the driver in cash or UPI at the end of the trip, unless a different arrangement has been
            confirmed with our team in writing.
          </Section>
          <Section title="3. Fare inclusions & exclusions">
            Local and airport package fares include the base package as displayed. Outstation and one-way fares
            include the per-km rate and Driver Allowance shown at booking. Toll, state entry tax, permit charges
            and parking are not included and are payable as actually incurred.
          </Section>
          <Section title="4. Vehicle & driver allocation">
            We aim to provide the vehicle category booked (sedan, SUV, etc.); the exact model may vary based on
            availability, though seating capacity and category will be honoured. Drivers are verified, but we
            request customers to independently confirm the driver and vehicle number provided before starting
            the trip.
          </Section>
          <Section title="5. Cancellations & no-shows">
            See our separate <a href="/cancellation-policy" className="font-semibold text-route-teal hover:underline">Cancellation &amp; Refund Policy</a> for cancellation windows and any applicable charges.
          </Section>
          <Section title="6. Customer responsibilities">
            Customers are responsible for providing accurate pickup/drop details and being available at the
            agreed pickup time. Waiting charges may apply for delays beyond a reasonable grace period, as
            communicated by our team at the time of booking.
          </Section>
          <Section title="7. Liability">
            While we take reasonable care in verifying our driver-partners, we are not liable for delays caused
            by traffic, weather, road closures or other circumstances beyond our control. Any luggage or personal
            belongings left in the vehicle are the customer's responsibility.
          </Section>
          <Section title="8. Changes to these terms">
            We may update these terms from time to time to reflect changes in our services. Continued use of our
            booking service after an update constitutes acceptance of the revised terms.
          </Section>
          <Section title="9. Contact">
            For any questions about these terms, reach us via the phone or WhatsApp number in the site header, or
            email us at the address listed in the footer.
          </Section>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-base font-bold text-asphalt">{title}</h2>
      <p className="mt-1.5">{children}</p>
    </div>
  );
}
