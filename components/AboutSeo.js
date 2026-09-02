export default function AboutSeo() {
  return (
    <section className="bg-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <SkylineArt />
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Thanisandra &amp; beyond</div>
          <h2 className="mt-1 font-display text-3xl font-bold text-asphalt">
            Bangalore taxi service, trusted across the city
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-asphalt/70">
            <p>
              Networking Tours &amp; Travels is a Bangalore taxi service provider near you, running a
              chauffeur-driven cab and taxi service out of Thanisandra, right next to Manyata Tech Park — one
              of the city&apos;s busiest office corridors. Whether it&apos;s a daily commute, an airport taxi
              booking for Kempegowda International Airport, or a weekend drive out of town, our cab booking
              stays simple: pick a trip, confirm online, and pay the driver once you&apos;re there.
            </p>
            <p>
              Our fleet covers every kind of trip a Bangalore traveller needs — Swift Dzire and Toyota Etios
              sedans for a quick airport pickup cab or drop, Maruti Ertiga and Toyota Innova Crysta SUVs for
              family trips, and 12 Seater Tempo Travellers through 21, 33 and 50 Seater buses for larger
              groups and corporate tours. Every driver on our network is verified, with clean, sanitized cabs
              and live GPS tracking on every trip — from the tech corridors of Hebbal and Manyata to the
              older lanes of Basavanagudi and Malleswaram.
            </p>
            <p>
              Outstation cabs Bangalore to Mysore, Coorg, Chikmagalur, Tirupati, Chennai and beyond run with
              clear per-day pricing and no surprises at the end of the trip. Need a one way airport taxi or
              long-distance drop without paying for the return leg? Our one-way drop service charges only for
              the distance you actually travel — toll, parking and state permit charges extra as per actuals.
            </p>
            <p>
              Above all, we&apos;ve built this site around one idea: you shouldn&apos;t have to pay before you
              ride. Every booking is confirmed with flexible payment — 0%, 25% or 100% advance, your choice —
              and you settle the rest with your driver in cash or UPI once your trip is done.
            </p>
          </div>
          <p className="mt-6 font-display text-sm font-semibold text-asphalt">
            100% on-time pickup guaranteed — Bangalore moves better with Networking Tours &amp; Travels.
          </p>
        </div>
      </div>
    </section>
  );
}

function SkylineArt() {
  return (
    <svg viewBox="0 0 400 320" className="w-full text-route-teal" aria-hidden="true">
      <rect x="0" y="0" width="400" height="320" rx="20" fill="#0B1F2A" />
      <g opacity="0.9">
        <rect x="30" y="150" width="40" height="120" fill="#123350" />
        <rect x="80" y="110" width="34" height="160" fill="#0B4A68" />
        <rect x="124" y="170" width="46" height="100" fill="#123350" />
        <rect x="260" y="130" width="36" height="140" fill="#0B4A68" />
        <rect x="304" y="90" width="30" height="180" fill="#123350" />
        <rect x="340" y="160" width="40" height="110" fill="#0B4A68" />
      </g>
      <line x1="0" y1="272" x2="400" y2="272" stroke="#2FBF8F" strokeWidth="2" strokeDasharray="8 8" />
      <g transform="translate(150,235)" fill="none" stroke="#FF7A30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 20l4-14a6 6 0 0 1 6-4h34a6 6 0 0 1 6 4l4 14" />
        <rect x="-4" y="20" width="62" height="15" rx="4" />
        <circle cx="10" cy="35" r="5" />
        <circle cx="44" cy="35" r="5" />
      </g>
      <circle cx="330" cy="50" r="22" fill="#FF7A30" opacity="0.9" />
    </svg>
  );
}