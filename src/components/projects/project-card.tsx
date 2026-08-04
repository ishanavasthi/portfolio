"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/brand";
import type { Project } from "@/lib/projects";
import { sortTags } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease } },
};

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex size-8 items-center justify-center rounded-[4px] text-muted-foreground transition-colors duration-[180ms] ease-out hover:text-accent"
    >
      {children}
    </Link>
  );
}

export function ProjectCard({
  project,
  variant = "cascade",
  index,
  id,
  onTagClick,
  activeTags,
}: {
  project: Project;
  /** `featured` always shows the long description; `cascade` respects weight. */
  variant?: "featured" | "cascade";
  /** Mono 3-digit ledger index shown above the project name. */
  index?: number;
  /** Scroll anchor. The cascade puts this on its own wrapper instead. */
  id?: string;
  onTagClick?: (tag: string) => void;
  activeTags?: readonly string[];
}) {
  const showDescription = variant === "featured" || project.weight === 2;

  return (
    // No `layout` prop here on purpose: cards remount when the cascade
    // re-keys, so there is no stable element for layout projection to animate
    // between. Re-cascades are animated by replaying the stagger instead.
    <motion.div
      id={id}
      variants={cardVariants}
      className={cn("group", id && "scroll-mt-24")}
    >
      <div
        className={cn(
          "relative flex h-full flex-col gap-4 rounded-[6px] border border-border bg-[--surface] px-5 py-5 transition-colors duration-[180ms] ease-out",
          "hover:border-accent/60 hover:bg-white/[0.015]",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            {index !== undefined ? (
              <span className="font-mono text-[11px] text-muted-foreground">
                {String(index).padStart(3, "0")}
              </span>
            ) : null}
            <span className="truncate text-base font-semibold tracking-[-0.01em] text-foreground transition-colors duration-[180ms] ease-out group-hover:text-accent">
              {project.name}
            </span>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {project.year}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            {project.github ? (
              <IconLink href={project.github} label={`${project.name} on GitHub`}>
                <GithubIcon className="size-4" />
              </IconLink>
            ) : null}
            {project.live ? (
              <IconLink href={project.live} label={`${project.name} live site`}>
                <ArrowUpRight className="size-4" aria-hidden />
              </IconLink>
            ) : null}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">
          {project.headline}
        </p>
        {showDescription ? (
          <p className="text-sm leading-relaxed text-[var(--text-dim)]">
            {project.description}
          </p>
        ) : null}

        <ul className="flex flex-wrap gap-1.5">
          {sortTags(project.tags).map((t) => {
            const active = activeTags?.includes(t);
            const chipClass = cn(
              "rounded-[4px] border border-border px-[10px] py-1 font-mono text-[11px] text-[var(--text-dim)] transition-colors duration-[180ms] ease-out",
              active && "border-[rgba(110,231,183,0.35)] text-accent",
            );
            return (
              <li key={t}>
                {onTagClick ? (
                  <button
                    type="button"
                    onClick={() => onTagClick(t)}
                    aria-pressed={active}
                    className={cn(
                      chipClass,
                      "cursor-pointer hover:border-accent hover:text-accent",
                    )}
                  >
                    {t}
                  </button>
                ) : (
                  <span className={chipClass}>{t}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
