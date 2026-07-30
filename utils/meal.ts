import { MEAL_SECTION_KEYS, type DietDay, type DietDayRow, type MealEntry } from "@/types/meal";

/**
 * Splits a raw sheet cell like "Vegetable Upma (1 medium bowl)" into a
 * hero food name and an optional portion. Falls back gracefully when the
 * cell has no parenthetical portion, or is oddly formatted.
 */
export function parseMealEntryValue(raw: string): { name: string; portion?: string } {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  if (match && match[1] && match[1].trim().length > 0) {
    return { name: match[1].trim(), portion: match[2]?.trim() };
  }
  return { name: trimmed };
}

/**
 * Converts a raw sheet row into a display-ready DietDay, skipping any
 * meal section whose cell is empty, missing, or whitespace-only.
 */
export function toDietDay(row: DietDayRow): DietDay {
  const meals: MealEntry[] = [];

  for (const section of MEAL_SECTION_KEYS) {
    const cell = row[section];
    if (typeof cell !== "string") continue;
    const raw = cell.trim();
    if (raw.length === 0) continue;

    const { name, portion } = parseMealEntryValue(raw);
    meals.push({ section, name, portion, raw });
  }

  return { day: row.Day, meals };
}

/** Finds the row matching a given day number, defaulting to the first row. */
export function findRowByDayNumber(rows: DietDayRow[], dayNumber: number): DietDayRow | undefined {
  return rows.find((row) => row.Day === dayNumber) ?? rows[0];
}
