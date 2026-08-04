import type { Variants } from "framer-motion";

/**
 * The site-wide signature easing curve. Every scheduled animation (entrance,
 * scroll reveal, page transition) uses this so the whole page decelerates the
 * same way — previously this array was copy-pasted in ten files.
 */
export const EASE_SIGNATURE = [0.22, 1, 0.36, 1] as const;

/**
 * Spring for input-responsive motion only (tilt, magnetic pull). Scheduled
 * animations use EASE_SIGNATURE instead; springs are reserved for things
 * that track the cursor and need to settle fast with barely any overshoot.
 */
export const springSettle = { stiffness: 260, damping: 30, mass: 1 } as const;

/**
 * Shared whileInView viewport: fire once, slightly before the element is
 * fully on screen, so reveals feel anticipatory rather than late.
 */
export const VIEWPORT_ONCE = { once: true, margin: "-15% 0px" } as const;

/**
 * The section-level stagger pair used across the homepage. State names
 * "hidden"/"show" are load-bearing — child variants (including
 * ProjectCard's cardVariants) propagate them by name.
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SIGNATURE },
  },
};
