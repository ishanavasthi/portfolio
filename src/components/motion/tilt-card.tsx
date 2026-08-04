"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

import { springSettle } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

import { useSkipEntrance } from "./use-skip-entrance";

/**
 * The site's one signature moment: a card that tilts in 3D toward the cursor
 * and carries a faint mint spotlight under it. It exists so the projects grid
 * has a single piece of motion worth noticing — use it only there, and keep
 * everything else on the page restrained enough not to compete with it.
 *
 * The rotation runs through a spring so the card lags the pointer slightly and
 * settles like a physical object, while the spotlight reads the raw pointer
 * position so the light never trails the cursor it is supposed to be coming
 * from. Only transforms and opacity animate; the spotlight layer is
 * pointer-events-none so tag chips and icon links inside the card stay
 * clickable. When entrance animation is skipped no pointer handlers are
 * attached, so the card sits inert at its final state — the tree itself stays
 * identical to the animated one because useSkipEntrance resolves differently
 * on the server and the client, and a structural branch would break hydration.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 6,
  glow = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glow?: boolean;
}) {
  const skipEntrance = useSkipEntrance();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, springSettle);
  const rotateY = useSpring(rawRotateY, springSettle);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const rawGlowOpacity = useMotionValue(0);
  const glowOpacity = useSpring(rawGlowOpacity, springSettle);

  const glowBackground = useMotionTemplate`radial-gradient(320px circle at ${glowX}px ${glowY}px, rgba(110,231,183,0.08), transparent 70%)`;

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const px = localX / rect.width - 0.5;
    const py = localY / rect.height - 0.5;

    rawRotateX.set(-py * maxTilt * 2);
    rawRotateY.set(px * maxTilt * 2);

    glowX.set(localX);
    glowY.set(localY);
    rawGlowOpacity.set(1);
  }

  function handlePointerLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlowOpacity.set(0);
  }

  return (
    <motion.div
      onPointerMove={skipEntrance ? undefined : handlePointerMove}
      onPointerLeave={skipEntrance ? undefined : handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn("relative h-full [transform-style:preserve-3d]", className)}
    >
      {children}
      {glow ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[6px]"
          style={{ opacity: glowOpacity, background: glowBackground }}
        />
      ) : null}
    </motion.div>
  );
}
