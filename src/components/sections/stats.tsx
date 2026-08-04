"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { projects, projectsByDomain } from "@/lib/projects";
import { DOMAINS } from "@/lib/taxonomy";
import {
  fadeUpItem,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const stats = [
  { value: `${projects.length}`, label: "projects shipped" },
  { value: `${DOMAINS.length}`, label: "domains" },
  { value: `${projectsByDomain("agents").length}`, label: "agent systems" },
  {
    value: `${Math.min(...projects.map((p) => p.year))}—`,
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
  return (
    <motion.div
      variants={staggerContainer}
      initial={skipEntrance ? "show" : "hidden"}
      whileInView={skipEntrance ? undefined : "show"}
      animate={skipEntrance ? "show" : undefined}
      viewport={VIEWPORT_ONCE}
      className="mx-auto grid max-w-[1080px] grid-cols-2 border-b border-border px-6 md:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={fadeUpItem}
          className={cn("border-border px-6 py-7", cellBorders[i])}
        >
          <b className="block font-mono text-[28px] font-medium tracking-[-0.02em] text-foreground">
            {stat.value}
          </b>
          <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
