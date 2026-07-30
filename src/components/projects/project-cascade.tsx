"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

const BREAKPOINTS = [
  { query: "(min-width: 1024px)", columns: 3 },
  { query: "(min-width: 768px)", columns: 2 },
] as const;

function subscribe(onChange: () => void) {
  const lists = BREAKPOINTS.map((b) => window.matchMedia(b.query));
  for (const list of lists) list.addEventListener("change", onChange);
  return () => {
    for (const list of lists) list.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  for (const b of BREAKPOINTS) {
    if (window.matchMedia(b.query).matches) return b.columns;
  }
  return 1;
}

/**
 * Column count has to be known in JS because the cards are distributed into
 * real column elements rather than a CSS multi-column flow — see the note on
 * ProjectCascade. useSyncExternalStore lets the client read matchMedia on its
 * very first render, so there is no hydration mismatch and no column flash.
 */
function useColumnCount() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => 3);
}

/**
 * Masonry cascade built from explicit flex columns.
 *
 * This deliberately does NOT use CSS `columns`. Chromium paints transformed or
 * composited content inside a multi-column container relative to the first
 * column fragment instead of its own, so the `hover:-translate-y-0.5` lift on
 * a card in column 2+ made it jump behind the first card and disappear.
 * Real column elements have no fragments, so transforms behave normally.
 *
 * Distribution is round-robin, which means reading across a row recovers the
 * original order — unlike CSS multicol, which fills column-major. The tradeoff
 * is that columns are balanced by count rather than by measured height.
 */
export function ProjectCascade({
  projects,
  cascadeKey,
  onTagClick,
  activeTags,
  className,
}: {
  projects: readonly Project[];
  /** Re-keying replays the stagger, which is how a re-cascade is animated. */
  cascadeKey: string;
  onTagClick?: (tag: string) => void;
  activeTags?: readonly string[];
  className?: string;
}) {
  const columnCount = useColumnCount();

  const columns = React.useMemo(() => {
    const buckets: Project[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    projects.forEach((p, i) => buckets[i % columnCount].push(p));
    return buckets;
  }, [projects, columnCount]);

  return (
    <motion.div
      key={cascadeKey}
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("flex items-start gap-4", className)}
    >
      {columns.map((column, i) => (
        <div
          key={i}
          className="flex min-w-0 flex-1 flex-col gap-4"
          // Empty trailing columns are still rendered so the remaining cards
          // keep their width instead of stretching to fill the row.
          aria-hidden={column.length === 0 ? true : undefined}
        >
          {column.map((p) => (
            <div key={p.slug} id={`project-${p.slug}`} className="scroll-mt-24">
              <ProjectCard
                project={p}
                onTagClick={onTagClick}
                activeTags={activeTags}
              />
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
