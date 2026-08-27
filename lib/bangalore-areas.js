// Curated list of Bengaluru localities + popular outstation destinations, with
// approximate coordinates. These power instant, offline-friendly suggestions so
// the whole city shows up (not just 2-3 Nominatim hits), and they tolerate small
// spelling mistakes via edit-distance matching (see searchLocalAreas).
//
// Coordinates are approximate hints only — PlaceInput refines the exact lat/lng
// against Nominatim when a suggestion is selected, so a rough centre is fine.

const BLR = 'Bengaluru, Karnataka';

// [name, lat, lng, suffix?]  — suffix defaults to "Bengaluru, Karnataka"
const RAW_AREAS = [
  // ---- Central ----
  ['MG Road', 12.9756, 77.6068],
  ['Brigade Road', 12.9718, 77.6068],
  ['Church Street', 12.9749, 77.6045],
  ['Cubbon Park', 12.9763, 77.5929],
  ['Vidhana Soudha', 12.9794, 77.5905],
  ['Majestic', 12.9767, 77.5713],
  ['Kempegowda Bus Station', 12.9776, 77.5726],
  ['Gandhi Nagar', 12.9789, 77.5748],
  ['Shivajinagar', 12.9853, 77.6055],
  ['Richmond Town', 12.96, 77.605],
  ['Langford Town', 12.955, 77.599],
  ['Ulsoor', 12.982, 77.62],
  ['Halasuru', 12.982, 77.62],
  ['Fraser Town', 13.0007, 77.615],
  ['Cox Town', 13.0, 77.62],
  ['Benson Town', 13.003, 77.605],
  ['Vasanth Nagar', 12.99, 77.59],
  ['Chickpet', 12.97, 77.578],
  ['Cottonpet', 12.966, 77.576],
  ['Balepet', 12.968, 77.578],
  ['Malleshwaram', 13.0035, 77.5647],
  ['Rajajinagar', 12.991, 77.555],
  ['Seshadripuram', 12.993, 77.576],
  ['Sadashivanagar', 13.0068, 77.581],
  ['Sampangiram Nagar', 12.972, 77.593],
  ['Wilson Garden', 12.949, 77.598],
  ['Shanti Nagar', 12.956, 77.599],
  ['Double Road', 12.96, 77.596],

  // ---- South / South-central ----
  ['Basavanagudi', 12.942, 77.573],
  ['Gandhi Bazaar', 12.943, 77.571],
  ['Jayanagar', 12.925, 77.5938],
  ['Jayanagar 4th Block', 12.925, 77.583],
  ['JP Nagar', 12.9063, 77.5857],
  ['Banashankari', 12.925, 77.546],
  ['Banashankari 2nd Stage', 12.924, 77.549],
  ['BTM Layout', 12.9166, 77.6101],
  ['Madiwala', 12.921, 77.618],
  ['Girinagar', 12.943, 77.547],
  ['Padmanabhanagar', 12.916, 77.556],
  ['Kumaraswamy Layout', 12.908, 77.561],
  ['ISRO Layout', 12.9, 77.555],
  ['Uttarahalli', 12.906, 77.546],
  ['Chamrajpet', 12.956, 77.562],
  ['VV Puram', 12.952, 77.576],
  ['Lalbagh', 12.949, 77.585],
  ['Adugodi', 12.943, 77.61],
  ['Koramangala', 12.9352, 77.6245],
  ['Koramangala 5th Block', 12.934, 77.614],
  ['Ejipura', 12.941, 77.626],
  ['Vivek Nagar', 12.953, 77.618],
  ['Austin Town', 12.96, 77.621],
  ['HSR Layout', 12.9116, 77.6412],
  ['Bommanahalli', 12.906, 77.618],
  ['Bannerghatta Road', 12.89, 77.597],
  ['Bannerghatta', 12.8, 77.577],
  ['Arekere', 12.884, 77.599],
  ['Hulimavu', 12.876, 77.601],
  ['Gottigere', 12.858, 77.586],
  ['Begur', 12.873, 77.63],
  ['Kudlu Gate', 12.888, 77.644],
  ['Singasandra', 12.879, 77.647],
  ['Hosa Road', 12.888, 77.657],
  ['Electronic City', 12.8452, 77.6602],
  ['Electronic City Phase 1', 12.844, 77.66],
  ['Electronic City Phase 2', 12.839, 77.678],
  ['Konappana Agrahara', 12.85, 77.66],
  ['Chandapura', 12.801, 77.704],

  // ---- East ----
  ['Indiranagar', 12.9719, 77.6412],
  ['Domlur', 12.961, 77.638],
  ['CV Raman Nagar', 12.985, 77.663],
  ['Kaggadasapura', 12.98, 77.668],
  ['Marathahalli', 12.956, 77.701],
  ['Kundalahalli', 12.966, 77.713],
  ['Brookefield', 12.966, 77.717],
  ['AECS Layout', 12.965, 77.708],
  ['Whitefield', 12.9698, 77.75],
  ['ITPL', 12.9865, 77.736],
  ['Kadugodi', 12.993, 77.758],
  ['Hoodi', 12.992, 77.715],
  ['Mahadevapura', 12.991, 77.687],
  ['Doddanekundi', 12.976, 77.696],
  ['Varthur', 12.94, 77.747],
  ['Bellandur', 12.926, 77.676],
  ['Sarjapur Road', 12.901, 77.687],
  ['Sarjapur', 12.859, 77.786],
  ['Kariyammana Agrahara', 12.926, 77.69],
  ['Kadubeesanahalli', 12.938, 77.696],
  ['KR Puram', 13.008, 77.696],
  ['Ramamurthy Nagar', 13.018, 77.672],
  ['Tin Factory', 13.006, 77.66],
  ['Battarahalli', 13.023, 77.708],

  // ---- North-east ----
  ['Banaswadi', 13.014, 77.651],
  ['HRBR Layout', 13.021, 77.642],
  ['Kalyan Nagar', 13.025, 77.641],
  ['Kammanahalli', 13.017, 77.636],
  ['Horamavu', 13.03, 77.665],
  ['Hennur', 13.038, 77.641],
  ['Kothanur', 13.064, 77.642],
  ['Nagawara', 13.043, 77.62],
  ['Manyata Tech Park', 13.043, 77.62],
  ['Thanisandra', 13.057, 77.626],
  ['Hebbal', 13.0358, 77.597],
  ['Hebbal Kempapura', 13.045, 77.59],

  // ---- North ----
  ['RT Nagar', 13.023, 77.594],
  ['Ganganagar', 13.03, 77.59],
  ['Sanjaynagar', 13.031, 77.573],
  ['Mathikere', 13.033, 77.557],
  ['Yeshwanthpur', 13.028, 77.54],
  ['Peenya', 13.028, 77.517],
  ['Jalahalli', 13.043, 77.547],
  ['Nagasandra', 13.047, 77.5],
  ['Vidyaranyapura', 13.079, 77.556],
  ['Sahakara Nagar', 13.062, 77.579],
  ['Kodigehalli', 13.064, 77.586],
  ['Byatarayanapura', 13.064, 77.596],
  ['Amruthahalli', 13.064, 77.6],
  ['Jakkur', 13.077, 77.606],
  ['Yelahanka', 13.1007, 77.5963],
  ['Yelahanka New Town', 13.1, 77.596],
  ['Kogilu', 13.098, 77.618],
  ['Doddaballapur Road', 13.15, 77.54],
  ['Devanahalli', 13.2437, 77.712],
  ['Kempegowda International Airport', 13.1986, 77.7066, 'Devanahalli, Karnataka'],

  // ---- West ----
  ['Vijayanagar', 12.972, 77.538],
  ['Basaveshwaranagar', 12.995, 77.538],
  ['Mahalakshmi Layout', 13.005, 77.545],
  ['Nagarbhavi', 12.96, 77.51],
  ['Nandini Layout', 13.0, 77.545],
  ['Kamakshipalya', 12.98, 77.532],
  ['Magadi Road', 12.976, 77.548],
  ['Sunkadakatte', 12.984, 77.498],
  ['Herohalli', 12.993, 77.49],
  ['Nayandahalli', 12.944, 77.523],
  ['Rajarajeshwari Nagar', 12.926, 77.519],
  ['RR Nagar', 12.926, 77.519],
  ['Kengeri', 12.908, 77.482],
  ['Kengeri Satellite Town', 12.914, 77.485],
  ['Mysore Road', 12.945, 77.52],
  ['Bidadi', 12.798, 77.386, 'Ramanagara, Karnataka'],

  // ---- Popular landmarks / hubs ----
  ['Bangalore City Railway Station', 12.977, 77.571],
  ['Yeshwantpur Railway Station', 13.024, 77.551],
  ['UB City', 12.972, 77.596],
  ['Orion Mall', 13.011, 77.555],
  ['Phoenix Marketcity', 12.997, 77.697],
  ['Forum Mall Koramangala', 12.9345, 77.611],
  ['Mantri Square Mall', 13.006, 77.57],
  ['Bagmane Tech Park', 12.984, 77.665],
  ['Embassy Golf Links', 12.96, 77.647],
  ['Ecospace Bellandur', 12.925, 77.685],
  ['Prestige Tech Park', 12.935, 77.696],
  ['RMZ Ecoworld', 12.928, 77.687],
  ['Manipal Hospital Old Airport Road', 12.958, 77.649],
  ['St John’s Hospital', 12.93, 77.62],
];

