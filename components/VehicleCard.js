'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { calculatePrice, formatINR } from '@/lib/pricing';

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

export default function VehicleCard({ vehicle, vehicles, tripType, km, days, gstRate, onSelect }) {
  const [localPackageIdx, setLocalPackageIdx] = useState(0);
  const imageSrc = getVehicleImage(vehicle);

  const price = useMemo(
    () =>
      calculatePrice({
        vehicles,
        vehicleId: vehicle.id,
        tripType,
        km,
        days,
        localPackageIdx,
        gstRate,
      }),
    [vehicles, vehicle.id, tripType, km, days, localPackageIdx, gstRate]
  );

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-mist p-2 sm:h-24 sm:w-32">
          <Image
            src={imageSrc}
            alt={vehicle.label}
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-asphalt">{vehicle.label}</span>
            <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-route-teal">
              {vehicle.seats} seats
            </span>
          </div>
          <div className="text-sm text-asphalt/50">{vehicle.subLabel}</div>

          {tripType === 'local' && vehicle.local?.packages?.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {vehicle.local.packages.map((p, idx) => (
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
          onClick={() => onSelect({ vehicleId: vehicle.id, localPackageIdx, price })}
          className="focus-ring rounded-full bg-amber px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-dark disabled:opacity-40"
        >
          {price?.enquiryOnly ? 'Request Quote' : 'Select Car'}
        </button>
      </div>
    </div>
  );
}