import Image from 'next/image';

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <a href="/" className="flex items-center gap-3">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full shadow-glow">
            <Image src="/images/logo.jpeg" alt="Networking Tours & Travels" fill sizes="64px" className="object-cover" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold tracking-tight text-asphalt sm:text-lg">
              NETWORKING
            </span>
            <span className="block text-xs text-asphalt/50"> Bengaluru</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          <a href="/#book" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-asphalt/70 hover:text-asphalt">
            Book a Cab
          </a>
          <a href="/#services" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-asphalt/70 hover:text-asphalt">
            Services
          </a>
          <a
            href="/group-booking"
            className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-asphalt/70 hover:text-asphalt"
          >
            Bus / Tempo Enquiry
          </a>
          <a href="/my-bookings" className="focus-ring rounded-full px-3 py-2 text-sm font-semibold text-asphalt/70 hover:text-asphalt">
            My Bookings
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${PHONE}`}
            className="focus-ring hidden items-center gap-2 rounded-full bg-route-teal px-4 py-2 text-sm font-semibold text-white hover:bg-asphalt sm:flex"
          >
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide">24x7</span>
            {PHONE}
          </a>
          <a
            href="/my-bookings"
            className="focus-ring flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-asphalt hover:border-route-teal hover:text-route-teal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:inline">My Bookings</span>
          </a>
        </div>
      </div>
    </header>
  );
}