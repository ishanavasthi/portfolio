"use client";

import { motion, type Variants } from "framer-motion";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

/**
 * CSS multi-column cascade. Columns fill top-to-bottom, so reading order is
 * per-column rather than strictly left-to-right — acceptable for a gallery,
 * and it avoids the layout thrash of a JS masonry while staying SSR-safe.
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
  return (
    <motion.div
      key={cascadeKey}
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("columns-1 gap-4 md:columns-2 lg:columns-3", className)}
    >
      {projects.map((p) => (
        <div
          key={p.slug}
          id={`project-${p.slug}`}
          className="mb-4 break-inside-avoid scroll-mt-24"
        >
          <ProjectCard
            project={p}
            onTagClick={onTagClick}
            activeTags={activeTags}
          />
        </div>
      ))}
    </motion.div>
  );
}
