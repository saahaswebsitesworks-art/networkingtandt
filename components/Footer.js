const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'networkingtoursandtravels@gmail.com';

export default function Footer() {
  return (
    <footer className="bg-route-teal text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="font-display text-lg font-bold">Networking Tours &amp; Travels</div>
          <p className="mt-3 text-sm text-white/75">
            No 23 Saraipalya, Thanisandra Main Rd, Sinthan Nagar, Bharath Nagar,
            Manyata Tech Park, Thanisandra, Bengaluru, Karnataka 560077
          </p>
          <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            ★ 4.9 rated · 161 Google reviews
          </p>
        </div>
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Get in touch
          </div>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <a className="hover:text-white" href={`tel:${PHONE}`}>📞 {PHONE}</a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${EMAIL}`}>✉️ {EMAIL}</a>
            </li>
            <li>
              <a className="hover:text-white" href="/my-bookings">Track my booking</a>
            </li>
            <li>
              <a className="hover:text-white" href="/group-booking">Bus / tempo traveller enquiry</a>
            </li>
            <li>
              <a className="hover:text-white" href="/admin">Admin login</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Fleet
          </div>
          <ul className="mt-3 space-y-1 text-sm text-white/85">
            <li>Swift Dzire / Etios / Sunny — Sedan</li>
            <li>Ertiga / Innova — SUV</li>
            <li>Innova Crysta</li>
            <li>Tempo Traveller (AC / Non AC)</li>
            <li>Mini Buses &amp; 50-Seater Buses</li>
          </ul>
        </div>
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Policies
          </div>
          <ul className="mt-3 space-y-1 text-sm text-white/85">
            <li><a className="hover:text-white" href="/terms">Terms &amp; Conditions</a></li>
            <li><a className="hover:text-white" href="/privacy">Privacy Policy</a></li>
            <li><a className="hover:text-white" href="/cancellation-policy">Cancellation &amp; Refunds</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Networking Tours &amp; Travels. All fares include GST. Payment collected after the ride.
        <br className="sm:hidden" /> Location search &amp; routing by{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-white">
          OpenStreetMap contributors
        </a>
        .
      </div>
    </footer>
  );
}
