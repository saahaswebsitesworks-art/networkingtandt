export default function TrustBar() {
  const badges = [
    { label: 'Google Reviews', rating: '4.9 ★' },
    { label: 'On-time pickups', rating: '24×7', sub: 'always available' },
    { label: 'Pay after ride', rating: '₹0', sub: 'advance payment' },
  ];

  const services = [
    'Hourly car rental Bangalore',
    'Local car rental Bangalore',
    'Outstation car rental Bangalore',
    'Airport car rental Bangalore',
    'Sightseeing car rental Bangalore',
    'Corporate car rental Bangalore',
    'Wedding car rental Bangalore',
    'Economy car rental Bangalore',
    'SUV car rental Bangalore',
    'Sedan car rental Bangalore',
    'Innova Crysta rental Bangalore',
    'Innova Crysta car hire Bangalore',
    'Rent a car services Bangalore',
    'Short term car rental Bangalore',
    'Online car booking Bangalore',
    'Flexible car rental Bangalore',
    '24/7 car rental Bangalore',
    'Budget car rental Bangalore',
    'City car rental Bangalore',
    'Innova Crysta taxi Bangalore',
  ];
  const loop = [...services, ...services];

  return (
    <section className="mx-auto max-w-4xl px-5 pb-4 pt-10">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-paper px-5 py-3 shadow-sm">
            <div className="font-display text-lg font-extrabold text-route-teal">{b.rating}</div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-asphalt">{b.label}</div>
              <div className="text-[11px] text-asphalt/50">{b.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-8 overflow-hidden py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent" />

        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {loop.map((service, i) => (
            <span
              key={`${service}-${i}`}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-black/5 bg-paper px-4 py-2 text-xs font-medium text-asphalt/70 shadow-sm"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-route-teal" />
              {service}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}