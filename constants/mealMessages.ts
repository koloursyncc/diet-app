import type { MealSectionKey } from "@/types/meal";

/**
 * Predefined, hand-written companion messages shown beneath the portion
 * on each meal card. These are intentionally static (never AI-generated)
 * so the tone stays consistent and predictable for the user.
 */
export const MEAL_MESSAGES: Record<MealSectionKey, string> = {
  "Wake Up": "Start your day with hydration.",
  "Early Morning": "A small bite to gently wake up digestion.",
  Breakfast: "A nourishing breakfast helps maintain steady energy.",
  "Mid-Morning Snack": "A light bridge to keep you steady until lunch.",
  Lunch: "A balanced lunch keeps you satisfied through the afternoon.",
  "Evening Snack": "A mindful snack to ease into the evening.",
  Dinner: "Keep dinner light for better overnight recovery.",
  Bedtime: "Wind down and let your body rest.",
};

/** Short, distinct label shown for each section (used in progress dots' aria-labels). */
export const MEAL_SECTION_SHORT_LABEL: Record<MealSectionKey, string> = {
  "Wake Up": "Wake Up",
  "Early Morning": "Early Morning",
  Breakfast: "Breakfast",
  "Mid-Morning Snack": "Mid-Morning",
  Lunch: "Lunch",
  "Evening Snack": "Evening Snack",
  Dinner: "Dinner",
  Bedtime: "Bedtime",
};
