"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

interface UpdatedIndicatorProps {
  updatedAt: number | null;
  isOffline: boolean;
  isValidating: boolean;
}

function formatRelative(updatedAt: number, now: number): string {
  const diffMs = now - updatedAt;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Updated just now";
  if (diffMin === 1) return "Updated 1 min ago";
  if (diffMin < 60) return `Updated ${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr === 1) return "Updated 1 hr ago";
  if (diffHr < 24) return `Updated ${diffHr} hrs ago`;
  return "Updated a while ago";
}

export function UpdatedIndicator({ updatedAt, isOffline, isValidating }: UpdatedIndicatorProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (isOffline) {
    return (
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
        <WifiOff className="h-3.5 w-3.5" aria-hidden />
        Offline — showing saved plan
      </span>
    );
  }

  if (isValidating) {
    return <span className="text-[12px] font-medium text-muted-foreground">Refreshing…</span>;
  }

  if (!updatedAt) return null;

  return (
    <span className="text-[12px] font-medium text-muted-foreground">
      {formatRelative(updatedAt, now)}
    </span>
  );
}
