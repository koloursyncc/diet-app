"use client";

import { motion } from "framer-motion";
import { MEAL_MESSAGES } from "@/constants/mealMessages";
import type { MealEntry } from "@/types/meal";

interface MealCardProps {
  meal: MealEntry;
}

const contentVariants = {
  initial: { opacity: 0, y: 14 },
  animate: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function MealCard({ meal }: MealCardProps) {
  const message = MEAL_MESSAGES[meal.section];

  return (
    <div
      className="flex h-full w-full select-none flex-col justify-center rounded-3xl border border-border bg-card px-8 py-14 shadow-card"
      role="group"
      aria-roledescription="slide"
      aria-label={`${meal.section}: ${meal.name}`}
    >
      <motion.p
        key={`${meal.section}-eyebrow`}
        custom={0}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        className="mb-5 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        {meal.section}
      </motion.p>

      <motion.h1
        key={`${meal.section}-name`}
        custom={0.06}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        className="font-display text-[2.6rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl"
      >
        {meal.name}
      </motion.h1>

      {meal.portion && (
        <motion.p
          key={`${meal.section}-portion`}
          custom={0.14}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          className="mt-3 text-lg text-muted-foreground"
        >
          {meal.portion}
        </motion.p>
      )}

      <motion.p
        key={`${meal.section}-message`}
        custom={0.22}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        className="mt-8 max-w-[26ch] text-[15px] leading-relaxed text-muted-foreground"
      >
        {message}
      </motion.p>
    </div>
  );
}
