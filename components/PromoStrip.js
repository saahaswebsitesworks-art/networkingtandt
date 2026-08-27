const promos = [
  { icon: '💵', title: 'Book now, pay later', body: 'Confirm your ride free — settle up with the driver in cash or UPI.' },
  { icon: '🚫', title: 'Free cancellations', body: 'Plans changed? Cancel up to 1 hour before pickup, no questions asked.' },
  { icon: '📞', title: '24×7 support', body: 'Call or WhatsApp our Thanisandra team any time, day or night.' },
];

export default function PromoStrip() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-14 pt-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {promos.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl bg-mist p-6 transition hover:bg-route-teal/10"
          >
            <div className="text-2xl">{p.icon}</div>
            <div className="mt-3 font-display text-base font-bold text-asphalt">{p.title}</div>
            <p className="mt-1 text-sm text-asphalt/60">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
