// homeData.js
// Impact counters & success stories — stored in localStorage for admin editability
// When backend is ready, replace localStorage calls with API calls

const COUNTERS_KEY = "impact_counters";

// Default counter values
const defaultCounters = [
  { id: 1, end: 50000, label: "Liters of Water Donated", icon: "💧" },
  { id: 2, end: 1200, label: "Trees Planted", icon: "🌳" },
  { id: 3, end: 800, label: "Students Supported", icon: "🎓" },
  { id: 4, end: 350, label: "Carriages Sent", icon: "🚚" },
];

/**
 * Get impact counters — reads from localStorage (or defaults)
 * Admin dashboard can update these values.
 */
export function getImpactCounters() {
  try {
    const stored = localStorage.getItem(COUNTERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fallback
  }
  return defaultCounters;
}

/**
 * Update a single counter value (admin use)
 */
export function updateCounter(id, newEnd) {
  const counters = getImpactCounters();
  const updated = counters.map((c) =>
    c.id === id ? { ...c, end: newEnd } : c
  );
  localStorage.setItem(COUNTERS_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Reset counters to defaults
 */
export function resetCounters() {
  localStorage.removeItem(COUNTERS_KEY);
  return defaultCounters;
}

// Legacy named export for backward compat
export const impactCounters = defaultCounters;

export const successStories = [
  {
    id: 1,
    title: "Clean Water for Villages",
    text: "Provided safe drinking water to over 500 families, improving health and quality of life.",
  },
  {
    id: 2,
    title: "Education for Children",
    text: "Supported underprivileged students with school supplies, scholarships, and mentorship programs.",
  },
  {
    id: 3,
    title: "Environmental Impact",
    text: "Planted thousands of trees and promoted sustainable environmental practices.",
  },
];
