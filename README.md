# Networking Tours & Travels — Booking Website

A Next.js 14 (App Router) booking site for a taxi/cab business in Bengaluru.
Customers search a route, pick a cab at a transparent fare, choose **how they
want to pay**, and confirm. Bookings and rates persist in **Neon (serverless
Postgres)**, online payments run through **Razorpay**, and distance/address
lookup is **100% keyless** (OpenStreetMap + a keyless Google Maps route embed).

## Flexible payment — three options

Every booking (except bus/tempo enquiries) lets the customer choose at checkout:

- **Pay after ride** — no advance, nothing charged online. Settle in cash/UPI
  with the driver after the trip. This option needs no Razorpay keys.
- **25% advance** — pay a quarter now via Razorpay to lock the cab; the balance
  is paid to the driver.
- **Full advance (100%)** — pay the whole fare online now; nothing due to the
  driver.

The split is computed in `lib/payments.js` and, importantly, **re-derived on the
server** in `app/api/book/route.js` — the browser's numbers are never trusted for
what gets marked as paid. Razorpay flow: the server creates an order
(`/api/payment/order`), the browser opens Razorpay Checkout, and the server
verifies the payment signature (`/api/payment/verify`) with an HMAC-SHA256 check
before the booking is marked Confirmed/paid.

## After confirming: Call + WhatsApp

The confirmation screen shows exactly two actions — **Call Us** and **WhatsApp**
(the WhatsApp link is pre-filled with the full booking details and payment
status). There is no OTP/verification step. It also shows a payment-aware fare
summary (paid online / advance + balance to driver / pay after ride).

## What's included

- **Home page** — a premium dark hero (same brand palette) over a floating
  search widget: trip type, pickup/drop with live address suggestions,
  date/time, and auto-calculated distance. Below it: trust badges, an "Our
  Services" grid (Airport / Local / Outstation / One Way), a promo strip, a
  long-form SEO "about" section, and an FAQ accordion.
- **`/select-cars`** — every vehicle for that trip type as a priced card
  (live-calculated from current admin rates + GST), with a package picker for
  Local trips.
- **`/booking`** — review screen (route on a keyless Google Maps embed, vehicle,
  full fare breakdown), the three-way payment selector, contact form, and
  Confirm. This is the only step that creates a booking.
- **`/group-booking`** — enquiry page for mini buses, 33- and 50-seaters. No
  fixed price — a quick form that reaches your team.
- **Legal pages** — `/terms`, `/privacy`, `/cancellation-policy` (please have
  someone review them against your actual practices before publishing).
- **Admin panel** (`/admin`) — password-protected, two tabs: **Bookings**
  (filter by status, one-tap call/WhatsApp per row, a Payment column showing
  paid/advance/pay-after, and a status dropdown) and **Rates & Fleet** (full
  CRUD over vehicles + a single GST field; nothing is hardcoded in the UI).
- **`/my-bookings`** — a simple "track my booking" lookup by phone number, now
  showing each booking's payment status. No signup needed.

There are no stock photos — every illustration is a small hand-coded SVG
(`components/Icons.js`, `components/AboutSeo.js`, and the hero route motif in
`app/page.js`), so there's nothing to license.

## Storage: Neon (serverless Postgres)

Bookings and rates live in Neon, a serverless Postgres that persists on
serverless hosts like Vercel (unlike a local file). See `lib/neon.js` (client +
auto-created schema), `lib/db.js` (bookings) and `lib/rates-store.js` (rates).

- Each booking is stored as a row with a JSONB `data` column plus mirrored
  `status`/`phone` columns for filtering; rates are a single JSONB row.
- **Tables are created automatically** on first use — no migrations to run.
- **Graceful fallback:** if `DATABASE_URL` is blank, the site still runs —
  bookings are kept in memory (lost on restart) and rates use `data/rates.json`.
  This is handy for local development; set `DATABASE_URL` for anything real.

