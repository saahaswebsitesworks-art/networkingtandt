export default function TrustBar() {
  const badges = [
    { label: 'Google Reviews', rating: '4.9 ★', sub: '161 reviews' },
    { label: 'On-time pickups', rating: '24×7', sub: 'always available' },
    { label: 'Pay after ride', rating: '₹0', sub: 'advance payment' },
  ];
  return (
    <section className="mx-auto max-w-4xl px-5 pb-4 pt-10">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-5 py-3 shadow-sm">
            <div className="font-display text-lg font-extrabold text-route-teal">{b.rating}</div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-asphalt">{b.label}</div>
              <div className="text-[11px] text-asphalt/50">{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
