"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { springSettle } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

import { useSkipEntrance } from "./use-skip-entrance";

/**
 * A wrapper that pulls its child a few pixels toward the cursor, reserved for
 * the single hero call to action. It wraps rather than clones so the anchor
 * inside keeps its own href, hover styles and focus outline — the magnetism is
 * purely a transform on the span around it, which also means keyboard users
 * see an unmoved, normally focusable link.
 *
 * The offset is deliberately small and clamped: enough to suggest the button
 * is reaching back, not enough to make the click target feel like it is
 * dodging. When entrance animation is skipped no pointer handlers are
 * attached, so the span never moves — the element itself stays the same in
 * both modes because useSkipEntrance resolves differently on the server and
 * the client, and swapping the tree would break hydration.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.25,
  maxOffset = 8,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  maxOffset?: number;
}) {
  const skipEntrance = useSkipEntrance();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springSettle);
  const y = useSpring(rawY, springSettle);

  function handlePointerMove(event: ReactPointerEvent<HTMLSpanElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    rawX.set(clamp(offsetX * strength, maxOffset));
    rawY.set(clamp(offsetY * strength, maxOffset));
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.span
      onPointerMove={skipEntrance ? undefined : handlePointerMove}
      onPointerLeave={skipEntrance ? undefined : handlePointerLeave}
      style={{ x, y }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}

function clamp(value: number, limit: number) {
  return Math.min(Math.max(value, -limit), limit);
}
