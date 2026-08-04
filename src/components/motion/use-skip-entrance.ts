"use client";

import { useReducedMotion } from "framer-motion";

export const staticCapture = process.env.NEXT_PUBLIC_STATIC_CAPTURE === "1";

/**
 * True when entrance animation should be skipped and the final visible
 * state rendered immediately: static-capture screenshots, or a user with
 * `prefers-reduced-motion: reduce`.
 */
export function useSkipEntrance() {
  const reducedMotion = useReducedMotion();
  return staticCapture || reducedMotion;
}
