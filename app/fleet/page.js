import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Fleet & Seaters — Sedans, SUVs, Tempo Travellers & Buses | Networking Tours & Travels',
  description:
    'Book a Swift Dzire or Etios sedan, Ertiga or Innova Crysta SUV, 12 Seater Tempo Traveller, or 21/33/50 Seater bus for outstation trips, airport transfers and group tours in Bangalore.',
};

const FLEET_CLASSES = [
  {
    title: '4 Seater Sedans',
    vehicles: 'Swift Dzire, Toyota Etios',
    blurb:
      'Compact, fuel-efficient sedans — the go-to pick for airport pickup cab and drop, daily commutes, and short city trips.',
    tags: ['Airport Cab Hire', 'Taxi Hire', 'Car Rental'],
  },
  {
    title: '6–7 Seater SUVs',
    vehicles: 'Maruti Ertiga, Toyota Innova Crysta',
    blurb: 'Extra room for families and small groups — a popular choice for outstation trips and full-day rentals.',
    tags: ['SUV Hire', 'Car Rental', 'Outstation Ready'],
  },
  {
    title: '12 Seater Tempo Traveller',
    vehicles: 'AC Tempo Traveller',
    blurb: 'A comfortable step up for group outings, office offsites, and outstation traveller bookings.',
    tags: ['Tempo Traveller Rental', 'Luxury Van Hire', 'Outstation Booking'],
  },
  {
    title: '21 Seater Mini Bus',
    vehicles: 'Mini Bus',
    blurb: 'Right-sized for mid-sized groups — college trips, corporate outings, and airport group transfers.',
    tags: ['Mini Bus Rental', 'Group Tours', 'Airport Transfers'],
  },
  {
    title: '33 Seater Bus',
    vehicles: 'Bus',
    blurb: 'A solid choice for larger corporate groups and outstation tours that need a full coach.',
    tags: ['Bus Rental', 'Outstation & Airport', 'Large Group Coach'],
  },
  {
    title: '50 Seater Luxury Bus',
    vehicles: 'Luxury Bus',
    blurb: 'Our largest option — built for big corporate events, weddings, and long-distance group tours around Bangalore.',
    tags: ['Luxury Bus Rental Bangalore', 'Corporate & Tour Bus'],
  },
];

export default function FleetAndSeatersPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Our Fleet</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-asphalt">Fleet &amp; Seaters</h1>
        <p className="mt-2 max-w-2xl text-sm text-asphalt/60">
          From a 4-seater sedan for a quick airport run to a 50-seater luxury bus for a corporate tour — every
          vehicle is booked the same simple way: confirm your trip online, pay the driver once it&apos;s done.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FLEET_CLASSES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <h2 className="font-display text-base font-bold text-asphalt">{f.title}</h2>
              <div className="mt-1 text-xs font-semibold text-route-teal">{f.vehicles}</div>
              <p className="mt-3 text-sm leading-relaxed text-asphalt/70">{f.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {f.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-asphalt/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-asphalt/40">
          Toll, parking and state permit charges are extra as per actuals across all vehicle classes.
        </p>
      </div>
      <Footer />
    </main>
  );
}