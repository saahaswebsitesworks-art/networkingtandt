'use client';

const PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+917975630631';
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917975630631';

function PhoneIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.696 4.61 1.897 6.478L4 29l7.72-1.865A11.93 11.93 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.6a9.55 9.55 0 0 1-4.87-1.334l-.35-.207-4.583 1.107 1.127-4.47-.228-.365A9.56 9.56 0 1 1 25.6 15c0 5.302-4.298 9.6-9.6 9.6zm5.24-7.146c-.287-.144-1.697-.837-1.96-.933-.263-.096-.454-.144-.646.144-.192.287-.742.933-.91 1.125-.168.192-.335.216-.622.072-.287-.144-1.212-.447-2.31-1.426-.854-.762-1.43-1.703-1.598-1.99-.168-.287-.018-.442.126-.585.13-.13.288-.336.431-.504.144-.168.192-.287.288-.479.096-.192.048-.36-.024-.504-.072-.144-.646-1.558-.885-2.134-.233-.56-.47-.484-.646-.493l-.55-.01c-.192 0-.504.072-.767.36-.263.287-1.005.982-1.005 2.396s1.03 2.78 1.174 2.972c.144.192 2.027 3.096 4.912 4.34.686.296 1.221.473 1.638.605.688.219 1.314.188 1.81.114.552-.082 1.697-.694 1.937-1.364.24-.67.24-1.244.168-1.364-.072-.12-.263-.192-.55-.336z" />
    </svg>
  );
}

export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="focus-ring flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:brightness-95 active:scale-95"
      >
        <WhatsAppIcon />
      </a>

      <a
        href={`tel:${PHONE}`}
        aria-label="Call us"
        className="focus-ring flex h-14 w-14 items-center justify-center rounded-full bg-route-teal text-white shadow-xl transition hover:brightness-95 active:scale-95"
      >
        <PhoneIcon />
      </a>
    </div>
  );
}