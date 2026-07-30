"use client";

import { useCallback, useState } from "react";
import { isSameDay } from "@/utils/date";

export function useSelectedDate() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const isToday = isSameDay(selectedDate, new Date());

  return { selectedDate, selectDate, goToToday, isToday };
}
