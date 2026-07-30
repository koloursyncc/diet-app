"use client";

import { CloudOff, Leaf, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  variant: "error" | "no-meals" | "not-configured";
  message?: string;
  onRetry?: () => void;
}

const COPY: Record<EmptyStateProps["variant"], { title: string; body: string; Icon: typeof Leaf }> = {
  error: {
    title: "Couldn't load today's plan",
    body: "Daily Diet couldn't reach your Google Sheet. Check your connection and try again.",
    Icon: CloudOff,
  },
  "no-meals": {
    title: "Nothing planned for this day",
    body: "This day doesn't have any meals filled in yet. Try another date, or add entries to your sheet.",
    Icon: Leaf,
  },
  "not-configured": {
    title: "Connect your meal plan",
    body: "Add your Google Apps Script URL in Settings to start seeing your daily meals.",
    Icon: Leaf,
  },
};

export function EmptyState({ variant, message, onRetry }: EmptyStateProps) {
  const { title, body, Icon } = COPY[variant];

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center rounded-3xl border border-border bg-card px-8 py-14 text-center shadow-card"
      role="status"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="font-display text-2xl font-medium text-ink">{title}</h2>
      <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-muted-foreground">
        {message ?? body}
      </p>
      {onRetry && (
        <Button variant="subtle" size="sm" onClick={onRetry} className="mt-6">
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
