"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { ProjectCascade } from "@/components/projects/project-cascade";
import { ProjectCard } from "@/components/projects/project-card";
import {
  ProjectFilters,
  type DomainFilter,
} from "@/components/projects/project-filters";
import { featuredProjects, projects, type Project } from "@/lib/projects";
import {
  ALL_TAGS,
  ARCHIVED_DOMAINS,
  DOMAINS,
  tagGroupOf,
  type DomainId,
  type Tag,
  type TagGroupId,
} from "@/lib/taxonomy";
import { motion, type Variants } from "framer-motion";
import { EASE_SIGNATURE } from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const VALID_DOMAINS = new Set<string>(DOMAINS.map((d) => d.id));
const VALID_TAGS = new Set<string>(ALL_TAGS);

/** AND across facet groups, OR within a group. */
function matchesTags(project: Project, selected: readonly Tag[]) {
  if (selected.length === 0) return true;
  const byGroup = new Map<TagGroupId, Tag[]>();
  for (const tag of selected) {
    const group = tagGroupOf(tag);
    if (!group) continue;
    byGroup.set(group, [...(byGroup.get(group) ?? []), tag]);
  }
  return [...byGroup.values()].every((groupTags) =>
    groupTags.some((tag) => project.tags.includes(tag)),
  );
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_SIGNATURE },
  },
};

