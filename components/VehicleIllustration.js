// Small, dependency-free vehicle illustrations. Using flat SVG shapes
// instead of stock photography keeps the site fast, licence-free, and
// consistent with the brand colours everywhere it's used.

const PALETTE = {
  sedan: '#0B84C4',
  suv: '#2FBF8F',
  crysta: '#FF7A30',
  tempo: '#0B4A68',
  bus: '#0B1F2A',
};

export default function VehicleIllustration({ type = 'sedan', className = 'h-16 w-28' }) {
  const color = PALETTE[type] || PALETTE.sedan;

  if (type === 'tempo' || type === 'bus') {
    const windows = type === 'bus' ? 5 : 3;
    return (
      <svg viewBox="0 0 140 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="18" width="120" height="34" rx="6" fill={color} />
        <rect x="10" y="18" width="120" height="10" rx="4" fill="black" opacity="0.08" />
        {Array.from({ length: windows }).map((_, i) => (
          <rect key={i} x={22 + i * (96 / windows)} y="24" width={70 / windows} height="14" rx="2" fill="#EAF6FC" />
        ))}
        <circle cx="34" cy="56" r="9" fill="#0B1F2A" />
        <circle cx="34" cy="56" r="3.5" fill="#EAF6FC" />
        <circle cx="106" cy="56" r="9" fill="#0B1F2A" />
        <circle cx="106" cy="56" r="3.5" fill="#EAF6FC" />
      </svg>
    );
  }

  // sedan / suv / crysta share a "car" silhouette, sized slightly differently
  const tall = type === 'suv' || type === 'crysta';
  return (
    <svg viewBox="0 0 140 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d={
          tall
            ? 'M15 50 C15 34 24 30 34 28 L46 16 C50 12 56 10 63 10 H92 C99 10 105 13 109 18 L119 30 C127 31 133 36 133 44 V50 Z'
            : 'M15 50 C15 38 22 33 32 32 L44 18 C48 14 53 12 59 12 H88 C94 12 99 15 103 20 L114 32 C123 33 129 38 129 46 V50 Z'
        }
        fill={color}
      />
      <path
        d={tall ? 'M40 27 L49 17 H90 L100 27 Z' : 'M46 31 L53 19 H86 L96 31 Z'}
        fill="#EAF6FC"
        opacity="0.85"
      />
      <rect x="10" y="48" width="124" height="6" rx="3" fill={color} opacity="0.9" />
      <circle cx="40" cy="56" r="10" fill="#0B1F2A" />
      <circle cx="40" cy="56" r="4" fill="#EAF6FC" />
      <circle cx="104" cy="56" r="10" fill="#0B1F2A" />
      <circle cx="104" cy="56" r="4" fill="#EAF6FC" />
    </svg>
  );
}
