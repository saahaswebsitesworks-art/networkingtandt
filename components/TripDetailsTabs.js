'use client';

import { useState } from 'react';

// Small inline icons, matched to list-item text by keyword below.
function FuelIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v13" />
      <path d="M14 10h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2v-8l-3-3" />
      <path d="M4 21h12" />
    </svg>
  );
}
function DriverIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18a8 8 0 0 1 16 0" />
      <circle cx="12" cy="9" r="4" />
    </svg>
  );
}
function TaxIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16v4a4 4 0 0 0 0 8v4H4v-4a4 4 0 0 0 0-8z" />
    </svg>
  );
}
function DocIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}
function AcIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="6" rx="2" />
      <path d="M6 13l-1.5 4M11 13l-1 4M16 13l-1 4M21 13l-1.5 4" />
    </svg>
  );
}
function RouteIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 20l-5-2V6l5 2 6-2 5 2v12l-5-2-6 2z" />
      <path d="M9 8v12M15 6v12" />
    </svg>
  );
}
function SeatIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v9a2 2 0 0 0 2 2h6" />
      <path d="M6 13H5a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h1" />
      <path d="M14 15h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1" />
    </svg>
  );
}
function CarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5" />
      <rect x="2" y="13" width="20" height="6" rx="2" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}
function BagIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M9 12v4M15 12v4" />
    </svg>
  );
}
function DotIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

const ICON_RULES = [
  { test: /fuel|base fare/i, Icon: FuelIcon },
  { test: /driver allowance/i, Icon: DriverIcon },
  { test: /state tax|toll/i, Icon: TaxIcon },
  { test: /gst/i, Icon: DocIcon },
  { test: /non[\s-]?ac|\bac\b/i, Icon: AcIcon },
  { test: /seat/i, Icon: SeatIcon },
  { test: /bag/i, Icon: BagIcon },
  { test: /km|route|pickup|drop/i, Icon: RouteIcon },
  { test: /car|vehicle|cab/i, Icon: CarIcon },
];

function iconFor(text) {
  const rule = ICON_RULES.find((r) => r.test.test(text));
  return rule ? rule.Icon : DocIcon;
}

const TABS = [
  { id: 'inclusions', label: 'INCLUSIONS' },
  { id: 'exclusions', label: 'EXCLUSIONS' },
  { id: 'facilities', label: 'FACILITIES' },
  { id: 'tc', label: 'T&C' },
];

/**
 * 4-tab Inclusions / Exclusions / Facilities / T&C card.
 *
 * props: inclusions, exclusions, facilities — arrays of plain-text strings
 * (icon is auto-picked per item via keyword matching, so callers don't need
 * to specify icons). terms — array of plain-text T&C bullet strings.
 */
export default function TripDetailsTabs({ inclusions = [], exclusions = [], facilities = [], terms = [] }) {
  const [activeTab, setActiveTab] = useState('inclusions');

  const itemsByTab = {
    inclusions,
    exclusions,
    facilities,
    tc: terms,
  };
  const activeItems = itemsByTab[activeTab] || [];

  return (
    <div className="mt-4 rounded-2xl border border-black/5 p-4 sm:p-5">
      <div className="grid grid-cols-4 gap-0 overflow-hidden rounded-lg border border-black/10">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-0 items-center justify-center px-1 py-2.5 text-center text-[9px] font-bold leading-tight tracking-tight transition sm:px-2 sm:text-[11px] sm:tracking-wide ${
                active ? 'bg-route-teal text-white' : 'bg-white text-asphalt/40 hover:text-asphalt/60'
              } ${tab.id !== 'inclusions' ? 'border-l border-black/10' : ''}`}
            >
              <span className="whitespace-normal break-words">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {activeItems.length === 0 ? (
          <p className="py-4 text-sm text-asphalt/40">Nothing to show here.</p>
        ) : activeTab === 'tc' ? (
          <ul className="space-y-3">
            {activeItems.map((text, i) => (
              <li key={i} className="flex gap-2 text-sm text-asphalt/80">
                <DotIcon className="mt-1.5 h-1.5 w-1.5 shrink-0 text-asphalt/40" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {activeItems.map((text, i) => {
              const Icon = iconFor(text);
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-route-teal/40 text-route-teal">
                    <Icon />
                  </span>
                  <span className="text-sm text-asphalt/80">{text}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}