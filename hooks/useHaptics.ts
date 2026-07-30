"use client";

import { useCallback } from "react";

/** Fires a very short vibration pulse on devices that support the Vibration API. */
export function useHaptics() {
  const tap = useCallback((pattern: number | number[] = 8) => {
    if (typeof window === "undefined") return;
    if (typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(pattern);
    }
  }, []);

  return { tap };
}
