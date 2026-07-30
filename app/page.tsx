"use client";

import { useMemo } from "react";
import { TopBar } from "@/components/TopBar";
import { ProgressDots } from "@/components/ProgressDots";
import { MealCarousel } from "@/components/MealCarousel";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { useSettings } from "@/providers/SettingsProvider";
import { useMealPlan } from "@/hooks/useMealPlan";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import { useLastViewedMeal } from "@/hooks/useLastViewedMeal";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { getDateKey, getDayNumberForDate } from "@/utils/date";
import { findRowByDayNumber, toDietDay } from "@/utils/meal";

export default function DailyDietPage() {
  const { settings, isHydrated: settingsHydrated } = useSettings();
  const { selectedDate, selectDate } = useSelectedDate();
  const { rows, isLoading, isValidating, error, isOffline, updatedAt, refresh } = useMealPlan(
    settingsHydrated ? settings.apiUrl : "",
  );

  const dietDay = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    const dayNumber = getDayNumberForDate(selectedDate, rows.length);
    const row = findRowByDayNumber(rows, dayNumber);
    if (!row) return null;
    return toDietDay(row);
  }, [rows, selectedDate]);

  const dateKey = getDateKey(selectedDate);
  const meals = dietDay?.meals ?? [];
  const { index: activeIndex, setIndex, isHydrated: lastViewedHydrated } = useLastViewedMeal(
    dateKey,
    meals.length,
  );

  const { containerRef, pullDistance, isRefreshing, triggerDistance } = usePullToRefresh<HTMLDivElement>({
    onRefresh: refresh,
    disabled: isLoading,
  });

  const showInitialLoading = isLoading && !rows;
  const showConfigureState = settingsHydrated && !settings.apiUrl;
  const showError = !showInitialLoading && !showConfigureState && !!error && (!rows || rows.length === 0);
  const showNoMeals = !showInitialLoading && !showError && dietDay && meals.length === 0;
  const showCarousel = !showInitialLoading && !showError && !showConfigureState && meals.length > 0;

  return (
    <div
      ref={containerRef}
      className="relative flex h-dvh w-full flex-col overflow-y-auto bg-paper"
    >
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        triggerDistance={triggerDistance}
        isRefreshing={isRefreshing}
      />

      <TopBar
        selectedDate={selectedDate}
        onSelectDate={selectDate}
        updatedAt={updatedAt}
        isOffline={isOffline}
        isValidating={isValidating && !isLoading}
      />

      <main className="flex flex-1 flex-col gap-5 px-4 pb-6">
        <div className="flex min-h-0 flex-1 items-stretch">
          <div className="relative w-full">
            {showInitialLoading && <LoadingSkeleton />}
            {showConfigureState && <EmptyState variant="not-configured" />}
            {showError && (
              <EmptyState variant="error" message={error?.message} onRetry={refresh} />
            )}
            {showNoMeals && <EmptyState variant="no-meals" />}
            {showCarousel && lastViewedHydrated && (
              <MealCarousel meals={meals} activeIndex={activeIndex} onIndexChange={setIndex} />
            )}
          </div>
        </div>

        {showCarousel && lastViewedHydrated && (
          <ProgressDots meals={meals} activeIndex={activeIndex} onSelect={setIndex} />
        )}
      </main>
    </div>
  );
}
