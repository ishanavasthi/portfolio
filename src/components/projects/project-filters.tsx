"use client";

import * as React from "react";
import { ListFilter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  activityOf,
  isActive,
  lastTouchedLabel,
  projects,
  projectsByRecency,
} from "@/lib/projects";
import {
  DOMAINS,
  TAG_GROUPS,
  type DomainId,
  type Tag,
} from "@/lib/taxonomy";

export type DomainFilter = DomainId | "all";

const domainCounts = new Map<DomainId, number>(
  DOMAINS.map((d) => [d.id, projects.filter((p) => p.domain === d.id).length]),
);

/** Tags that no project carries are hidden — a facet you can't use is noise. */
const usedTags = new Set<string>(projects.flatMap((p) => p.tags));

export function ProjectFilters({
  domain,
  onDomainChange,
  tags,
  onTagsChange,
  resultCount,
  onJumpToProject,
}: {
  domain: DomainFilter;
  onDomainChange: (domain: DomainFilter) => void;
  tags: readonly Tag[];
  onTagsChange: (tags: readonly Tag[]) => void;
  resultCount: number;
  onJumpToProject: (slug: string) => void;
}) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleTag = (tag: Tag) => {
    onTagsChange(
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  };

  const hasFilters = domain !== "all" || tags.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Domain rail — scrolls horizontally on narrow screens. */}
      <ScrollArea className="w-full">
        <ToggleGroup
          type="single"
          value={domain}
          onValueChange={(value) =>
            onDomainChange((value || "all") as DomainFilter)
          }
          variant="outline"
          size="sm"
          className="w-max"
          aria-label="Filter by domain"
        >
          <ToggleGroupItem value="all" className="font-mono text-xs">
            All
            <span className="text-muted-foreground ml-1.5">
              {projects.length}
            </span>
          </ToggleGroupItem>
          {DOMAINS.map((d) => (
            <ToggleGroupItem
              key={d.id}
              value={d.id}
              className="font-mono text-xs whitespace-nowrap"
            >
              {d.label}
              <span className="text-muted-foreground ml-1.5">
                {domainCounts.get(d.id)}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>

      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <ListFilter data-icon="inline-start" />
              Tags
              {tags.length > 0 ? (
                <Badge
                  variant="secondary"
                  className="ml-1 rounded-sm px-1 font-mono text-[10px]"
                >
                  {tags.length}
                </Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-72 overflow-hidden p-0"
          >
            {/*
              ScrollArea needs a DEFINITE height. Its viewport is `size-full`,
              and `height: 100%` against a max-height-only parent resolves to
              `auto` — the viewport then grows to full content height, nothing
              scrolls, and the list paints outside the popover.
            */}
            <ScrollArea type="auto" className="h-[min(20rem,60vh)]">
              <div className="flex flex-col gap-4 p-3">
                {TAG_GROUPS.map((group, i) => {
                  const available = group.tags.filter((t) => usedTags.has(t));
                  if (available.length === 0) return null;
                  return (
                    <React.Fragment key={group.id}>
                      {i > 0 ? <Separator /> : null}
                      <fieldset className="flex flex-col gap-2">
                        <legend className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                          {group.label}
                        </legend>
                        <div className="flex flex-col gap-2 pt-1">
                          {available.map((tag) => {
                            const id = `tag-${group.id}-${tag}`;
                            return (
                              <div
                                key={tag}
                                className="flex items-center gap-2.5"
                              >
                                <Checkbox
                                  id={id}
                                  checked={tags.includes(tag)}
                                  onCheckedChange={() => toggleTag(tag)}
                                />
                                <label
                                  htmlFor={id}
                                  className="cursor-pointer font-mono text-xs leading-none"
                                >
                                  {tag}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </fieldset>
                    </React.Fragment>
                  );
                })}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchOpen(true)}
          className="text-muted-foreground font-mono text-xs"
        >
          <Search data-icon="inline-start" />
          Search
          <kbd className="ml-1 rounded-[4px] border border-border bg-muted/40 px-1 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        <span
          aria-live="polite"
          className="text-muted-foreground ml-auto font-mono text-xs"
        >
          {resultCount} / {projects.length}
        </span>
      </div>

      {/* Active filter chips. */}
      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-label={`Remove ${tag} filter`}
              className="cursor-pointer"
            >
              <Badge
                variant="outline"
                className="gap-1 rounded-[4px] border-[rgba(110,231,183,0.35)] bg-accent/10 px-1.5 py-0 font-mono text-[10px] font-normal text-accent"
              >
                {tag}
                <X className="size-2.5" aria-hidden />
              </Badge>
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDomainChange("all");
              onTagsChange([]);
            }}
            className="text-muted-foreground hover:text-foreground h-6 px-2 font-mono text-[10px]"
          >
            Clear all
          </Button>
        </div>
      ) : null}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          showCloseButton={false}
          className="overflow-hidden p-0 sm:max-w-lg"
        >
          <DialogTitle className="sr-only">Search projects</DialogTitle>
          <Command
            // Ranked by our own scoring below, so disable cmdk's re-sorting.
            shouldFilter={false}
            className="[&_[data-slot=command-input-wrapper]]:h-11"
          >
            <SearchBody
              onSelect={(slug) => {
                setSearchOpen(false);
                onJumpToProject(slug);
              }}
            />
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SearchBody({ onSelect }: { onSelect: (slug: string) => void }) {
  const [query, setQuery] = React.useState("");

  /*
    Pinned for the lifetime of the dialog. Every age label below is computed
    against this one instant, so a long-open palette can't drift into a state
    where one row says "6d ago" and the row beside it re-rendered into "7d ago".
    Safe to read the clock during render: the dialog portal doesn't mount until
    the palette opens, so this never runs on the server.
  */
  const [now] = React.useState(() => Date.now());

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    // Empty query is the "what is he working on" view — newest commit first.
    if (!q) return projectsByRecency.slice(0, 8);
    return projectsByRecency
      .map((p) => {
        const name = p.name.toLowerCase();
        // Name matches beat headline matches, which beat tag matches.
        let score = 0;
        if (name.startsWith(q)) score = 4;
        else if (name.includes(q)) score = 3;
        else if (p.headline.toLowerCase().includes(q)) score = 2;
        else if (p.tags.some((t) => t.toLowerCase().includes(q))) score = 1;
        else if (p.tech.some((t) => t.toLowerCase().includes(q))) score = 1;
        return { project: p, score };
      })
      .filter((r) => r.score > 0)
      // Ties break on recency, not the alphabet: searching "agent" should put
      // this month's agent work above a 2024 one that happens to start with A.
      .sort((a, b) => b.score - a.score)
      .map((r) => r.project);
  }, [query]);

  return (
    <>
      <CommandInput
        placeholder="Search projects, tags, or stack..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No projects match that.</CommandEmpty>
        <CommandGroup heading={query ? "Results" : "Latest commits"}>
          {results.map((p) => {
            const activity = activityOf(p.slug);
            const age = lastTouchedLabel(p.slug, now);
            const active = isActive(p.slug, now);
            return (
              <CommandItem
                key={p.slug}
                value={p.slug}
                onSelect={() => onSelect(p.slug)}
                className="flex-col items-start gap-0.5"
              >
                <span className="flex w-full items-center gap-2">
                  <span className="truncate font-medium">{p.name}</span>
                  {active ? (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-accent"
                      title={`Committed in the last two weeks${
                        activity ? ` — ${activity.commits} commits` : ""
                      }`}
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={`ml-auto shrink-0 font-mono text-[10px] tabular-nums ${
                      active ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {age ?? p.year}
                  </span>
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {p.headline}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </>
  );
}
