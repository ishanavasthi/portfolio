"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { EASE_SIGNATURE, VIEWPORT_ONCE } from "@/lib/motion/variants";

import { useSkipEntrance } from "./use-skip-entrance";

/**
 * Rolls a stat from zero to its real value the first time it scrolls into
 * view. The motion value is born at the final number, so server HTML, the
 * hydration pass, and any reduced-motion or no-JS reader all show the true
 * stat; only when the reveal actually fires does the animation restart the
 * display from zero via explicit keyframes.
 */
export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const skipEntrance = useSkipEntrance();
  const inView = useInView(ref, VIEWPORT_ONCE);

  const count = useMotionValue(value);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (skipEntrance) {
      count.set(value);
      return;
    }
    if (!inView) return;
    const controls = animate(count, [0, value], {
      duration: 0.8,
      ease: EASE_SIGNATURE,
    });
    return () => controls.stop();
  }, [inView, skipEntrance, value, count]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
