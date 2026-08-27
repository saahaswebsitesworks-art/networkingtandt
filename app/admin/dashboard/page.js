import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getBookings } from '@/lib/db';
import BookingsTable from '@/components/BookingsTable';
import AdminNav from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const isAdmin = cookies().get('ntt_admin')?.value === '1';
  if (!isAdmin) redirect('/admin');

  const bookings = await getBookings();

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-route-teal">Admin</div>
          <h1 className="font-display text-3xl font-bold text-asphalt">Bookings</h1>
        </div>
        <AdminNav />
        <BookingsTable initialBookings={bookings} />
      </div>
    </main>
  );
}
