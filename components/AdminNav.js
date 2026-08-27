'use client';

import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

const TABS = [
  { href: '/admin/dashboard', label: 'Bookings' },
  { href: '/admin/rates', label: 'Rates & Fleet' },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-1 rounded-full bg-mist p-1">
        {TABS.map((t) => (
          <a
            key={t.href}
            href={t.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pathname === t.href ? 'bg-route-teal text-white' : 'text-asphalt/60 hover:text-asphalt'
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>
      <LogoutButton />
    </div>
  );
}
