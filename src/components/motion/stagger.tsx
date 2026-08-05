"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUpItem, VIEWPORT_ONCE } from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

/**
 * Drives a set of StaggerItem children off one shared timeline so a list,
 * grid, or card cascade resolves in sequence instead of each element firing
 * on its own viewport trigger. Prefer the default `inView` mode, which holds
 * the group hidden until it scrolls into view. Reach for `mount` when the
 * group is already on screen and the cascade must replay on demand — the
 * project grid remounts itself with a new key when its filter changes, and
 * only a mount-time animation restarts under that pattern.
 */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0.05,
  mode = "inView",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  mode?: "inView" | "mount";
}) {
  const skipEntrance = useSkipEntrance();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };

  if (mode === "mount") {
    return (
      <motion.div
        variants={container}
        initial={skipEntrance ? "show" : "hidden"}
        animate="show"
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
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

/**
 * One element in a StaggerGroup's sequence. It deliberately declares no
 * initial or animate state of its own: the group owns the timeline and
 * propagates "hidden"/"show" down by name, which is what lets the item sit
 * behind plain layout wrappers — the cascade's column divs, for instance —
 * and still receive its cue. Giving it its own initial state would detach it
 * from that propagation and break the stagger.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUpItem} className={className}>
      {children}
    </motion.div>
  );
}
