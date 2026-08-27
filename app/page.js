import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import TrustBar from '@/components/TrustBar';
import ServicesGrid from '@/components/ServicesGrid';
import PromoStrip from '@/components/PromoStrip';
import AboutSeo from '@/components/AboutSeo';
import Faq from '@/components/Faq';
import PopularRoutes from '@/components/PopularRoutes';
import TravelExpertPopup from '@/components/TravelExpertPopup';

export default function Home() {
  return (
    <main>
      <TravelExpertPopup />
      <Header />

      {/* Dark hero band, like a road at dusk — headline only, card floats below */}
      <section className="hero-glow relative overflow-hidden bg-asphalt-gradient pb-28 pt-16 text-white sm:pb-40 sm:pt-24">
        <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <HeroRoute />
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <div className="rise rise-1 glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90">
            <span className="text-route-green">★ 4.9</span>
            <span className="h-3 w-px bg-white/20" />
            161 Google reviews
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="hidden sm:inline">Thanisandra, Bengaluru</span>
          </div>

          <h1 className="rise rise-2 mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Premium rides across
            <br className="hidden sm:block" />{' '}
            <span className="text-gradient">Bengaluru &amp; beyond</span>
          </h1>

          <p className="rise rise-3 mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Airport transfers, local rentals, outstation trips &amp; tempo travellers. Pay your way — settle
            after the ride, or lock your cab with a 25% or full advance.
          </p>

          <div className="rise rise-4 mt-7 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-white/85">
            {['Flexible payment', 'Upfront fixed fares', '24×7 support', 'Verified chauffeurs'].map((t) => (
              <span key={t} className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5">
                <svg className="h-3.5 w-3.5 text-route-green" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M4 10.5l3.5 3.5L16 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Booking card overlaps the hero, like Savaari's search widget */}
      <div id="book" className="relative z-10 mx-auto -mt-20 max-w-5xl scroll-mt-24 px-5 sm:-mt-24">
        <SearchForm />
      </div>

      <TrustBar />
      <ServicesGrid />
      <PromoStrip />

      {/* Blue "what sets us apart" bar */}
      <section className="bg-route-teal text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-4">
          {[
            { t: 'Pay your way', d: 'After the ride, 25% or full advance' },
            { t: 'Real people, fast replies', d: 'Call or WhatsApp a local team' },
            { t: 'Transparent billing', d: 'What you see is what you pay' },
            { t: 'Every trip type', d: 'Local, outstation & one-way' },
          ].map((f) => (
            <div key={f.t}>
              <div className="font-display text-base font-bold">{f.t}</div>
              <div className="mt-1 text-sm text-white/75">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <AboutSeo />
      <Faq />
      <PopularRoutes />

      <Footer />
    </main>
  );
}

function HeroRoute() {
  // Signature element: the brand's dotted "route" motif, elevated to a pair of
  // flowing dashed paths sweeping toward a faint city skyline — a cab route at
  // dusk. Motion is subtle and disabled under prefers-reduced-motion.
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%] w-full opacity-90"
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="routeStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0B84C4" />
          <stop offset="1" stopColor="#2FBF8F" />
        </linearGradient>
      </defs>

      {/* faint city edge */}
      <g opacity="0.5">
        <rect x="40" y="250" width="70" height="150" fill="#0B3A55" />
        <rect x="130" y="210" width="50" height="190" fill="#0B4A68" />
        <rect x="200" y="270" width="90" height="130" fill="#0B3A55" />
        <rect x="310" y="235" width="60" height="165" fill="#0B4A68" />
        <rect x="900" y="255" width="80" height="145" fill="#0B3A55" />
        <rect x="1000" y="225" width="55" height="175" fill="#0B4A68" />
        <rect x="1080" y="280" width="90" height="120" fill="#0B3A55" />
      </g>

      {/* faint static base route */}
      <path
        d="M-20 330 C 300 250, 520 360, 760 250 S 1120 210, 1240 300"
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="2"
      />
      {/* flowing dashed routes (the signature) */}
      <path
        className="route-flow"
        d="M-20 330 C 300 250, 520 360, 760 250 S 1120 210, 1240 300"
        fill="none"
        stroke="url(#routeStroke)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="route-flow"
        style={{ animationDelay: '-6s' }}
        d="M-20 300 C 260 360, 540 240, 780 330 S 1100 360, 1240 250"
        fill="none"
        stroke="rgba(47,191,143,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
