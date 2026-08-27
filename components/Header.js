const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917975630631';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-route-gradient font-display text-lg font-bold text-white shadow-glow">
            NT
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold tracking-tight text-asphalt sm:text-lg">
              NETWORKING TOURS &amp; TRAVELS
            </span>
            <span className="block text-xs text-asphalt/50">Thanisandra, Bengaluru</span>
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
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex items-center gap-2 rounded-full bg-amber px-4 py-2 text-sm font-bold text-white hover:bg-amber-dark"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
