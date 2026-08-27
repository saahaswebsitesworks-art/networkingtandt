'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConfirmationCard from '@/components/ConfirmationCard';
import { GroupIcon } from '@/components/Icons';
import { vehiclesForTripType } from '@/lib/pricing';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function GroupBookingPage() {
  const [rates, setRates] = useState(null);
  const [vehicleId, setVehicleId] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState(todayStr());
  const [groupSize, setGroupSize] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/rates')
      .then((r) => r.json())
      .then((data) => {
        setRates(data);
        const options = vehiclesForTripType(data.vehicles, 'group');
        if (options[0]) setVehicleId(options[0].id);
      });
  }, []);

  const vehicleOptions = rates ? vehiclesForTripType(rates.vehicles, 'group') : [];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim() || !pickup.trim()) {
      setError('Please enter your name, phone number and pickup location.');
      return;
    }
    setSubmitting(true);

    const vehicle = rates?.vehicles?.[vehicleId];
    const booking = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      tripType: 'group',
      tripTypeLabel: 'Bus / Tempo Traveller (Enquiry)',
      vehicleId,
      vehicleLabel: vehicle?.label || 'Group vehicle',
      pickup,
      drop,
      date,
      time: '',
      days: 1,
      km: 0,
      notes: groupSize ? `Group size: ${groupSize}. ${notes}` : notes,
      price: { enquiryOnly: true, label: vehicle?.label },
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data.booking);
    } catch (err) {
      setError(err.message + ' — please call or WhatsApp us directly instead.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <Header />

      <section className="bg-asphalt-gradient py-14 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <GroupIcon className="h-9 w-9" />
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Group &amp; Bus Bookings</h1>
        <p className="mx-auto mt-2 max-w-xl px-5 text-sm text-white/70">
          Mini buses, 33-seaters and 50-seater buses (AC &amp; Non-AC) are quoted individually depending on your
          route and group size. Share your details and our team will call or WhatsApp you a price.
        </p>
      </section>

      <div className="mx-auto max-w-2xl px-5 py-10">
        {result ? (
          <ConfirmationCard booking={result} />
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-black/5 bg-white p-6 shadow-ticket sm:p-8">
            <Field label="Vehicle type">
              <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="ntt-input">
                {vehicleOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} ({v.seats} seats)
                  </option>
                ))}
              </select>
            </Field>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Pickup location">
                <input value={pickup} onChange={(e) => setPickup(e.target.value)} className="ntt-input" required />
              </Field>
              <Field label="Destination">
                <input value={drop} onChange={(e) => setDrop(e.target.value)} className="ntt-input" />
              </Field>
              <Field label="Date">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="ntt-input" />
              </Field>
              <Field label="Approx. group size">
                <input type="number" min="1" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} placeholder="e.g. 25" className="ntt-input" />
              </Field>
              <Field label="Full name">
                <input value={name} onChange={(e) => setName(e.target.value)} className="ntt-input" required />
              </Field>
              <Field label="Phone number">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="ntt-input" required />
              </Field>
              <Field label="Email (optional)">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="ntt-input" />
              </Field>
              <Field label="Notes">
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Trip purpose, timing, etc." className="ntt-input" />
              </Field>
            </div>

            {error && <p className="mt-4 text-sm font-medium text-amber-dark">{error}</p>}

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="focus-ring w-full rounded-full bg-amber px-12 py-4 text-center font-display text-base font-bold uppercase tracking-wide text-white transition hover:bg-amber-dark disabled:opacity-60 sm:w-auto"
              >
                {submitting ? 'Sending…' : 'Request a Quote'}
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />

    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-asphalt/50">{label}</span>
      {children}
    </label>
  );
}
