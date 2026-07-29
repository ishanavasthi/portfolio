"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { featuredProjects, projects } from "@/lib/projects";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Home-page highlight reel. The full, filterable archive lives at /projects.
 */
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
          {featuredProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} variant="featured" />
          ))}
        </div>

        <motion.div variants={item} className="mt-8">
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-[--accent] group inline-flex items-center gap-1.5 font-mono text-xs transition-colors"
          >
            View all {projects.length} projects
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
