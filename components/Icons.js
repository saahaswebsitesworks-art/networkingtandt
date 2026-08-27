// Simple, consistent line-art icons drawn for this project — used instead of
// stock photography so there's nothing to license. All use currentColor so
// they inherit text color from their wrapper.

export function CarIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 28l3-10a4 4 0 0 1 3.8-2.7h22.4A4 4 0 0 1 39 18l3 10" />
      <rect x="4" y="28" width="40" height="10" rx="3" />
      <circle cx="14" cy="38" r="3.5" />
      <circle cx="34" cy="38" r="3.5" />
      <path d="M9 22h30" />
    </svg>
  );
}

export function SuvIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 27l2-11a4 4 0 0 1 4-3h10l7 7h9a3 3 0 0 1 3 3l1 4" />
      <rect x="3" y="27" width="42" height="10" rx="3" />
      <circle cx="14" cy="37" r="3.5" />
      <circle cx="34" cy="37" r="3.5" />
    </svg>
  );
}

export function VanIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 30V16a2 2 0 0 1 2-2h20v16" />
      <path d="M26 22h10l6 6v2" />
      <rect x="4" y="30" width="38" height="7" rx="2" />
      <circle cx="13" cy="37" r="3.5" />
      <circle cx="33" cy="37" r="3.5" />
      <path d="M14 20h6M14 25h6" />
    </svg>
  );
}

export function BusIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="9" width="38" height="24" rx="3" />
      <path d="M5 22h38" />
      <path d="M12 15h6M20 15h6M28 15h6" />
      <circle cx="13" cy="37" r="3.2" />
      <circle cx="35" cy="37" r="3.2" />
    </svg>
  );
}

export function PlaneIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4v18M24 4l8 10M24 4l-8 10" />
      <path d="M6 26l36-4-4 8-32-2z" />
      <path d="M19 30l-3 10 4-2 3-7" />
    </svg>
  );
}

export function ClockIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="18" />
      <path d="M24 14v10l7 5" />
    </svg>
  );
}

export function RouteIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="4" />
      <circle cx="39" cy="36" r="4" />
      <path d="M9 16v6a6 6 0 0 0 6 6h6a6 6 0 0 1 6 6v2" strokeDasharray="3 4" />
    </svg>
  );
}

export function ArrowRouteIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 24h30" strokeDasharray="3 4" />
      <path d="M28 15l10 9-10 9" />
    </svg>
  );
}

export function GroupIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="5" />
      <circle cx="32" cy="16" r="5" />
      <path d="M6 38v-3a8 8 0 0 1 8-8h4a8 8 0 0 1 6.9 4" />
      <path d="M22 38v-3a8 8 0 0 1 8-8h4a8 8 0 0 1 8 8v3" />
    </svg>
  );
}

export function ShieldIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 5l16 6v11c0 10-7 17-16 21-9-4-16-11-16-21V11z" />
      <path d="M17 24l5 5 9-10" />
    </svg>
  );
}

export function RupeeIcon({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10h20M14 18h20M14 10a8 8 0 0 1 0 16h-3l12 12" />
    </svg>
  );
}

export function VEHICLE_ICON_MAP(vehicle) {
  const id = (vehicle?.id || '').toLowerCase();
  const label = (vehicle?.label || '').toLowerCase();
  if (id.includes('bus') || label.includes('bus')) return BusIcon;
  if (id.includes('tt') || label.includes('tempo')) return VanIcon;
  if (id.includes('suv') || label.includes('suv') || label.includes('crysta') || label.includes('innova')) return SuvIcon;
  return CarIcon;
}