// Popular outstation destinations from Bengaluru (suffix carries the region).
const RAW_DESTINATIONS = [
  ['Mysore', 12.2958, 76.6394, 'Karnataka'],
  ['Mysore Palace', 12.3052, 76.6552, 'Mysuru, Karnataka'],
  ['Coorg', 12.4218, 75.7397, 'Madikeri, Karnataka'],
  ['Madikeri', 12.4218, 75.7397, 'Coorg, Karnataka'],
  ['Chikmagalur', 13.3161, 75.7720, 'Karnataka'],
  ['Sakleshpur', 12.9425, 75.7854, 'Karnataka'],
  ['Hassan', 13.0068, 76.0996, 'Karnataka'],
  ['Nandi Hills', 13.3702, 77.6835, 'Chikkaballapur, Karnataka'],
  ['Shivanasamudra Falls', 12.2996, 77.1737, 'Karnataka'],
  ['Mandya', 12.5223, 76.8954, 'Karnataka'],
  ['Ooty', 11.4102, 76.6950, 'Tamil Nadu'],
  ['Coonoor', 11.3530, 76.7959, 'Tamil Nadu'],
  ['Wayanad', 11.6854, 76.1320, 'Kerala'],
  ['Munnar', 10.0889, 77.0595, 'Kerala'],
  ['Kabini', 11.9760, 76.3460, 'Karnataka'],
  ['Bandipur', 11.6543, 76.6295, 'Karnataka'],
  ['BR Hills', 11.9700, 77.1400, 'Karnataka'],
  ['Hampi', 15.3350, 76.4600, 'Karnataka'],
  ['Gokarna', 14.5479, 74.3188, 'Karnataka'],
  ['Mangalore', 12.9141, 74.8560, 'Karnataka'],
  ['Udupi', 13.3409, 74.7421, 'Karnataka'],
  ['Chennai', 13.0827, 80.2707, 'Tamil Nadu'],
  ['Hyderabad', 17.3850, 78.4867, 'Telangana'],
  ['Tirupati', 13.6288, 79.4192, 'Andhra Pradesh'],
  ['Pondicherry', 11.9416, 79.8083, 'Puducherry'],
  ['Yercaud', 11.7750, 78.2095, 'Tamil Nadu'],
  ['Yelagiri', 12.5780, 78.6380, 'Tamil Nadu'],
  ['Vellore', 12.9165, 79.1325, 'Tamil Nadu'],
  ['Salem', 11.6643, 78.1460, 'Tamil Nadu'],
  ['Hosur', 12.7409, 77.8253, 'Tamil Nadu'],
  ['Anekal', 12.7110, 77.6960, 'Karnataka'],
  ['Attibele', 12.7830, 77.7710, 'Karnataka'],
  ['Ramanagara', 12.7217, 77.2807, 'Karnataka'],
  ['Tumkur', 13.3379, 77.1173, 'Karnataka'],
  ['Kolar', 13.1362, 78.1290, 'Karnataka'],
  ['Chikballapur', 13.4353, 77.7315, 'Karnataka'],
];

