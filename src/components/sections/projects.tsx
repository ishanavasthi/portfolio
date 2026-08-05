import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHead } from "@/components/layout/section-head";
import { ProjectLedgerRow } from "@/components/projects/project-ledger-row";
import { featuredProjects, projects } from "@/lib/projects";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Home-page highlight reel. The full, filterable archive lives at /projects.
 */
export function Projects() {
  return (
    <section id="projects" className="border-b border-border py-[88px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal direction="up">
          <SectionHead index="03" title="Selected projects" />
        </Reveal>

        <StaggerGroup>
          {featuredProjects.map((p, i) => (
            <StaggerItem key={p.slug}>
              <ProjectLedgerRow
                project={p}
                index={i + 1}
                isLast={i === featuredProjects.length - 1}
              />
            </StaggerItem>
          ))}

          <StaggerItem>
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
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
