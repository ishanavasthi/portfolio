"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

import { useSkipEntrance } from "./use-skip-entrance";

/**
 * Deliberately softer than springSettle: the spotlight should trail attention
 * like a light source, not track the cursor like a tooltip.
 */
const TRAIL = { stiffness: 110, damping: 30, mass: 1 } as const;

/**
 * A page-level radial glow that drifts after the cursor, so the dark page
 * reads as lit rather than flat while moving through it. Mounted once in the
 * root layout; it excuses itself on /projects, where TiltCard's per-card
 * spotlight is the one light source that page is allowed.
 *
 * The alpha is kept whisper-low — this is atmosphere, not an effect the eye
 * should ever land on. It renders nothing until the first fine-pointer move,
 * which also keeps it off touch devices, and reduced motion never activates
 * it: an absent glow is the correct static state for a cursor-only effect.
 */
export function CursorSpotlight() {
  const pathname = usePathname();
  const skipEntrance = useSkipEntrance();
  const [active, setActive] = useState(false);

  const rawX = useMotionValue(-800);
  const rawY = useMotionValue(-800);
  const x = useSpring(rawX, TRAIL);
  const y = useSpring(rawY, TRAIL);
  const background = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgba(110, 231, 183, 0.045), transparent 70%)`;

  useEffect(() => {
    if (skipEntrance) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const onPointerMove = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      setActive(true);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [skipEntrance, rawX, rawY]);

  if (pathname.startsWith("/projects")) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
      style={{ background }}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    />
  );
}
