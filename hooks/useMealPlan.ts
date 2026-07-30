"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { GoogleSheetService } from "@/services/GoogleSheetService";
import { STORAGE_KEYS } from "@/constants/app";
import type { DietDayRow } from "@/types/meal";

function readCachedPlan(): DietDayRow[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.cachedPlan);
    return raw ? (JSON.parse(raw) as DietDayRow[]) : null;
  } catch {
    return null;
  }
}

function writeCachedPlan(rows: DietDayRow[]) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.cachedPlan, JSON.stringify(rows));
    window.localStorage.setItem(STORAGE_KEYS.cachedPlanUpdatedAt, String(Date.now()));
  } catch {
    // Storage can fail (quota, private mode) — safe to ignore, it's a best-effort cache.
  }
}

export function readCachedPlanUpdatedAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.cachedPlanUpdatedAt);
  return raw ? Number(raw) : null;
}

interface UseMealPlanResult {
  rows: DietDayRow[] | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | undefined;
  isOffline: boolean;
  updatedAt: number | null;
  refresh: () => Promise<void>;
}

/**
 * Fetches and caches the diet plan for the given Apps Script URL.
 * SWR handles in-memory caching + background revalidation; a mirrored
 * copy lives in localStorage so the last known plan renders instantly
 * (and works fully offline) before/without any network round trip.
 */
export function useMealPlan(apiUrl: string): UseMealPlanResult {
  const [isOffline, setIsOffline] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    setUpdatedAt(readCachedPlanUpdatedAt());
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const { data, error, isLoading, isValidating, mutate } = useSWR<DietDayRow[]>(
    apiUrl ? ["meal-plan", apiUrl] : null,
    async ([, url]: [string, string]) => {
      const rows = await GoogleSheetService.fetchMealPlan(url);
      writeCachedPlan(rows);
      setUpdatedAt(Date.now());
      return rows;
    },
    {
      fallbackData: readCachedPlan() ?? undefined,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      dedupingInterval: 15_000,
      errorRetryCount: 3,
      keepPreviousData: true,
    },
  );

  return {
    rows: data,
    isLoading,
    isValidating,
    error: error instanceof Error ? error : undefined,
    isOffline,
    updatedAt,
    refresh: async () => {
      await mutate();
    },
  };
}
