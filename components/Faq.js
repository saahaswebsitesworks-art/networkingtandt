const faqs = [
  {
    q: 'Do I need to pay in advance?',
    a: 'No. Every booking on this site is "pay after ride" — you settle the fare with the driver in cash or UPI once the trip is complete.',
  },
  {
    q: 'How is the fare calculated?',
    a: 'Fares follow our published rate card for each vehicle and trip type, plus 5% GST. Outstation and one-way trips also include a Driver Allowance, with toll/parking charged separately as applicable.',
  },
  {
    q: 'Can I change my booking after confirming?',
    a: 'Yes — call or WhatsApp us with your Booking ID and we\u2019ll update the pickup time, vehicle, or route for you.',
  },
  {
    q: 'What if I need a bus or tempo traveller for a large group?',
    a: 'Mini buses (21/33 seater) and 50-seater buses are quoted individually. Choose "Bus / Tempo Traveller (Enquiry)" on the booking form and our team will call you with a price.',
  },
  {
    q: 'Is GST included in the price I see?',
    a: 'Yes, every fare estimate on this site already includes 5% GST — there are no hidden charges beyond toll/parking on outstation trips.',
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Questions</div>
        <h2 className="mt-1 font-display text-3xl font-bold text-asphalt">Frequently asked</h2>
      </div>
      <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-asphalt">
              {f.q}
              <span className="shrink-0 text-route-teal transition group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm text-asphalt/60">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
