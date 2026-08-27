'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-asphalt-gradient px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-ticket">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-route-teal">Admin</div>
        <h1 className="font-display text-2xl font-bold text-asphalt">Sign in</h1>
        <p className="mt-1 text-sm text-asphalt/60">Manage bookings for Networking Tours &amp; Travels.</p>

        <label className="mt-6 block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-asphalt/50">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-2 border-asphalt/10 px-3 py-2 focus:border-route-teal focus:outline-none"
            required
          />
        </label>

        {error && <p className="mt-3 text-sm font-medium text-amber-dark">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-6 w-full rounded-full bg-route-gradient py-3 font-display font-bold text-asphalt hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
