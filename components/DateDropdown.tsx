"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buildDateWindow, formatShortDate, getDateKey, isSameDay } from "@/utils/date";
import { cn } from "@/lib/utils";

interface DateDropdownProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function DateDropdown({ selectedDate, onSelectDate }: DateDropdownProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const dateWindow = useMemo(() => buildDateWindow(today, 14, 14), [today]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full py-1.5 pl-1 pr-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-muted"
          aria-label={`Selected date: ${formatShortDate(selectedDate)}. Open date picker.`}
        >
          {formatShortDate(selectedDate)}
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-80 w-56 overflow-y-auto no-scrollbar">
        <div className="flex flex-col">
          {dateWindow.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            return (
              <button
                key={getDateKey(date)}
                type="button"
                onClick={() => {
                  onSelectDate(date);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                  isSelected && "bg-accent/10 text-ink",
                )}
              >
                <span className={cn(isSelected && "font-medium")}>{formatShortDate(date)}</span>
                {isToday && (
                  <span className="text-[11px] uppercase tracking-wide text-accent">Today</span>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
