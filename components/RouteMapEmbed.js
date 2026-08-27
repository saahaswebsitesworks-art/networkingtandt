'use client';

// Keyless Google Maps route preview.
//
// Uses the classic maps.google.com "output=embed" directions URL, which
// renders an interactive Google map of the route WITHOUT any API key or
// billing account. Driving distance/fare is still computed separately and
// keyless (OpenStreetMap) — this iframe is purely the visual route.
//
// props.points: ordered [{ lat, lng }] — pickup, ...stops, drop.
export default function RouteMapEmbed({ points }) {
  const pts = (points || []).filter(
    (p) => p && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng))
  );
  if (pts.length < 2) return null;

  const coord = (p) => `${Number(p.lat).toFixed(6)},${Number(p.lng).toFixed(6)}`;
  const origin = coord(pts[0]);
  const rest = pts.slice(1);
  const destination = coord(rest[rest.length - 1]);
  const waypoints = rest.slice(0, -1).map(coord);

  // daddr supports chained "to:" waypoints, e.g. A+to:B+to:C
  const daddr = [...waypoints, destination].join('+to:');
  const src = `https://maps.google.com/maps?saddr=${origin}&daddr=${daddr}&hl=en&z=11&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm">
      <iframe
        title="Route map"
        src={src}
        className="h-64 w-full sm:h-72"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
