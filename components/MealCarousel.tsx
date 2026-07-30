"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { MealCard } from "@/components/MealCard";
import { useHaptics } from "@/hooks/useHaptics";
import type { MealEntry } from "@/types/meal";

interface MealCarouselProps {
  meals: MealEntry[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const SWIPE_OFFSET_THRESHOLD = 90;
const SWIPE_VELOCITY_THRESHOLD = 480;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
  }),
};

function DraggableCard({
  meal,
  direction,
  onSwipe,
}: {
  meal: MealEntry;
  direction: number;
  onSwipe: (dir: 1 | -1) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-6, 0, 6]);
  const dragScale = useTransform(x, [-220, 0, 220], [0.97, 1, 0.97]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info;
      if (offset.x < -SWIPE_OFFSET_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
        onSwipe(1);
      } else if (offset.x > SWIPE_OFFSET_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
        onSwipe(-1);
      }
    },
    [onSwipe],
  );

  return (
    <motion.div
      key={meal.section}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 340, damping: 32 },
        opacity: { duration: 0.2 },
        scale: { type: "spring", stiffness: 340, damping: 32 },
      }}
      style={{ x, rotate, scale: dragScale }}
      drag="x"
      dragElastic={0.65}
      dragConstraints={{ left: 0, right: 0 }}
      dragTransition={{ bounceStiffness: 420, bounceDamping: 28 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 touch-pan-y"
    >
      <MealCard meal={meal} />
    </motion.div>
  );
}

export function MealCarousel({ meals, activeIndex, onIndexChange }: MealCarouselProps) {
  const directionRef = useRef(1);
  const { tap } = useHaptics();

  const goTo = useCallback(
    (nextIndex: number, direction: 1 | -1) => {
      if (nextIndex < 0 || nextIndex >= meals.length) return;
      directionRef.current = direction;
      tap(6);
      onIndexChange(nextIndex);
    },
    [meals.length, onIndexChange, tap],
  );

  const handleSwipe = useCallback(
    (direction: 1 | -1) => {
      goTo(activeIndex + direction, direction);
    },
    [activeIndex, goTo],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goTo(activeIndex - 1, -1);
      } else if (e.key === "ArrowRight") {
        goTo(activeIndex + 1, 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goTo]);

  const activeMeal = meals[activeIndex];
  if (!activeMeal) return null;

  return (
    <div className="relative h-full w-full">
      <AnimatePresence initial={false} custom={directionRef.current} mode="popLayout">
        <DraggableCard
          key={activeMeal.section}
          meal={activeMeal}
          direction={directionRef.current}
          onSwipe={handleSwipe}
        />
      </AnimatePresence>

      {/* Invisible accessibility controls for keyboard / screen reader users */}
      <button
        type="button"
        onClick={() => goTo(activeIndex - 1, -1)}
        disabled={activeIndex === 0}
        aria-label="Previous meal"
        className="absolute inset-y-0 left-0 w-10 opacity-0"
      />
      <button
        type="button"
        onClick={() => goTo(activeIndex + 1, 1)}
        disabled={activeIndex === meals.length - 1}
        aria-label="Next meal"
        className="absolute inset-y-0 right-0 w-10 opacity-0"
      />
    </div>
  );
}
