import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Privacy Policy — Networking Tours & Travels' };

export default function PrivacyPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Legal</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-asphalt">Privacy Policy</h1>
        <p className="mt-2 text-sm text-asphalt/50">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

        <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-asphalt/75">
          <Section title="1. What we collect">
            When you make a booking, we collect the information you provide directly: your name, phone number,
            email (optional), pickup/drop locations, travel dates and any notes you add. We do not ask for
            payment card details anywhere on this site, since all rides are paid for after completion, directly
            to the driver.
          </Section>
          <Section title="2. How we use it">
            Your details are used to confirm and coordinate your trip — calling or WhatsApping you to verify
            pickup details, assigning a driver, and following up on your booking. With your consent (via the
            WhatsApp/Email buttons shown after booking), a summary of your trip is also sent to those channels.
          </Section>
          <Section title="3. Storage">
            Booking details are stored securely and are accessible only to our operations team for the purpose of
            fulfilling your trip and providing customer support. We do not sell or rent your personal information
            to third parties.
          </Section>
          <Section title="4. Communication">
            We may contact you by phone, SMS or WhatsApp regarding an active or upcoming booking. You're welcome
            to ask us to stop non-essential communication at any time.
          </Section>
          <Section title="5. Your choices">
            You can request a copy of the booking information we hold about you, or ask us to delete it, by
            contacting us using the details in the site footer. Some records may be retained briefly for
            accounting or dispute-resolution purposes even after a deletion request.
          </Section>
          <Section title="6. Changes to this policy">
            We may update this policy periodically. Material changes will be reflected here with an updated date
            at the top of this page.
          </Section>
          <Section title="7. Contact">
            Questions about this policy can be sent to the email address or phone number listed in the site
            footer.
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
