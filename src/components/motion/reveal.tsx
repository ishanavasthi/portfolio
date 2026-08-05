"use client";

import { motion, type Variants } from "framer-motion";
import { EASE_SIGNATURE, VIEWPORT_ONCE } from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const offsets = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
} as const;

/**
 * Wraps a section heading or standalone block so it drifts into place the
 * first time it scrolls into view. Use this for one-off elements; anything
 * that reveals as a set belongs in a StaggerGroup instead, so the children
 * share one timeline rather than each racing its own viewport trigger. The
 * direction names where the content travels to, not where it comes from, so
 * `up` starts slightly below its resting position and rises into it.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}) {
  const skipEntrance = useSkipEntrance();

  const variants: Variants = {
    hidden: { opacity: 0, ...offsets[direction] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: EASE_SIGNATURE, delay },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial={skipEntrance ? "show" : "hidden"}
      whileInView={skipEntrance ? undefined : "show"}
      animate={skipEntrance ? "show" : undefined}
      viewport={VIEWPORT_ONCE}
      className={className}
    >
      {children}
    </motion.div>
  );
}
