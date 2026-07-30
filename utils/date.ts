const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Maps a calendar date to a 1-based diet-plan day number, looping through
 * the available rows once the day-of-month exceeds the row count.
 *
 * Examples (totalDays = 30):
 *  26 July  -> 26
 *  31 July  -> 1   ((31-1) % 30) + 1
 *  1 August -> 1
 *  2 August -> 2
 */
export function getDayNumberForDate(date: Date, totalDays: number): number {
  if (totalDays <= 0) return 1;
  const dayOfMonth = date.getDate();
  return ((dayOfMonth - 1) % totalDays) + 1;
}

/** Stable calendar-day key, e.g. "2026-07-26", used for per-day local persistence. */
export function getDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "26 July" */
export function formatShortDate(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

/** "Saturday, 26 July" */
export function formatHumanDate(date: Date): string {
  return `${WEEKDAY_NAMES[date.getDay()]}, ${formatShortDate(date)}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return getDateKey(a) === getDateKey(b);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Builds a window of dates centered on `center`, e.g. -7..+7 days. */
export function buildDateWindow(center: Date, before: number, after: number): Date[] {
  const dates: Date[] = [];
  for (let i = -before; i <= after; i++) {
    dates.push(addDays(center, i));
  }
  return dates;
}
