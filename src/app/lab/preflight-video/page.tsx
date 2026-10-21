import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/layout/back-link";
import { SectionHead } from "@/components/layout/section-head";
import { StaggerGroup } from "@/components/motion/stagger";
import { ProjectCard } from "@/components/projects/project-card";
import { projects, type Project } from "@/lib/projects";

/**
 * Design-review page for the Preflight card loop: the real /projects card,
 * three times, one per visual direction. Not linked from the nav and not in
 * the sitemap (src/app/sitemap.ts lists routes explicitly); noindex as well.
 * Delete once a direction is picked.
 */
export const metadata: Metadata = {
  title: "Preflight video directions",
  robots: { index: false, follow: false },
};

const STYLES = [
  {
    id: "a",
    label: "A · artifact",
    note: "The literal UI: the PR check goes red, then the metric table the gate posted, with p95 latency and the damaged-item trace link called out.",
    alt: "Preflight's PR comment: five of six agent metrics over threshold, p95 latency up 167%, biggest mover damaged-item linked to its SigNoz trace",
  },
  {
    id: "b",
    label: "B · schematic",
    note: "The pipeline: commit, cassette replay, six metrics against baseline, the gate failing, the diagnosis agent's 15 MCP calls, the trace.",
    alt: "Preflight pipeline diagram: commit, cassette replay, six metric bars against baseline, failed gate, diagnosis agent, SigNoz trace for damaged-item",
  },
  {
    id: "c",
    label: "C · kinetic",
    note: "Four beats of type: a prompt changed, unit tests pass, p95 latency +167%, caught on the PR.",
    alt: "p95 latency +167%, 3.18s to 8.51s",
  },
] as const;

function withStyle(base: Project, id: string, alt: string): Project {
  return {
    ...base,
    video: {
      mp4: `/projects/preflight-${id}.mp4`,
      webm: `/projects/preflight-${id}.webm`,
      poster: `/projects/preflight-${id}-poster.webp`,
      alt,
    },
  };
}

export default function PreflightVideoLab() {
  const preflight = projects.find((p) => p.slug === "preflight");
  if (!preflight) notFound();

  return (
    <div className="mx-auto max-w-[1560px] px-6 pt-12 pb-20 md:pt-20">
      <BackLink href="/projects" label="back to projects" />

      <header className="mt-10 flex flex-col gap-4 border-b border-border pb-12">
        <SectionHead index="lab" title="Preflight card video" />
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground">
          Three directions
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-dim)]">
          The real Preflight card from /projects, once per style. On desktop
          each loop plays while its card is hovered or focused; on touch, while
          it is mostly on screen, one at a time. With reduced motion you see
          the posters only, which is the point of the poster row below.
        </p>
      </header>

      <section className="mt-12 flex flex-col gap-6">
        <h2 className="font-mono text-[13px] tracking-[0.18em] text-muted-foreground uppercase">
          In the card
        </h2>
        <StaggerGroup
          mode="mount"
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
        >
          {STYLES.map((s, i) => (
            <div key={s.id} className="flex flex-col gap-3">
              <span className="font-mono text-xs text-accent">{s.label}</span>
              <ProjectCard
                project={withStyle(preflight, s.id, s.alt)}
                variant="featured"
                index={i + 1}
              />
              <p className="text-xs leading-relaxed text-[var(--text-dim)]">
                {s.note}
              </p>
            </div>
          ))}
        </StaggerGroup>
      </section>

      <section className="mt-16 flex flex-col gap-6">
        <h2 className="font-mono text-[13px] tracking-[0.18em] text-muted-foreground uppercase">
          Posters (the reduced-motion experience)
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {STYLES.map((s) => (
            <figure key={s.id} className="flex flex-col gap-3">
              <span className="block overflow-hidden rounded-[4px] border border-border">
                <Image
                  src={`/projects/preflight-${s.id}-poster.webp`}
                  alt={s.alt}
                  width={1280}
                  height={800}
                  className="aspect-[16/10] w-full object-cover"
                />
              </span>
              <figcaption className="font-mono text-xs text-muted-foreground">
                {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
