'use client';

import { useEffect, useState } from 'react';

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY || '079756 30631';

export default function TravelExpertPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('ntt_popup_shown')) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem('ntt_popup_shown', '1');
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-asphalt/60 px-5"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-mist to-white p-8 shadow-ticket sm:p-10"
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="focus-ring absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber text-white hover:bg-amber-dark"
        >
          ✕
        </button>

        <div className="text-xs font-bold uppercase tracking-widest text-amber-dark">Say hello to,</div>
        <div className="mt-1 font-display text-3xl font-extrabold text-asphalt sm:text-4xl">
          Your <span className="text-amber">24×7</span>
          <br />
          Travel Expert
        </div>
        <p className="mt-3 text-sm text-asphalt/60">Get expert advice for smarter travel plans!</p>

        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href={`tel:${PHONE}`}
            className="focus-ring flex items-center gap-2 rounded-full bg-white px-5 py-3 font-display text-lg font-bold text-asphalt shadow-sm"
          >
            📞 {PHONE_DISPLAY}
          </a>
          <a
            href={`tel:${PHONE}`}
            className="focus-ring text-sm font-bold uppercase tracking-wide text-amber-dark hover:underline"
          >
            Talk to us
          </a>
        </div>
      </div>
    </div>
  );
}
