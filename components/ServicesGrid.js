const services = [
  {
    title: 'Airport Transfers',
    body: 'Landing at Kempegowda International Airport or catching an early flight out? Our drivers track your flight, arrive ahead of time, and get you across Bengaluru without the stress of surge pricing or last-minute cancellations.',
    tags: ['Flight tracking', 'No surge pricing', 'On-time pickups'],
  },
  {
    title: 'Local Rentals',
    body: 'Client meetings around Manyata Tech Park, a day of shopping, or a family outing across Bengaluru — book a chauffeur-driven cab by the hour with our 4/8/12-hour local packages and go wherever the day takes you.',
    tags: ['4 / 8 / 12 hr packages', 'Multiple stops', 'Cab at your disposal'],
  },
  {
    title: 'Outstation Trips',
    body: 'Planning a road trip from Bangalore to Mysore, Coorg, Chennai, Tirupati or Goa? Our outstation cabs are built for the long haul — verified drivers, clear per-day pricing, and a car that\u2019s ready for the distance.',
    tags: ['Karnataka & beyond', 'Round trip pricing', 'Verified drivers'],
  },
  {
    title: 'One Way Drops',
    body: 'Heading home for the weekend and don\u2019t need the cab to wait? Our one-way drop service means you pay only for the distance travelled in one direction — no round-trip charges tacked on.',
    tags: ['Pay one side only', 'All-inclusive fare', 'No hidden charges'],
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">What we offer</div>
        <h2 className="mt-1 font-display text-3xl font-bold text-asphalt">Our Services</h2>
        <p className="mt-2 text-sm text-asphalt/60">
          One team, one number, every kind of trip — from a quick airport run to a week-long outstation drive.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {services.map(({ title, body, tags }) => (
          <div key={title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:shadow-ticket">
            <div className="h-1 w-10 rounded-full bg-route-teal" />
            <h3 className="mt-4 font-display text-lg font-bold text-asphalt">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-asphalt/60">{body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-asphalt/60">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}