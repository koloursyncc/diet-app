export const DEFAULT_API_URL =
  "https://script.google.com/macros/s/AKfycbwRR4i51s8I2L3q63SMbvGh7cGeKG2PoiDFWQkCU_Jx_hzZNaOXC3KgJleF7QitH8Zi/exec";

export const DEFAULT_ACCENT_COLOR = "#6B7F5E";

export const ACCENT_PRESETS: { label: string; value: string }[] = [
  { label: "Sage", value: "#6B7F5E" },
  { label: "Clay", value: "#A6603A" },
  { label: "Ocean", value: "#3E6D8E" },
  { label: "Plum", value: "#6B4E71" },
  { label: "Mustard", value: "#9C7A26" },
  { label: "Rose", value: "#9C5B5B" },
];

export const STORAGE_KEYS = {
  settings: "daily-diet:settings",
  lastViewedMeal: "daily-diet:last-viewed",
  cachedPlan: "daily-diet:cached-plan",
  cachedPlanUpdatedAt: "daily-diet:cached-plan-updated-at",
} as const;
