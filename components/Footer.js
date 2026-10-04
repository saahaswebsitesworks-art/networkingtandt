'use client';

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const EMAIL = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'networkingtoursandtravels@gmail.com';

// Clean, hand-curated area list — no numbers, no "Cross", no duplicates, no Hosur.
const AREAS = [
  // Airport & North
  { name: 'Kempegowda International Airport', popular: true },
  { name: 'Devanahalli', popular: false },
  { name: 'Nandi Hills', popular: false },
  { name: 'Chikkaballapur', popular: false },
  { name: 'Muddenahalli', popular: false },
  { name: 'Vijayapura', popular: false },
  { name: 'Rajanukunte', popular: false },
  { name: 'Kakolu', popular: false },
  { name: 'Doddaballapur', popular: false },
  { name: 'Makalidurga', popular: false },
  { name: 'Tubagere', popular: false },
  { name: 'Yelahanka Old Town', popular: false },
  { name: 'Yelahanka New Town', popular: true },
  { name: 'Kogilu', popular: false },
  { name: 'Kattigenahalli', popular: false },
  { name: 'Bagalur', popular: false },
  { name: 'Thanisandra', popular: false },
  { name: 'Bharatiya City', popular: false },
  { name: 'Hegde Nagar', popular: false },
  { name: 'Reva University', popular: false },
  { name: 'Jakkur', popular: false },
  { name: 'Amruthahalli', popular: false },
  { name: 'Sahakar Nagar', popular: false },
  { name: 'Hebbal', popular: true },
  { name: 'Nagavara', popular: false },
  { name: 'Manyata Tech Park', popular: false },
  { name: 'Hennur', popular: true },
  { name: 'Kothanur', popular: false },
  { name: 'Geddalahalli', popular: false },
  { name: 'Horamavu', popular: false },
  { name: 'Babusapalya', popular: false },
  { name: 'Chikka Banaswadi', popular: false },
  { name: 'Banaswadi', popular: false },
  { name: 'HRBR Layout', popular: false },
  { name: 'Kammanahalli', popular: false },
  { name: 'Lingarajapuram', popular: false },
  { name: 'Thomas Town', popular: false },
  { name: 'Cox Town', popular: false },
  { name: 'Fraser Town', popular: false },
  { name: 'RT Nagar', popular: true },
  { name: 'Kaval Byrasandra', popular: false },
  { name: 'Sultanpalya', popular: false },
  { name: 'Ganganagar', popular: false },
  { name: 'Sanjay Nagar', popular: false },
  { name: 'Dollars Colony', popular: false },
  { name: 'New BEL Road', popular: false },
  { name: 'Mathikere', popular: false },
  { name: 'MSRIT', popular: false },
  { name: 'Gokula', popular: false },
  { name: 'Yeshwanthpur', popular: false },
  { name: 'Sadashivanagar', popular: false },
  { name: 'Palace Grounds', popular: false },

  // East
  { name: 'KR Puram', popular: true },
  { name: 'Tin Factory', popular: false },
  { name: 'Ramamurthy Nagar', popular: false },
  { name: 'TC Palya', popular: false },
  { name: 'Bhattarahalli', popular: false },
  { name: 'Avalahalli', popular: false },
  { name: 'Budigere', popular: false },
  { name: 'Hoskote', popular: false },
  { name: 'Soukya Road', popular: false },
  { name: 'Pillagumpa', popular: false },
  { name: 'Whitefield', popular: true },
  { name: 'Hope Farm', popular: false },
  { name: 'Kadugodi', popular: false },
  { name: 'Channasandra', popular: false },
  { name: 'ITPL', popular: false },
  { name: 'Hoodi', popular: false },
  { name: 'Kundalahalli', popular: false },
  { name: 'Brookefield', popular: false },
  { name: 'AECS Layout', popular: false },
  { name: 'Marathahalli', popular: true },
  { name: 'Mahadevapura', popular: false },
  { name: 'Doddanekkundi', popular: false },
  { name: 'Varthur', popular: false },
  { name: 'Gunjur', popular: false },
  { name: 'Panathur', popular: false },
  { name: 'Balagere', popular: false },
  { name: 'Bellandur', popular: true },
  { name: 'Devarabeesanahalli', popular: false },
  { name: 'Kadubeesanahalli', popular: false },
  { name: 'Kaikondrahalli', popular: false },
  { name: 'Carmelaram', popular: false },
  { name: 'Sarjapur Road', popular: true },
  { name: 'Sarjapur', popular: false },
  { name: 'Dommasandra', popular: false },
  { name: 'Muthanasandra', popular: false },
  { name: 'Yamare', popular: false },
  { name: 'Mugalur', popular: false },
  { name: 'Sompura', popular: false },
  { name: 'Handenahalli', popular: false },
  { name: 'Samanthur', popular: false },
  { name: 'Mugabala', popular: false },
  { name: 'Belathur', popular: false },
  { name: 'Seegehalli', popular: false },
  { name: 'Sulibele', popular: false },
  { name: 'Munnekollal', popular: false },

  // Central
  { name: 'Old Airport Road', popular: true },
  { name: 'HAL', popular: false },
  { name: 'Murugeshpalya', popular: false },
  { name: 'Vimanapura', popular: false },
  { name: 'Konena Agrahara', popular: false },
  { name: 'Domlur', popular: false },
  { name: 'Indiranagar', popular: true },
  { name: 'Thippasandra', popular: false },
  { name: 'New Thippasandra', popular: false },
  { name: 'CV Raman Nagar', popular: false },
  { name: 'Kaggadasapura', popular: false },
  { name: 'Malleshpalya', popular: false },
  { name: 'Ulsoor', popular: false },
  { name: 'MG Road', popular: true },
  { name: 'Brigade Road', popular: false },
  { name: 'Commercial Street', popular: false },
  { name: 'Shivaji Nagar', popular: false },
  { name: 'Richmond Town', popular: false },
  { name: 'Shanthi Nagar', popular: false },
  { name: 'Langford Town', popular: false },
  { name: 'Ashok Nagar', popular: false },
  { name: 'Victoria Layout', popular: false },
  { name: 'Austin Town', popular: false },
  { name: 'Neelasandra', popular: false },
  { name: 'Vasanth Nagar', popular: false },
  { name: 'Sampangiram Nagar', popular: false },
  { name: 'High Grounds', popular: false },
  { name: 'Kumara Park', popular: false },
  { name: 'Seshadripuram', popular: false },
  { name: 'Gandhinagar', popular: false },
  { name: 'Chamarajpet', popular: false },
  { name: 'KR Market', popular: false },
  { name: 'Chickpet', popular: false },

  // South
  { name: 'Koramangala', popular: false },
  { name: 'Ejipura', popular: false },
  { name: 'Viveknagar', popular: false },
  { name: 'National Games Village', popular: false },
  { name: 'HSR Layout', popular: true },
  { name: 'Agara', popular: false },
  { name: 'Kudlu', popular: false },
  { name: 'Singasandra', popular: false },
  { name: 'Parappana Agrahara', popular: false },
  { name: 'Electronic City', popular: true },
  { name: 'Hebbagodi', popular: false },
  { name: 'Veerasandra', popular: false },
  { name: 'Huskur', popular: false },
  { name: 'Chandapura', popular: false },
  { name: 'Attibele', popular: false },
  { name: 'Jigani', popular: false },
  { name: 'APC Layout', popular: false },
  { name: 'Anekal', popular: false },
  { name: 'Bommasandra', popular: false },
  { name: 'Bommanahalli', popular: false },
  { name: 'Mangammanapalya', popular: false },
  { name: 'Silk Board', popular: false },
  { name: 'BTM Layout', popular: true },
  { name: 'Tavarekere', popular: false },
  { name: 'Madiwala', popular: false },
  { name: 'Jayanagar', popular: true },
  { name: 'South End', popular: false },
  { name: 'JP Nagar', popular: true },
  { name: 'Sarakki', popular: false },
  { name: 'Yelachenahalli', popular: false },
  { name: 'Konanakunte', popular: false },
  { name: 'Anjanapura', popular: false },
  { name: 'Gottigere', popular: false },
  { name: 'Bannerghatta Road', popular: true },
  { name: 'Bannerghatta', popular: false },
  { name: 'Hulimavu', popular: false },
  { name: 'Begur', popular: false },
  { name: 'Koppa', popular: false },
  { name: 'Ragihalli', popular: false },
  { name: 'Harapanahalli', popular: false },
  { name: 'Haragadde', popular: false },
  { name: 'Muthenahalli', popular: false },
  { name: 'Yandahalli', popular: false },
  { name: 'Bidaraguppe', popular: false },
  { name: 'Kanakapura Road', popular: true },
  { name: 'Kaggalipura', popular: false },
  { name: 'Pattareddypalya', popular: false },
  { name: 'Harohalli', popular: false },
  { name: 'Maralavadi', popular: false },
  { name: 'Kanakapura', popular: false },
  { name: 'Dayananda Sagar University', popular: false },
  { name: 'Vasudevapura', popular: false },
  { name: 'Banashankari', popular: false },
  { name: 'Padmanabhanagar', popular: false },
  { name: 'Uttarahalli', popular: false },
  { name: 'Subramanyapura', popular: false },
  { name: 'Chikkalasandra', popular: false },
  { name: 'Kumaraswamy Layout', popular: false },
  { name: 'ISRO Layout', popular: false },

  // West
  { name: 'Nayandahalli', popular: false },
  { name: 'RR Nagar', popular: false },
  { name: 'Kengeri', popular: false },
  { name: 'Challaghatta', popular: false },
  { name: 'Kumbalgodu', popular: false },
  { name: 'Bidadi', popular: false },
  { name: 'Wonderla', popular: false },
  { name: 'Ramanagara', popular: false },
  { name: 'Channapatna', popular: false },
  { name: 'Tholuhunase', popular: false },
  { name: 'Nagarbhavi', popular: false },
  { name: 'Chandra Layout', popular: false },
  { name: 'Vijayanagar', popular: false },
  { name: 'Hosahalli', popular: false },
  { name: 'Attiguppe', popular: false },
  { name: 'Bapuji Nagar', popular: false },
  { name: 'Deepanjali Nagar', popular: false },
  { name: 'Mysore Road', popular: false },
  { name: 'Magadi Road', popular: false },
  { name: 'Kamakshipalya', popular: false },
  { name: 'Basaveshwaranagar', popular: false },
  { name: 'Rajajinagar', popular: true },
  { name: 'Mahalakshmi Layout', popular: false },
  { name: 'Nandini Layout', popular: false },
  { name: 'Kurubarahalli', popular: false },
  { name: 'Shankar Nagar', popular: false },
  { name: 'Gollarahatti', popular: false },
  { name: 'Kadabagere', popular: false },
  { name: 'Machohalli', popular: false },
  { name: 'Magadi', popular: false },
  { name: 'Solur', popular: false },
  { name: 'Kudur', popular: false },
  { name: 'Sunkadakatte', popular: false },
  { name: 'Herohalli', popular: false },
  { name: 'Muddayanapalya', popular: false },
  { name: 'Malleshwaram', popular: true },

  // North West
  { name: 'Goraguntepalya', popular: false },
  { name: 'Peenya', popular: false },
  { name: 'Jalahalli', popular: false },
  { name: 'Vidyaranyapura', popular: false },
  { name: 'Abbigere', popular: false },
  { name: 'Chikkabanavara', popular: false },
  { name: 'Hesaraghatta', popular: false },
  { name: 'Dasarahalli', popular: false },
  { name: 'Nagasandra', popular: false },
  { name: 'Madavara', popular: false },
  { name: 'Anchepalya', popular: false },
  { name: 'Makali', popular: false },
  { name: 'Nelamangala', popular: false },
  { name: 'Sondekoppa', popular: false },
  { name: 'Dobbaspet', popular: false },
  { name: 'Shivagange', popular: false },
  { name: 'Thyamagondlu', popular: false },
  { name: 'Nijagal', popular: false },
  { name: 'Soldevanahalli', popular: false },
  { name: 'Silvepura', popular: false },
  { name: 'Tarabanahalli', popular: false },
  { name: 'Hurulichikkanahalli', popular: false },
  { name: 'Chikkasandra', popular: false },
  { name: 'Mallasandra', popular: false },
  { name: 'Soundarya Layout', popular: false },
  { name: 'Ganapathinagar', popular: false },
  { name: 'Someshwara Nagar', popular: false },
  { name: 'Dodderi', popular: false },
  { name: 'Madanayakanahalli', popular: false },

  // North East (Airport belt)
  { name: 'Chanalahalli', popular: false },
  { name: 'Devangonthi', popular: false },
  { name: 'Avinahalli', popular: false },
  { name: 'Chikkasana', popular: false },
  { name: 'Kundana', popular: false },
  { name: 'Vishwanathapura', popular: false },
  { name: 'Kannamangala', popular: false },
  { name: 'Chikkajala', popular: false },
  { name: 'Shettigere', popular: false },
  { name: 'Suthanahalli', popular: false },
  { name: 'Byrathi', popular: false },
  { name: 'Attur', popular: false },
  { name: 'Judicial Layout', popular: false },
  { name: 'Jajur', popular: false },
  { name: 'Arshinakunte', popular: false },
];

