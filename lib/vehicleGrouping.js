/**
 * vehicleGrouping.js
 *
 * Groups vehicle rate entries that are really "variants" of the same
 * logical vehicle (e.g. tt_ac / tt_nonac -> "tt") into a single group.
 *
 * This is the single source of truth for grouping so that both the
 * vehicle-card list and the story/avatar selector stay in sync and never
 * need two competing implementations.
 */

// Map of baseId -> ordered list of variant ids that belong to it.
// Add more entries here in the future if other vehicles ever need
// AC/Non-AC (or similar) variants.
const VARIANT_GROUPS = {
  tt: ['tt_ac', 'tt_non_ac'],
};

/**
 * Given a raw vehicle id (e.g. 'tt_ac'), return the base/group id it
 * belongs to (e.g. 'tt'). Vehicles that aren't part of any variant group
 * simply map to themselves.
 */
export function getBaseVehicleKey(vehicleId) {
  for (const [baseId, variantIds] of Object.entries(VARIANT_GROUPS)) {
    if (variantIds.includes(vehicleId)) return baseId;
  }
  return vehicleId;
}

/**
 * Groups a flat vehicles array into logical vehicle groups.
 *
 * Returns an array of:
 *   {
 *     baseId: string,          // e.g. 'tt' or 'sedan'
 *     variants: Vehicle[],     // 1 or more raw vehicle entries, in the
 *                              // original order they appeared in `vehicles`
 *   }
 *
 * Does NOT mutate the input array.
 */
export function groupVehicles(vehicles) {
  const order = [];
  const groups = new Map();

  for (const vehicle of vehicles) {
    const baseId = getBaseVehicleKey(vehicle.id);
    if (!groups.has(baseId)) {
      groups.set(baseId, { baseId, variants: [] });
      order.push(baseId);
    }
    groups.get(baseId).variants.push(vehicle);
  }

  return order.map((baseId) => groups.get(baseId));
}

/**
 * Convenience: is this group a multi-variant (toggleable) group?
 */
export function hasMultipleVariants(group) {
  return group.variants.length > 1;
}

// Display label to use for the group as a whole (card title, story-row
// caption) — independent of whichever variant is currently selected, so
// toggling AC / Non-AC never changes the headline label.
const GROUP_LABELS = {
  tt: 'Tempo Traveller',
};

export function getGroupLabel(group) {
  return GROUP_LABELS[group.baseId] || group.variants[0].label;
}

// Toggle-button text (e.g. "AC" / "Non-AC") is derived from each vehicle's
// own `label`, not its id. Deriving from the label keeps this correct even
// if the underlying id doesn't match the label (e.g. a mis-keyed entry in
// the rates data) — the toggle always shows what the vehicle actually is.
export function getVariantToggleLabel(vehicle) {
  const label = vehicle.label || '';
  if (/non[\s-]?ac/i.test(label)) return 'Non-AC';
  if (/\bac\b/i.test(label)) return 'AC';
  return label;
}