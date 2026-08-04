import { Suspense } from "react";
import type { Metadata } from "next";
import { BackLink } from "@/components/layout/back-link";
import { SectionHead } from "@/components/layout/section-head";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: `${projects.length} projects across agent systems, RAG, RL environments, developer tools, and full-stack web.`,
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 pt-12 pb-20 md:pt-20">
      <BackLink />

      <header className="mt-10 flex flex-col gap-6 border-b border-border pb-16">
        <SectionHead index="00" title="Archive" />
        <h1 className="text-foreground text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
          Projects
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-dim)]">
          <span className="font-mono text-accent">{projects.length}</span>{" "}
          things I&apos;ve built, grouped by domain. Filter by stack or focus,
          or hit{" "}
          <kbd className="rounded-[4px] border border-border bg-muted/40 px-1 font-mono text-[11px]">
            ⌘K
          </kbd>{" "}
          to search.
        </p>
      </header>

      <div className="mt-16">
        {/* ProjectExplorer reads filter state from searchParams. */}
        <Suspense fallback={null}>
          <ProjectExplorer />
        </Suspense>
      </div>
    </div>
  );
}
