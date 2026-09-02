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
          <Section title="1. Introduction">
            This policy explains how Networking Tours & Travels collects, uses and protects the information
            you share with us when you use this website or book a ride with us. We may update this policy
            from time to time by revising this page — please check back occasionally.
          </Section>

          <Section title="2. Information we collect">
            When you make a booking or contact us, we may collect your name, phone number, email (optional),
            pickup/drop locations, travel dates, and any notes you add. We do not collect payment card
            details on this site, since rides are paid for after completion, directly to the driver.
            <br /><br />
            We also automatically collect some usage information as you browse the site — such as the browser
            and device you're using, the pages you visit, and how you found us — which helps us keep the site
            working well. If you book over the phone, calls may be recorded for quality and training purposes.
          </Section>

          <Section title="3. Location data">
            To coordinate your ride, the assigned driver's location is shared with us during an active trip
            so we can track progress and provide support if something goes wrong. We don't collect your
            location outside of an active booking.
          </Section>

          <Section title="4. How we use your information">
            Your details are used to confirm and coordinate your trip — verifying pickup details, assigning
            a driver, and following up on your booking. With your consent (via the WhatsApp/Email buttons
            shown after booking), a trip summary is sent to those channels. We may also occasionally send
            you offers or updates by SMS, WhatsApp or email, and you can opt out at any time.
          </Section>

          <Section title="5. Cookies">
            Like most websites, we use cookies to understand how the site is used and to improve it — for
            example, to see which pages are helpful. Cookies don't give us access to your device or any
            information beyond what you choose to share with us. Most browsers accept cookies by default;
            you can change your browser settings to decline them, though parts of the site may work less
            well as a result.
          </Section>

          <Section title="6. Storage & sharing">
            Booking details are stored securely and are accessible only to our operations team, for the
            purpose of fulfilling your trip and providing support. We do not sell, rent or trade your
            personal information to third parties, and only share it where required by law.
          </Section>

          <Section title="7. Links to other websites">
            Our site may link to other websites. We aren't responsible for the content or privacy practices
            of sites we don't operate — please check their own policies before sharing information with them.
          </Section>

          <Section title="8. Your choices & account deletion">
            You can request a copy of the booking information we hold about you, or ask us to delete your
            account and data, by contacting us using the details in the site footer. On deletion, your
            account details and booking history are removed from our records, and you'll stop receiving
            any marketing communications from us. Some records may be retained briefly for accounting or
            dispute-resolution purposes. If you sign up again later with the same details, it will be
            treated as a new account.
          </Section>

          <Section title="9. Changes to this policy">
            We may update this policy periodically. Material changes will be reflected here with an updated
            date at the top of this page.
          </Section>

          <Section title="10. Contact">
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