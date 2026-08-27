import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRatesData } from '@/lib/rates-store';
import RatesManager from '@/components/RatesManager';
import AdminNav from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminRates() {
  const isAdmin = cookies().get('ntt_admin')?.value === '1';
  if (!isAdmin) redirect('/admin');

  const { vehicles, settings } = await getRatesData();

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Admin</div>
          <h1 className="font-display text-3xl font-bold text-asphalt">Rates &amp; Fleet</h1>
        </div>
        <AdminNav />
        <RatesManager initialVehicles={vehicles} initialSettings={settings} />
      </div>
    </main>
  );
}
