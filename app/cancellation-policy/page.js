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
          <Section title="1. Introduction">
            By browsing and using this website, you agree to these terms, along with our privacy policy and
            cancellation &amp; refund policy. If you disagree with any part of these terms, please do not use
            this website.
          </Section>

          <Section title="2. Who we are">
            'Networking Tours &amp; Travels', 'we' or 'us' refers to Networking Tours &amp; Travels, a Bengaluru-based
            taxi and cab booking service. 'You' refers to the user or visitor of this website.
          </Section>

          <Section title="3. Use of this website">
            The content on this website is provided for general information and booking purposes, and may
            change without notice. We use cookies to understand browsing behaviour and improve the site — see
            our Privacy Policy for details.
          </Section>

          <Section title="4. No warranty">
            While we try to keep fares, availability and route information accurate, we don't guarantee that
            everything on this website is complete, error-free or up to date at every moment. Your use of this
            site and its information is at your own discretion.
          </Section>
          
          <Section title="5. Bookings & payment">
            All rides booked through this website are pay-after-ride — you pay the driver directly once the
            trip is completed, using the fare confirmed at the time of booking (subject to any tolls, parking
            or waiting charges as applicable). We do not collect payment card details through this website.
          </Section>

          <Section title="6. Cancellations & refunds">
            Cancellation terms are covered in our separate Cancellation &amp; Refund Policy. Since bookings are
            pay-after-ride, most cancellations don't involve a refund process — see that page for details on
            free cancellation windows and late-cancellation charges.
          </Section>

          <Section title="7. Intellectual property">
            The design, layout and content of this website belong to Networking Tours &amp; Travels unless
            otherwise credited. Please don't reproduce or reuse it without permission.
          </Section>

          <Section title="8. Links to other websites">
            This site may link to third-party websites for your convenience. We don't endorse them and aren't
            responsible for their content or practices.
          </Section>

          <Section title="9. Governing law">
            Your use of this website, and any dispute arising from it, is governed by the laws of India.
          </Section>

          <Section title="10. Contact">
            For questions about these terms, or help with an existing booking, call or WhatsApp us at{' '}
            <a href="tel:+917975630631" className="text-route-teal">+91 79 7563 0631</a>.
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