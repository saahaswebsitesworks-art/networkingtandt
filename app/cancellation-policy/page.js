import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Cancellation & Refund Policy — Networking Tours & Travels' };

export default function CancellationPolicyPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Legal</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-asphalt">Cancellation &amp; Refund Policy</h1>
        <p className="mt-2 text-sm text-asphalt/50">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

        <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-asphalt/75">
          <Section title="No advance payment, so no refund needed for most cancellations">
            Since every booking on this site is pay-after-ride, cancelling a trip before it starts does not
            involve any refund — there was nothing charged online in the first place. Simply call or WhatsApp us
            to cancel.
          </Section>
          <Section title="Free cancellation window">
            You can cancel or reschedule a confirmed booking free of charge up to 1 hour before the scheduled
            pickup time.
          </Section>
          <Section title="Late cancellations & no-shows">
            If a driver has already been dispatched and is on the way, or if you cancel with less than 1 hour's
            notice, a reasonable cancellation charge may apply to cover the driver's time and fuel — this will
            always be communicated to you by our team before being applied, never charged silently.
          </Section>
          <Section title="Outstation & tempo traveller bookings">
            For outstation trips, tempo travellers and bus bookings, please give us at least 24 hours' notice for
            cancellation wherever possible, since vehicles for these trips are arranged in advance.
          </Section>
          <Section title="If we cancel">
            In the rare case that we're unable to fulfil a confirmed booking (vehicle unavailability, driver
            emergency, etc.), we'll inform you as early as possible and help arrange an alternative — since no
            advance payment was collected, no refund process is needed on our side either.
          </Section>
          <Section title="Questions about a specific booking">
            For anything related to an existing booking, please call or WhatsApp us with your Booking ID and our
            team will sort it out directly — that's usually faster than email for time-sensitive changes.
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
