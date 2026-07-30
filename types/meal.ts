/**
 * The exact set of meal section keys as they appear as column headers
 * in the Google Sheet / Apps Script JSON response. Order here defines
 * the display order throughout the app.
 */
export const MEAL_SECTION_KEYS = [
  "Wake Up",
  "Early Morning",
  "Breakfast",
  "Mid-Morning Snack",
  "Lunch",
  "Evening Snack",
  "Dinner",
  "Bedtime",
] as const;

export type MealSectionKey = (typeof MEAL_SECTION_KEYS)[number];

/**
 * A single row of the sheet, exactly as returned by the Apps Script
 * endpoint. `Day` is required; every meal section is optional since
 * cells may be left blank for a given day.
 */
export type DietDayRow = {
  Day: number;
} & Partial<Record<MealSectionKey, string>>;

/** A parsed, display-ready meal entry for a single section on a single day. */
export interface MealEntry {
  section: MealSectionKey;
  /** The hero food name, e.g. "Vegetable Upma" */
  name: string;
  /** The portion / quantity, e.g. "1 Medium Bowl" (optional) */
  portion?: string;
  /** Raw, unparsed original cell value */
  raw: string;
}

/** A fully resolved day: the raw row plus its non-empty, parsed meals. */
export interface DietDay {
  day: number;
  meals: MealEntry[];
}

export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  apiUrl: string;
  accentColor: string;
  theme: ThemeMode;
}
