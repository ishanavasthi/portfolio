"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      className="text-muted-foreground hover:text-[--accent] inline-flex size-8 items-center justify-center rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}

export function ProjectCard({
  project,
  variant = "cascade",
  onTagClick,
  activeTags,
}: {
  project: Project;
  /** `featured` always shows the long description; `cascade` respects weight. */
  variant?: "featured" | "cascade";
  onTagClick?: (tag: string) => void;
  activeTags?: readonly string[];
}) {
  const showDescription = variant === "featured" || project.weight === 2;

  return (
    // No `layout` prop here on purpose: transform-based layout projection
    // fights the CSS multi-column flow of the cascade. Re-cascades are
    // animated by re-keying the container instead.
    <motion.div variants={cardVariants} className="group">
      <Card
        className={cn(
          "relative h-full gap-4 border-[--border] bg-[--surface] py-5 shadow-none transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-[--accent]/60",
          "hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_25%,transparent),0_8px_32px_-12px_color-mix(in_oklab,var(--accent)_18%,transparent)]",
        )}
      >
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle className="text-foreground group-hover:text-[--accent] text-base font-semibold tracking-[-0.01em] transition-colors">
              {project.name}
            </CardTitle>
            <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
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
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-foreground/90 text-sm leading-relaxed">
            {project.headline}
          </p>
          {showDescription ? (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.description}
            </p>
          ) : null}

          <ul className="flex flex-wrap gap-1.5">
            {sortTags(project.tags).map((t) => {
              const active = activeTags?.includes(t);
              return (
                <li key={t}>
                  {onTagClick ? (
                    <button
                      type="button"
                      onClick={() => onTagClick(t)}
                      aria-pressed={active}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-border text-muted-foreground hover:border-[--accent]/60 hover:text-[--accent] rounded-md px-1.5 py-0 font-mono text-[10px] font-normal tracking-tight transition-colors",
                          active &&
                            "border-[--accent]/60 text-[--accent] bg-[--accent]/10",
                        )}
                      >
                        {t}
                      </Badge>
                    </button>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground rounded-md px-1.5 py-0 font-mono text-[10px] font-normal tracking-tight"
                    >
                      {t}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
