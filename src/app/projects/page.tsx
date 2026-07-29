import { Suspense } from "react";
import type { Metadata } from "next";
import { BackLink } from "@/components/layout/back-link";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: `${projects.length} projects across agent systems, RAG, RL environments, developer tools, and full-stack web.`,
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 pb-20 md:px-6 md:pt-20">
      <BackLink />

      <header className="mt-8 flex flex-col gap-3">
        <h1 className="text-foreground text-2xl font-semibold tracking-[-0.02em]">
          Projects
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {projects.length} things I&apos;ve built, grouped by domain. Filter by
          stack or focus, or hit{" "}
          <kbd className="bg-muted/40 rounded border border-[--border] px-1 font-mono text-[11px]">
            ⌘K
          </kbd>{" "}
          to search.
        </p>
      </header>

      <div className="mt-12">
        {/* ProjectExplorer reads filter state from searchParams. */}
        <Suspense fallback={null}>
          <ProjectExplorer />
        </Suspense>
      </div>
    </div>
  );
}
