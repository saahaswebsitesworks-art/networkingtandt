import { RouteIcon } from './Icons';

const ROUTES = [
  'Adiyogi, Chikkaballapura',
  'Mysore',
  'Coorg',
  'Ooty',
  'Munnar',
  'Chikmagalur',
  'Murudeshwara',
  'Chennai',
  'Hyderabad',
];

export default function PopularRoutes() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Outstation</div>
        <h2 className="mt-1 font-display text-3xl font-bold text-asphalt">Popular routes from Bangalore</h2>
        <p className="mt-2 text-sm text-asphalt/60">
          Tap a destination to start planning — we&apos;ll pre-fill the trip for you.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {ROUTES.map((city) => (
          <a
            key={city}
            href={`/?tripType=outstation&pickup=${encodeURIComponent('Bangalore, Karnataka')}&drop=${encodeURIComponent(city)}#book`}
            className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:border-route-teal/40 hover:shadow-ticket"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist text-route-teal">
              <RouteIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-asphalt/40">Bangalore to</div>
              <div className="font-display text-sm font-bold text-asphalt group-hover:text-route-teal">{city} cabs</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
