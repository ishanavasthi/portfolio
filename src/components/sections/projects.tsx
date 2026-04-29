"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/icons/brand";
import { projects, type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
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
      className="text-muted-foreground hover:text-[--accent] inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={item} className="group">
      <Card
        className={cn(
          "relative h-full gap-4 border-[--border] bg-[--surface] py-5 shadow-none transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-[--accent]/60",
          "hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_25%,transparent),0_8px_32px_-12px_color-mix(in_oklab,var(--accent)_18%,transparent)]",
        )}
      >
        <CardHeader className="flex-row items-start justify-between gap-4">
          <CardTitle className="text-foreground group-hover:text-[--accent] text-base font-semibold tracking-[-0.01em] transition-colors">
            {project.name}
          </CardTitle>
          <div className="flex items-center gap-0.5">
            {project.github ? (
              <IconLink href={project.github} label={`${project.name} on GitHub`}>
                <GithubIcon className="h-4 w-4" />
              </IconLink>
            ) : null}
            {project.live ? (
              <IconLink href={project.live} label={`${project.name} live site`}>
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </IconLink>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.description}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <li key={t}>
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground rounded-md px-1.5 py-0 font-mono text-[10px] font-normal tracking-tight"
                >
                  {t}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="px-4 py-12 md:px-6 md:py-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="mx-auto max-w-3xl"
      >
        <motion.p
          variants={item}
          className="text-muted-foreground font-mono text-xs tracking-widest uppercase"
        >
          Projects
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
