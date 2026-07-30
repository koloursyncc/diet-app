"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  triggerDistance: number;
  isRefreshing: boolean;
}

export function PullToRefreshIndicator({
  pullDistance,
  triggerDistance,
  isRefreshing,
}: PullToRefreshIndicatorProps) {
  if (pullDistance <= 0 && !isRefreshing) return null;

  const progress = Math.min(pullDistance / triggerDistance, 1);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2"
      style={{ opacity: progress }}
      aria-hidden={!isRefreshing}
    >
      <motion.div
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-soft"
        animate={{ rotate: isRefreshing ? 360 : progress * 180 }}
        transition={
          isRefreshing
            ? { repeat: Infinity, duration: 0.8, ease: "linear" }
            : { type: "spring", stiffness: 300, damping: 24 }
        }
      >
        <RefreshCcw className="h-4 w-4 text-muted-foreground" />
      </motion.div>
    </div>
  );
}
