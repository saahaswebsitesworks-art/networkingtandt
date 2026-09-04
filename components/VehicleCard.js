'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { calculatePrice, formatINR } from '@/lib/pricing';
import { hasMultipleVariants, getGroupLabel, getVariantToggleLabel } from '@/lib/vehicleGrouping';

export const VEHICLE_IMAGE_MAP = {
  sedan: '/images/sedan.jpeg',
  suv: '/images/suv.jpeg',
  innova: '/images/innovacrysta.jpeg',
  innovacrysta: '/images/innovacrysta.jpeg',
  crysta: '/images/innovacrysta.jpeg',
  tt: '/images/tt.jpeg',
  traveller: '/images/tt.jpeg',
  tempo: '/images/tt.jpeg',
  bus: '/images/bus.jpeg',
};

export function getVehicleImage(vehicle) {
  const key = (vehicle.id || vehicle.type || vehicle.label || '').toLowerCase();
  const match = Object.keys(VEHICLE_IMAGE_MAP).find((k) => key.includes(k));
  return VEHICLE_IMAGE_MAP[match] || '/images/sedan.jpeg';
}

// (toggle-button labels are now derived per-vehicle via getVariantToggleLabel,
// so they stay correct even if an id doesn't match its label)

/**
 * VehicleCard now renders one logical vehicle "group" rather than a single
 * raw rate entry. For most vehicles (sedan, suv, innova, bus, ...) a group
 * has exactly one variant and the card behaves exactly as before.
 *
 * For Tempo Traveller, the group may contain both `tt_ac` and `tt_nonac`,
 * in which case an AC / Non-AC toggle is rendered and the selected variant
 * drives pricing, labels, and the id passed to onSelect.
 *
 * Props:
 *   group: { baseId: string, variants: Vehicle[] }  (from groupVehicles)
 *   vehicles: full raw vehicles array (unchanged, passed through to calculatePrice)
 *   tripType, km, days, gstRate, onSelect: unchanged
 */
export default function VehicleCard({ group, vehicles, tripType, km, days, gstRate, onSelect }) {
  const variants = group.variants;
  const isMultiVariant = hasMultipleVariants(group);

  // Default to whichever variant is actually the AC one, by content
  // (getVariantToggleLabel reads the vehicle's label, not its id — this
  // stays correct even if an id/label pair is mismatched in the data).
  const defaultVariant =
    variants.find((v) => getVariantToggleLabel(v) === 'AC') || variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);

  const selectedVehicle =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const [localPackageIdx, setLocalPackageIdx] = useState(0);
  const imageSrc = getVehicleImage(selectedVehicle);

  const price = useMemo(
    () =>
      calculatePrice({
        vehicles,
        vehicleId: selectedVehicle.id,
        tripType,
        km,
        days,
        localPackageIdx,
        gstRate,
      }),
    [vehicles, selectedVehicle.id, tripType, km, days, localPackageIdx, gstRate]
  );

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-mist p-2 sm:h-24 sm:w-32">
          <Image
            src={imageSrc}
            alt={selectedVehicle.label}
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-asphalt">{getGroupLabel(group)}</span>
            <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-route-teal">
              {selectedVehicle.seats} seats
            </span>
          </div>

          {isMultiVariant && (
            <div className="mt-2 flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    selectedVariantId === v.id
                      ? 'border-route-teal bg-route-teal/10 text-route-teal'
                      : 'border-black/10 text-asphalt/60 hover:border-asphalt/30'
                  }`}
                >
                  {getVariantToggleLabel(v)}
                </button>
              ))}
            </div>
          )}

          <div className="mt-1 text-sm text-asphalt/50">{selectedVehicle.subLabel}</div>

          {tripType === 'local' && selectedVehicle.local?.packages?.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedVehicle.local.packages.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLocalPackageIdx(idx)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    localPackageIdx === idx
                      ? 'border-route-teal bg-route-teal/10 text-route-teal'
                      : 'border-black/10 text-asphalt/60 hover:border-asphalt/30'
                  }`}
                >
                  {p.hrs} hrs / {p.km} km
                </button>
              ))}
            </div>
          )}

          {price?.error && <p className="mt-2 text-xs font-medium text-amber-dark">{price.error}</p>}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        {price?.enquiryOnly ? (
          <span className="text-sm font-semibold text-asphalt/60">Price on request</span>
        ) : price?.subtotal !== undefined ? (
          <>
            <span className="font-display text-2xl font-extrabold text-asphalt">{formatINR(price.subtotal)}</span>
            <span className="text-[11px] text-asphalt/40">+ GST · choose payment at checkout</span>
          </>
        ) : null}
        <button
          type="button"
          disabled={!!price?.error}
          onClick={() => onSelect({ vehicleId: selectedVehicle.id, localPackageIdx, price })}
          className="focus-ring rounded-full bg-amber px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-dark disabled:opacity-40"
        >
          {price?.enquiryOnly ? 'Request Quote' : 'Select Car'}
        </button>
      </div>
    </div>
  );
}