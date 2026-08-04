"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { projects, projectsByDomain } from "@/lib/projects";
import { DOMAINS } from "@/lib/taxonomy";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

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
      variants={container}
      initial={skipEntrance ? "show" : "hidden"}
      whileInView={skipEntrance ? undefined : "show"}
      animate={skipEntrance ? "show" : undefined}
      viewport={{ once: true, margin: "-15% 0px" }}
      className="mx-auto grid max-w-[1080px] grid-cols-2 border-b border-border px-6 md:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          variants={item}
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
