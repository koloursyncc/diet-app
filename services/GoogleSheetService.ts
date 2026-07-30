import type { DietDayRow } from "@/types/meal";

export class MealPlanFetchError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "MealPlanFetchError";
  }
}

/**
 * The single source of truth for retrieving the diet plan. All reads of
 * the Google Sheet go through this service and, in turn, through the
 * app's own `/api/mealplan` proxy route (so the browser never needs the
 * Apps Script endpoint to send CORS headers, and so responses can be
 * cached at the edge).
 */
export class GoogleSheetService {
  static async fetchMealPlan(apiUrl: string, signal?: AbortSignal): Promise<DietDayRow[]> {
    if (!apiUrl || apiUrl.trim().length === 0) {
      throw new MealPlanFetchError("No Google Apps Script URL is configured yet.");
    }

    const proxyUrl = `/api/mealplan?url=${encodeURIComponent(apiUrl.trim())}`;
    const response = await fetch(proxyUrl, { signal, cache: "no-store" });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new MealPlanFetchError(
        body?.error ?? `The meal plan could not be loaded (status ${response.status}).`,
        response.status,
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new MealPlanFetchError("The meal plan endpoint returned an unexpected format.");
    }

    return data as DietDayRow[];
  }
}