export function ProjectExplorer() {
  const skipEntrance = useSkipEntrance();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the source of truth, so any filtered view is shareable and
  // back/forward navigation works without extra bookkeeping.
  const domain: DomainFilter = (() => {
    const raw = searchParams.get("domain");
    return raw && VALID_DOMAINS.has(raw) ? (raw as DomainId) : "all";
  })();

  const tags: readonly Tag[] = React.useMemo(() => {
    const raw = searchParams.get("tag");
    if (!raw) return [];
    return raw.split(",").filter((t): t is Tag => VALID_TAGS.has(t));
  }, [searchParams]);

  const commit = React.useCallback(
    (next: { domain?: DomainFilter; tags?: readonly Tag[] }) => {
      const nextDomain = next.domain ?? domain;
      const nextTags = next.tags ?? tags;
      const params = new URLSearchParams();
      if (nextDomain !== "all") params.set("domain", nextDomain);
      if (nextTags.length > 0) params.set("tag", nextTags.join(","));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [domain, tags, pathname, router],
  );

  const [archiveOpen, setArchiveOpen] = React.useState(false);

  const filtered = React.useMemo(
    () =>
      projects.filter(
        (p) =>
          (domain === "all" || p.domain === domain) && matchesTags(p, tags),
      ),
    [domain, tags],
  );

  const isUnfiltered = domain === "all" && tags.length === 0;
  // Featured projects get the hero grid in the unfiltered view, so keep them
  // out of the cascade below to avoid showing the same card twice. Once a
  // filter is on there is no hero grid, so everything matching belongs there.
  const cascadeProjects = isUnfiltered
    ? filtered.filter((p) => !p.featured)
    : filtered;
  const cascadeKey = `${domain}|${tags.join(",")}`;

  const jumpToProject = React.useCallback(
    (slug: string) => {
      const target = projects.find((p) => p.slug === slug);
      if (!target) return;
      // Clear filters so the card is guaranteed to be rendered, and open the
      // archive if that's where it lives.
      commit({ domain: "all", tags: [] });
      if (ARCHIVED_DOMAINS.includes(target.domain)) setArchiveOpen(true);
      // The card can take a few frames to exist: the URL commit re-renders the
      // grid, the cascade re-keys and lays out, and an archived section has to
      // mount its collapsible content. Poll for the anchor instead of guessing
      // a frame count, and give up rather than spin forever.
      let frames = 0;
      const findAndScroll = () => {
        const el = document.getElementById(`project-${slug}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (frames++ < 60) requestAnimationFrame(findAndScroll);
      };
      requestAnimationFrame(findAndScroll);
    },
    [commit],
  );

  const toggleTagFromCard = React.useCallback(
    (tag: string) => {
      if (!VALID_TAGS.has(tag)) return;
      const t = tag as Tag;
      commit({
        tags: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t],
      });
    },
    [commit, tags],
  );

  // Which domains to render as sections, and in canonical order.
  const visibleDomains = DOMAINS.filter((d) =>
    cascadeProjects.some((p) => p.domain === d.id),
  );
  const liveDomains = visibleDomains.filter(
    (d) => !ARCHIVED_DOMAINS.includes(d.id),
  );
  const archivedDomains = visibleDomains.filter((d) =>
    ARCHIVED_DOMAINS.includes(d.id),
  );
  // An explicitly selected archive domain shouldn't hide behind a disclosure.
  const collapseArchive = domain === "all";

  return (
    <div className="flex flex-col gap-10">
      {isUnfiltered ? (
        <section className="flex flex-col gap-6">
          <SectionLabel>Selected work</SectionLabel>
          <motion.div
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
            initial={skipEntrance ? "show" : "hidden"}
            whileInView={skipEntrance ? undefined : "show"}
            animate={skipEntrance ? "show" : undefined}
            viewport={{ once: true, margin: "-10% 0px" }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {featuredProjects.map((p, i) => (
              <ProjectCard
                key={p.slug}
                project={p}
                variant="featured"
                index={i + 1}
                id={`project-${p.slug}`}
              />
            ))}
          </motion.div>
        </section>
      ) : null}

      <div className="flex flex-col gap-6">
        <SectionLabel>
          {isUnfiltered ? "Everything else" : "Filtered"}
        </SectionLabel>

        <ProjectFilters
          domain={domain}
          onDomainChange={(d) => commit({ domain: d })}
          tags={tags}
          onTagsChange={(t) => commit({ tags: t })}
          resultCount={filtered.length}
          onJumpToProject={jumpToProject}
        />

        {filtered.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No projects match</EmptyTitle>
              <EmptyDescription>
                That combination of domain and tags is empty. Try removing a
                filter.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              variant="outline"
              size="sm"
              onClick={() => commit({ domain: "all", tags: [] })}
            >
              Reset filters
            </Button>
          </Empty>
        ) : (
          <div className="flex flex-col gap-12">
            {liveDomains.map((d) => (
              <motion.section
                key={d.id}
                variants={sectionVariants}
                initial={skipEntrance ? "show" : "hidden"}
                whileInView={skipEntrance ? undefined : "show"}
                animate={skipEntrance ? "show" : undefined}
                viewport={{ once: true, margin: "-8% 0px" }}
                className="flex flex-col gap-5"
              >
                <DomainHeading
                  label={d.label}
                  blurb={d.blurb}
                  count={cascadeProjects.filter((p) => p.domain === d.id).length}
                />
                <ProjectCascade
                  projects={cascadeProjects.filter((p) => p.domain === d.id)}
                  cascadeKey={`${cascadeKey}|${d.id}`}
                  onTagClick={toggleTagFromCard}
                  activeTags={tags}
                />
              </motion.section>
            ))}

            {archivedDomains.map((d) => {
              const items = cascadeProjects.filter((p) => p.domain === d.id);
              if (!collapseArchive) {
                return (
                  <section key={d.id} className="flex flex-col gap-5">
                    <DomainHeading
                      label={d.label}
                      blurb={d.blurb}
                      count={items.length}
                    />
                    <ProjectCascade
                      projects={items}
                      cascadeKey={`${cascadeKey}|${d.id}`}
                      onTagClick={toggleTagFromCard}
                      activeTags={tags}
                    />
                  </section>
                );
              }
              return (
                <Collapsible
                  key={d.id}
                  open={archiveOpen}
                  onOpenChange={setArchiveOpen}
                >
                  <Separator className="mb-6" />
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="group flex w-full cursor-pointer items-center gap-2 text-left text-muted-foreground transition-colors duration-[180ms] ease-out hover:text-accent"
                    >
                      <ChevronRight
                        className="size-4 transition-transform group-data-[state=open]:rotate-90"
                        aria-hidden
                      />
                      <span className="font-mono text-xs tracking-widest uppercase">
                        {d.label}
                      </span>
                      <span className="font-mono text-xs">({items.length})</span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-6">
                    <p className="mb-5 max-w-xl text-sm leading-relaxed text-[var(--text-dim)]">
                      {d.blurb}
                    </p>
                    <ProjectCascade
                      projects={items}
                      cascadeKey={`${cascadeKey}|${d.id}|${archiveOpen}`}
                      onTagClick={toggleTagFromCard}
                      activeTags={tags}
                    />
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[13px] tracking-[0.18em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function DomainHeading({
  label,
  blurb,
  count,
}: {
  label: string;
  blurb: string;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-1 border-t border-border pt-6">
      <div className="flex items-baseline gap-2">
        <h2 className="text-foreground text-sm font-semibold tracking-[-0.01em]">
          {label}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {count}
        </span>
      </div>
      <p className="max-w-xl text-sm leading-relaxed text-[var(--text-dim)]">
        {blurb}
      </p>
    </div>
  );
}