// Safety net — removes any accidental duplicates (case-insensitive)
const seen = new Set();
const uniqueAreas = AREAS.filter((area) => {
  const key = area.name.trim().toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[()/&]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Sets this area as the PICKUP point on the search form when clicked.
function areaHref(area) {
  return `/?pickup=${encodeURIComponent(area.name)}#book`;
}

// 50% "Taxi" / 50% "Cab" — alternates for balanced SEO keywords
function areaKeyword(index) {
  return index % 2 === 0 ? 'Taxi' : 'Cab';
}

const TRUST_BADGES = [
  { icon: '', label: 'Live GPS Tracking' },
  { icon: '', label: 'Clean, Sanitized Cabs' },
  { icon: '', label: 'Verified Drivers' },
  { icon: '', label: 'Flexible Payment: 0 / 25% / 100% Advance' },
];

export default function Footer() {
  return (
    <footer className="bg-route-teal text-white">
      <div className="mx-auto max-w-6xl px-5 pt-14">
        <p className="max-w-3xl text-sm leading-relaxed text-white/80">
          Networking Tours &amp; Travels is Bengaluru&rsquo;s trusted taxi and tours &amp; travels
          partner &mdash; luxury taxi &amp; bus rentals across Dzire, Etios, Innova Crysta and Tempo
          Traveller, with live GPS tracking, professional captains and transparent, on-time
          pickups. Book your one way, round trip, outstation, hourly or airport taxi in Bangalore
          online in a few taps, with 100% on-time pickup and a trusted cab service across the city.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium"
            >
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
        <a
          href="https://www.google.com/maps/place/?q=place_id:REPLACE_WITH_GOOGLE_PLACE_ID"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
        >
          ★ 4.9 rated · Google reviews
        </a>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-10 sm:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="font-display text-lg font-bold">Networking Tours &amp; Travels</div>
          <p className="mt-3 text-sm text-white/75">
            No 23 Saraipalya, Thanisandra Main Rd, Sinthan Nagar, Bharath Nagar,
            Manyata Tech Park, Thanisandra, Bengaluru, Karnataka 560077
          </p>
        </div>
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Get in touch
          </div>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <a className="hover:text-white" href={`tel:${PHONE}`}>Phone: {PHONE}</a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${EMAIL}`}>Email: {EMAIL}</a>
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

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="font-display text-xs font-bold uppercase tracking-wide text-white/60">
            Book a Taxi or Cab by Area
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-white/80 sm:grid-cols-3 lg:grid-cols-4">
            {uniqueAreas.map((area, i) => {
              const keyword = areaKeyword(i);
              return (
                <li key={area.name} className="truncate">
                  <a
                    href={areaHref(area)}
                    title={`Book ${keyword.toLowerCase()} in ${area.name}`}
                    className="transition-colors hover:text-white hover:underline"
                  >
                    {keyword} in {area.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Networking Tours &amp; Travels. All fares include GST. Payment collected after the ride.
        <br />
        Designed, Developed and Maintained by Sathya Enterprises
      </div>
    </footer>
  );
}