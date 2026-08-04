"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHead } from "@/components/layout/section-head";
import { ProjectLedgerRow } from "@/components/projects/project-ledger-row";
import { featuredProjects, projects } from "@/lib/projects";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/**
 * Home-page highlight reel. The full, filterable archive lives at /projects.
 */
export function Projects() {
  const skipEntrance = useSkipEntrance();
  return (
    <section id="projects" className="border-b border-border py-[88px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <SectionHead index="03" title="Selected projects" />

        <motion.div
          variants={container}
          initial={skipEntrance ? "show" : "hidden"}
          whileInView={skipEntrance ? undefined : "show"}
          animate={skipEntrance ? "show" : undefined}
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          {featuredProjects.map((p, i) => (
            <motion.div key={p.slug} variants={item}>
              <ProjectLedgerRow
                project={p}
                index={i + 1}
                isLast={i === featuredProjects.length - 1}
              />
            </motion.div>
          ))}

          <motion.div variants={item}>
            <Link
              href="/projects"
              className="group mt-9 inline-flex items-center gap-2 font-mono text-[13px] text-muted-foreground transition-colors duration-[180ms] ease-out hover:text-accent"
            >
              View all {projects.length} projects
              <ArrowRight
                className="size-3.5 transition-transform duration-[180ms] ease-out group-hover:translate-x-[3px]"
                aria-hidden
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
