'use client';

import { useEffect, useRef, useState } from 'react';
import { searchPlaces, refinePlace } from '@/lib/geo';

/**
 * Free-text input with a live address-suggestion dropdown (OpenStreetMap /
 * Nominatim search, debounced). No API key, no external SDK.
 *
 * props:
 *  - value: current text
 *  - onChange(text): fired on every keystroke (also clears the resolved place)
 *  - onPlaceSelect({ address, lat, lng } | null): fired when a suggestion is
 *    picked, or cleared when the user edits the text again
 */
export default function PlaceInput({ value, onChange, onPlaceSelect, placeholder, required, className = 'ntt-input' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  function handleChange(text) {
    onChange(text);
    onPlaceSelect?.(null);

    clearTimeout(debounceRef.current);
    if (text.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const myRequestId = ++requestIdRef.current;
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchPlaces(text);
        if (myRequestId !== requestIdRef.current) return; // a newer keystroke superseded this
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        if (myRequestId === requestIdRef.current) setSuggestions([]);
      } finally {
        if (myRequestId === requestIdRef.current) setLoading(false);
      }
    }, 400);
  }

  async function handleSelect(s) {
    onChange(s.address);
    setOpen(false);
    setSuggestions([]);
    // Curated localities carry only an approximate centre; fetch precise
    // coordinates so the distance/fare is accurate.
    if (s.refine) {
      onPlaceSelect?.({ address: s.address, lat: s.lat, lng: s.lng });
      const precise = await refinePlace(s);
      onPlaceSelect?.({ address: s.address, lat: precise.lat, lng: precise.lng });
    } else {
      onPlaceSelect?.(s);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={className}
      />
      {open && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-black/10 bg-white shadow-lg">
          {loading && <div className="px-3 py-2 text-xs text-asphalt/40">Searching…</div>}
          {!loading &&
            suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(s)}
                className="block w-full truncate px-3 py-2 text-left text-sm text-asphalt hover:bg-mist"
              >
                {s.address}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
