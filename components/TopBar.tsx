"use client";

import { DateDropdown } from "@/components/DateDropdown";
import { Settings } from "@/components/Settings";
import { UpdatedIndicator } from "@/components/UpdatedIndicator";
import { formatHumanDate } from "@/utils/date";

interface TopBarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  updatedAt: number | null;
  isOffline: boolean;
  isValidating: boolean;
}

export function TopBar({
  selectedDate,
  onSelectDate,
  updatedAt,
  isOffline,
  isValidating,
}: TopBarProps) {
  return (
    <header
      className="flex shrink-0 flex-col gap-0.5 px-3 pb-2"
      style={{ paddingTop: "calc(0.75rem + var(--safe-top))" }}
    >
      <div className="flex items-center justify-between">
        <DateDropdown selectedDate={selectedDate} onSelectDate={onSelectDate} />
        <Settings />
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] text-muted-foreground">{formatHumanDate(selectedDate)}</p>
        <UpdatedIndicator updatedAt={updatedAt} isOffline={isOffline} isValidating={isValidating} />
      </div>
    </header>
  );
}