function toEntry([name, lat, lng, suffix]) {
  return {
    name,
    lat,
    lng,
    suffix: suffix || BLR,
    address: `${name}, ${suffix || BLR}`,
  };
}

export const LOCAL_AREAS = [...RAW_AREAS.map(toEntry), ...RAW_DESTINATIONS.map(toEntry)];

// Normalise for comparison: lowercase, drop everything but letters/digits.
function norm(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Classic Levenshtein edit distance (small strings, so plain DP is fine).
function editDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

// Rank a single area against the normalised query. Lower score = better match.
// Returns null when it shouldn't be shown at all.
function scoreArea(entry, q) {
  const name = norm(entry.name);
  if (!name) return null;

  // Also compare against each word so "tech park" hits "Manyata Tech Park".
  const words = entry.name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(norm);

  if (name === q) return 0; // exact
  if (name.startsWith(q)) return 1; // prefix of full name
  if (words.some((w) => w.startsWith(q))) return 2; // prefix of any word
  if (name.includes(q)) return 3; // substring anywhere

  // Fuzzy: allow 1 edit for short queries, 2 for longer ones.
  const maxEdits = q.length <= 4 ? 1 : 2;

  // Whole-name fuzzy (handles "koramangla" -> "koramangala").
  const whole = editDistance(q, name);
  if (whole <= maxEdits) return 4 + whole;

  // Per-word fuzzy against a same-length prefix of the word, so a typo in the
  // first token still matches ("indranagar" -> "indiranagar").
  let best = Infinity;
  for (const w of words) {
    if (!w) continue;
    const slice = w.slice(0, q.length + maxEdits);
    const d = editDistance(q, slice);
    if (d < best) best = d;
  }
  if (best <= maxEdits) return 6 + best;

  return null;
}

/**
 * Search curated areas for a (possibly misspelled) query.
 * @returns array of { name, lat, lng, address, suffix } best-first.
 */
export function searchLocalAreas(query, limit = 8) {
  const q = norm(query);
  if (q.length < 2) return [];

  const scored = [];
  for (const entry of LOCAL_AREAS) {
    const score = scoreArea(entry, q);
    if (score != null) scored.push({ entry, score });
  }

  scored.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    // Tie-break: shorter names first (usually the more canonical locality).
    return a.entry.name.length - b.entry.name.length;
  });

  return scored.slice(0, limit).map((s) => s.entry);
}
