const faqs = [
  {
    q: 'Do you provide taxi service all over Bangalore?',
    a: 'Yes — we cover pickups and drops all over Bangalore, from the city center to the outskirts, including all major residential areas, tech parks, and both airport terminals. Just enter your pickup location on the booking page to check availability.',
  },
  {
    q: 'Do I need to pay in advance to book a taxi?',
    a: 'No. Every booking on this site is "pay after ride" by default — you can also choose to pay 25% or 100% in advance if you prefer. Either way, you settle the balance with the driver in cash or UPI once the trip is complete.',
  },
  {
    q: 'How is the cab fare calculated?',
    a: 'Fares follow our published rate card for each vehicle and trip type, plus 5% GST. Outstation and one-way trips also include a Driver Allowance, with toll, state tax, and parking charged separately as per actuals.',
  },
  {
    q: 'Do you provide airport pickup and drop taxi service in Bangalore?',
    a: 'Yes — we offer doorstep airport pickup and drop for both T1 and T2 terminals from anywhere in Bangalore, with one-way and round-trip airport taxi options. Fares are shown upfront before you confirm.',
  },
  {
    q: 'Can I book an outstation cab for a round trip?',
    a: 'Yes, outstation cabs are available for round trips out of Bangalore. Pricing is per-km with a minimum chargeable distance per day, plus Driver Allowance — toll and state permit charges are extra.',
  },
  {
    q: 'What vehicles are available for local city taxi bookings?',
    a: 'For local and hourly city rentals across Bangalore, you can choose from 4-seater sedans (Swift Dzire, Etios) and 6–7 seater SUVs (Ertiga, Innova Crysta), with hourly/km packages like 4hrs-40km, 8hrs-80km, and full-day options.',
  },
  {
    q: 'Do you have tempo traveller or bus rental for group travel?',
    a: 'Yes — 12-seater Tempo Travellers, 21 and 33-seater mini buses, and 50-seater luxury buses are available for group tours, outstation trips, and airport transfers. Select "Bus / Tempo Traveller (Enquiry)" on the booking form and our team will call you with a quote.',
  },
  {
    q: 'Is GST included in the fare I see on the website?',
    a: 'Yes, every fare estimate already includes 5% GST. The only extras are toll, state tax, and parking on outstation and one-way trips, which are shown separately and charged as applicable.',
  },
  {
    q: 'Can I change or cancel my booking after confirming?',
    a: 'Yes — call or WhatsApp us with your Booking ID and we\u2019ll update the pickup time, vehicle, or route for you.',
  },
  {
    q: 'Do you offer one-way taxi drop service?',
    a: 'Yes, one-way drop is available for both local and outstation routes, charged per km with a minimum distance and Driver Allowance — you only pay for the one-way journey, not a round trip.',
  },
  {
    q: 'Are your cabs and drivers verified and tracked?',
    a: 'Yes — every ride comes with a verified, professional driver and live GPS tracking, so you always know where your cab is.',
  },
  {
    q: 'What are your hourly local rental packages?',
    a: 'Popular local packages include 4 hours/40 km, 8 hours/80 km, and 12 hours/120 km, with extra hours and extra km charged at the rate shown for your selected vehicle.',
  },
  {
    q: 'How much does an airport cab cost from Bangalore city?',
    a: 'Airport taxi fares depend on your pickup location and the vehicle you choose — enter your pickup and drop on the booking page for an instant, transparent fare including GST.',
  },
  {
    q: 'Do you provide corporate or long-term car rental?',
    a: 'Yes, we support corporate car rental and outstation car hire for businesses across Bangalore needing regular airport transfers or multi-day trips — contact us via WhatsApp or call for a custom package.',
  },
  {
    q: 'How do I book a cab quickly?',
    a: 'You can book directly on this website in under a minute, or tap the WhatsApp button to message us — it\u2019s pre-filled so all you need to do is hit send.',
  },
  {
    q: 'What payment options are accepted?',
    a: 'We accept cash, UPI, and card payments. You can choose to book at ₹0 and pay the driver directly, or pay 25% / 100% in advance online at the time of booking.',
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