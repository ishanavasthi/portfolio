"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE_SIGNATURE } from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  p: motion.p,
  span: motion.span,
};

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_SIGNATURE },
  },
};

/**
 * Reveals a headline word by word, each word sliding up from behind its own
 * clipping mask. This is deliberately reserved for the hero h1 — it is the
 * loudest entrance on the site, and using it twice would turn a first
 * impression into a mannerism.
 *
 * By default the root sets no initial/animate of its own: it inherits
 * "hidden"/"show" from an ancestor variant container, so it occupies exactly
 * the stagger slot the plain heading used to, and the parent's reduced-motion
 * decision flows down for free. Pass standalone when there is no such
 * ancestor and the component must drive its own entrance.
 */
export function TextReveal({
  text,
  as = "h1",
  className,
  wordStagger = 0.045,
  standalone = false,
}: {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  wordStagger?: number;
  standalone?: boolean;
}) {
  const skipEntrance = useSkipEntrance();
  const Root = motionTags[as] as typeof motion.span;
  const words = text.split(" ").filter(Boolean);

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: wordStagger } },
  };

  const standaloneProps = standalone
    ? { initial: skipEntrance ? "show" : "hidden", animate: "show" }
    : {};

  return (
    <Root aria-label={text} variants={containerVariants} className={className} {...standaloneProps}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span
            aria-hidden
            className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
          >
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Root>
  );
}