**Setup:** create a project at [neon.tech](https://neon.tech), copy the pooled
connection string (host contains `-pooler`), and put it in `DATABASE_URL`. It
looks like `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`.

## Payments: Razorpay

Get keys from the Razorpay Dashboard → Settings → API Keys (start with test keys
`rzp_test_...`). Put them in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
`KEY_ID` is exposed to the browser by the order route; `KEY_SECRET` stays
server-only and is used to verify payment signatures.

If the keys are missing, the "pay after ride" option still works everywhere; the
two advance options return a friendly "payment isn't configured yet" message
instead of failing silently.

## Distance & address search (free, no API key)

- **Address suggestions** cover all of Bengaluru and tolerate spelling mistakes.
  As you type (from 2 characters), a curated list of ~180 Bengaluru localities
  and popular outstation destinations (`lib/bangalore-areas.js`) is matched with
  edit-distance fuzzy logic, so "koramangla" → *Koramangala*, "indranagar" →
  *Indiranagar*, "whitfield" → *Whitefield*. These merge with live
  [Nominatim](https://nominatim.org/) results (biased to the Bengaluru area) for
  exact streets. Picking a curated suggestion refines it to precise coordinates.
  Ambiguous landmarks (airport vs. Majestic bus/rail) are pinned in `lib/geo.js`.
- **Driving distance** is computed **on the server** at `app/api/distance/route.js`,
  which tries [Valhalla](https://valhalla1.openstreetmap.de/) first and falls
  back to the [OSRM](http://project-osrm.org/) demo server, then adds a small
  configurable buffer (`DISTANCE_BUFFER`, default +10%) so per-km fares don't
  under-count vs. real roads. Outstation is treated as a round loop (pickup →
  stops → destination → back). `lib/geo.js`'s `calcRouteKm` just POSTs the route
  points to this endpoint.
- **Route preview:** `/booking` shows the trip on a **keyless Google Maps embed**
  (`components/RouteMapEmbed.js`) using the classic `output=embed` directions
  URL — an interactive Google map with no API key or billing account.

**Worth knowing:** Nominatim, Valhalla and OSRM are shared free public services
with a light usage policy (~1 req/sec) — fine for a small business. Under heavy
traffic, self-host them (all open source) or switch providers; only `lib/geo.js`
and `app/api/distance/route.js` would change.

## Rates & pricing

Rates are edited only through `/admin/rates` (or by hand-editing
`lib/default-rates.js` before the very first run — it only seeds the store once).
`lib/pricing.js` is a pure calculator: given the vehicles map, trip type and
details, it returns a fare breakdown + GST + total. `/select-cars` and `/booking`
fetch current rates from `GET /api/rates` and run it client-side, so admin
changes show up immediately without a deploy.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, Razorpay keys, business info
npm run dev
```

Open http://localhost:3000

- Booking form: `/`
- Admin panel: `/admin` (default password `admin123` — **change this** via
  `ADMIN_PASSWORD`)
- Customer lookup: `/my-bookings`

The site runs even with `DATABASE_URL` and the Razorpay keys blank (in-memory
data + pay-after-ride only), so you can click through it before wiring services.

## Configuration (`.env.local`)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string. If blank, data is in-memory (bookings) / local JSON (rates). Strongly recommended for production. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay API keys for the advance-payment options. If blank, only "pay after ride" is offered. |
| `DISTANCE_BUFFER` | Fraction added to raw OSM distance (default `0.10` = +10%). Range 0–1. |
| `NEXT_PUBLIC_BUSINESS_PHONE` | "Call Us" `tel:` links. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp buttons (digits only, with country code, no `+`). |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | `mailto:` links. |
| `ADMIN_PASSWORD` | Password for `/admin`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_TO` | Optional — auto-email your team on each booking (now including payment status). Blank = skipped silently. Any SMTP provider works. |

## Customizing

- **Rates:** use `/admin/rates` (don't edit code). For a fresh install, you can
  hand-edit `lib/default-rates.js`, which only affects the first seed.
- **Branding/colors:** `tailwind.config.js` (the `asphalt` / `route` / `amber` /
  `paper` / `mist` palette) and `app/globals.css`. The premium hero treatment
  (glows, dot grid, flowing route motif, entrance animation) is defined there
  and in `app/page.js`, all using the existing palette.
- **Business info:** `.env.local` plus the address text in `components/Footer.js`.
- **Admin password:** `ADMIN_PASSWORD`. For multiple staff logins, swap in a real
  auth provider (NextAuth, Clerk, etc.) instead of the single shared password.

## Notes & next steps

- The fare is calculated client-side; the **payment split is re-derived
  server-side** before a booking is marked paid, and Razorpay signatures are
  verified server-side. For extra safety you could also recompute the base fare
  on the server from the stored rates before creating the order.
- Possible later additions: SMS notifications (Twilio), multiple admin roles,
  webhook-based Razorpay reconciliation, and real WhatsApp Business API
  notifications.
