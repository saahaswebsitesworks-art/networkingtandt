'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin-login', { method: 'DELETE' });
    router.push('/admin');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="focus-ring rounded-full border-2 border-asphalt/20 px-4 py-2 text-sm font-semibold text-asphalt hover:border-asphalt"
    >
      Log out
    </button>
  );
}
