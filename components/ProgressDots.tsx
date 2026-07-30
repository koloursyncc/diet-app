"use client";

import { motion } from "framer-motion";
import type { MealEntry } from "@/types/meal";

interface ProgressDotsProps {
  meals: MealEntry[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ProgressDots({ meals, activeIndex, onSelect }: ProgressDotsProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="tablist"
      aria-label="Meal progress"
    >
      {meals.map((meal, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={meal.section}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`${meal.section}${isActive ? ", current" : ""}`}
            onClick={() => onSelect(index)}
            className="flex h-6 w-6 items-center justify-center"
          >
            <motion.span
              className="block rounded-full"
              animate={{
                width: isActive ? 20 : 6,
                height: 6,
                backgroundColor: isActive
                  ? "hsl(var(--accent))"
                  : "hsl(var(--border))",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          </button>
        );
      })}
    </div>
  );
}
