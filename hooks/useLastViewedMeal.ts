"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "@/constants/app";

type StoredMap = Record<string, number>;

function readMap(): StoredMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.lastViewedMeal);
    return raw ? (JSON.parse(raw) as StoredMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: StoredMap) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.lastViewedMeal, JSON.stringify(map));
  } catch {
    // best-effort persistence only
  }
}

/**
 * Remembers which meal index the user was last viewing for a given
 * calendar-day key, e.g. reopening the app on the same day returns them
 * to Lunch instead of resetting to Wake Up.
 */
export function useLastViewedMeal(dateKey: string, mealCount: number) {
  const mapRef = useRef<StoredMap>({});
  const [index, setIndexState] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    mapRef.current = readMap();
    const stored = mapRef.current[dateKey];
    const safe = typeof stored === "number" && stored >= 0 && stored < mealCount ? stored : 0;
    setIndexState(safe);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const setIndex = useCallback(
    (next: number) => {
      setIndexState(next);
      mapRef.current = { ...mapRef.current, [dateKey]: next };
      writeMap(mapRef.current);
    },
    [dateKey],
  );

  return { index: Math.min(index, Math.max(mealCount - 1, 0)), setIndex, isHydrated };
}
