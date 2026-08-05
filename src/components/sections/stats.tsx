"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { projects, projectsByDomain } from "@/lib/projects";
import { DOMAINS } from "@/lib/taxonomy";
import {
  fadeUpItem,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";
import { CountUp } from "@/components/motion/count-up";

const stats = [
  { value: projects.length, suffix: "", label: "projects shipped" },
  { value: DOMAINS.length, suffix: "", label: "domains" },
  {
    value: projectsByDomain("agents").length,
    suffix: "",
    label: "agent systems",
  },
  {
    value: Math.min(...projects.map((p) => p.year)),
    suffix: "—",
    label: "shipping since",
  },
] as const;

const cellBorders = [
  "border-r max-md:border-b",
  "border-r max-md:border-r-0 max-md:border-b",
  "border-r",
  "border-r-0",
];

export function Stats() {
  const skipEntrance = useSkipEntrance();
  const bandRef = useRef<HTMLDivElement>(null);
  const bandInView = useInView(bandRef, { amount: 0.35 });
  // The signal circuit only exists while the band is on screen — unmounting
  // the strips is the pause — and never under reduced motion / static capture,
  // where the plain bordered band is the final state. md+ only: the 2×2
  // mobile grid has a different divider topology.
  const showCircuit = bandInView && !skipEntrance;
  return (
    <motion.div
      ref={bandRef}
      variants={staggerContainer}
      initial={skipEntrance ? "show" : "hidden"}
      whileInView={skipEntrance ? undefined : "show"}
      animate={skipEntrance ? "show" : undefined}
      viewport={VIEWPORT_ONCE}
      className="relative mx-auto grid max-w-[1080px] grid-cols-2 border-b border-border px-6 md:grid-cols-4"
    >
      {showCircuit ? (
        <>
          {/* Signal circuit, one 8s timeline in three strips: enter on the
              top line, drop down the center divider, exit along the bottom
              line. Gradient peaks sit at 90% of each strip; the keyframes in
              globals.css park that peak on the divider at each handoff. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px hidden h-px overflow-hidden md:block"
          >
            <span className="block h-full w-full animate-[stats-circuit-top_8s_linear_infinite] bg-[linear-gradient(90deg,transparent_0%,transparent_78%,var(--agent-signal)_90%,transparent_100%)]" />
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-px hidden h-px overflow-hidden md:block"
          >
            <span className="block h-full w-full animate-[stats-circuit-bottom_8s_linear_infinite] bg-[linear-gradient(90deg,transparent_0%,transparent_78%,var(--agent-signal)_90%,transparent_100%)]" />
          </span>
        </>
      ) : null}
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={fadeUpItem}
          className={cn("relative border-border px-6 py-7", cellBorders[i])}
        >
          {/* The circuit's vertical leg rides this cell's right divider. */}
          {showCircuit && i === 1 ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -right-px hidden w-px overflow-hidden md:block"
            >
              <span className="block h-full w-full animate-[stats-circuit-down_8s_linear_infinite] bg-[linear-gradient(180deg,transparent_0%,transparent_78%,var(--agent-signal)_90%,transparent_100%)]" />
            </span>
          ) : null}
          <b className="block font-mono text-[28px] font-medium tracking-[-0.02em] text-foreground">
            <CountUp value={stat.value} />
            {stat.suffix}
          </b>
          <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
