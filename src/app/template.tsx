"use client";

import { motion } from "framer-motion";
import { EASE_SIGNATURE } from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

/**
 * Wraps every route in a short fade-and-rise so navigation reads as a
 * transition rather than a hard swap.
 *
 * There is deliberately no state and no effect here. Next.js remounts a
 * template on every navigation, unlike a layout, and that remount is itself
 * the trigger: the new page mounts at opacity 0 and animates in. Adding
 * pathname tracking or an exit animation would only fight that behaviour.
 *
 * When entrance animation is skipped, initial is false so the page renders in
 * its final state on the first frame instead of playing a faster version.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const skipEntrance = useSkipEntrance();

  return (
    <motion.div
      initial={skipEntrance ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_SIGNATURE }}
    >
      {children}
    </motion.div>
  );
}
