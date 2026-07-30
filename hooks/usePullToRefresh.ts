"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRIGGER_DISTANCE = 72;
const MAX_PULL = 120;

interface Options {
  onRefresh: () => Promise<void> | void;
  disabled?: boolean;
}

/**
 * Enables pull-to-refresh when the given container is scrolled to the
 * top and the user drags down past a threshold. Returns the live pull
 * distance (for rendering an indicator) and whether a refresh is running.
 */
export function usePullToRefresh<T extends HTMLElement>({ onRefresh, disabled }: Options) {
  const containerRef = useRef<T | null>(null);
  const startY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || isRefreshing) return;
      const el = containerRef.current;
      if (!el || el.scrollTop > 0) {
        startY.current = null;
        return;
      }
      startY.current = e.touches[0]?.clientY ?? null;
    },
    [disabled, isRefreshing],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (startY.current === null || disabled || isRefreshing) return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const delta = currentY - startY.current;
      if (delta > 0) {
        setPullDistance(Math.min(delta * 0.5, MAX_PULL));
      }
    },
    [disabled, isRefreshing],
  );

  const handleTouchEnd = useCallback(async () => {
    if (startY.current === null) return;
    startY.current = null;

    if (pullDistance >= TRIGGER_DISTANCE) {
      setIsRefreshing(true);
      setPullDistance(TRIGGER_DISTANCE * 0.6);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { containerRef, pullDistance, isRefreshing, triggerDistance: TRIGGER_DISTANCE };
}
