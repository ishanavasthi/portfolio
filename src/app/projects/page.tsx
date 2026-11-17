import type { Metadata } from "next";
import { BackLink } from "@/components/layout/back-link";
import { SectionHead } from "@/components/layout/section-head";
import { Reveal } from "@/components/motion/reveal";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { projects } from "@/lib/projects";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, collectionNode, graph, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description = `${projects.length} projects across agent systems, RAG, RL environments, developer tools, and full-stack web, grouped by domain and filterable by stack.`;

export const metadata: Metadata = {
  title: "Projects",
  ...pageMetadata({
    title: `Projects - ${site.name}`,
    description,
    path: "/projects",
  }),
};

const jsonLd = graph(
  collectionNode({
    type: "CollectionPage",
    path: "/projects",
    name: `Projects - ${site.name}`,
    description,
    items: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      headline: p.headline,
      url: `${site.url}/projects#project-${p.slug}`,
      ...(p.github || p.live ? { sameAs: [p.github, p.live].filter(Boolean) } : {}),
    })),
  }),
  breadcrumbNode([
    { name: site.name, path: "/" },
    { name: "Projects", path: "/projects" },
  ]),
);

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 pt-12 pb-20 md:pt-20">
      <JsonLd data={jsonLd} />
      <BackLink />

      <header className="mt-10 flex flex-col gap-6 border-b border-border pb-16">
        <Reveal direction="up">
          <SectionHead index="00" title="Archive" as="p" />
        </Reveal>
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
        <ProjectExplorer />
      </div>
    </div>
  );
}
