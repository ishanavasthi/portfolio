/**
 * Two-axis taxonomy for the project cascade.
 *
 * `domain` is one-per-project and drives the section a card cascades into.
 * `tags` are many-per-project and drive faceted filtering. Filtering is AND
 * across facet groups, OR within a group — standard faceted-search semantics.
 */

export const DOMAINS = [
  {
    id: "agents",
    label: "Agents & LLM Systems",
    blurb:
      "Multi-agent pipelines, tool-calling agents, and the observability around them.",
  },
  {
    id: "rag",
    label: "RAG & Document AI",
    blurb: "Retrieval pipelines over documents people actually need to read.",
  },
  {
    id: "rl",
    label: "RL Environments & Evals",
    blurb: "OpenEnv-compliant environments for training and grading agents.",
  },
  {
    id: "tools",
    label: "Developer Tools",
    blurb: "Small, sharp utilities built to remove a specific daily friction.",
  },
  {
    id: "web",
    label: "Full-Stack & Web",
    blurb: "Product-shaped web apps, end to end.",
  },
  {
    id: "foundations",
    label: "Foundations",
    blurb:
      "Earlier work — Spring Boot services, low-level design, Java, and data analysis.",
  },
] as const;

export type DomainId = (typeof DOMAINS)[number]["id"];

/** Domains rendered collapsed by default, below the primary cascade. */
export const ARCHIVED_DOMAINS: readonly DomainId[] = ["foundations"];

export const TAG_GROUPS = [
  {
    id: "language",
    label: "Language",
    tags: ["Python", "TypeScript", "JavaScript", "Java", "C#"],
  },
  {
    id: "stack",
    label: "Stack",
    tags: [
      "Next.js",
      "FastAPI",
      "LangGraph",
      "LiveKit",
      "MCP",
      "Gemini",
      "Claude",
      "Groq",
      "Spring Boot",
      "Supabase",
      "React Native",
      "Docker",
      "Deno",
      "n8n",
    ],
  },
  {
    id: "focus",
    label: "Focus",
    tags: [
      "Multi-Agent",
      "RAG",
      "Voice AI",
      "RL Env",
      "Evals",
      "DevTools",
      "Full-Stack",
      "Systems",
      "Data",
    ],
  },
] as const;

export type TagGroupId = (typeof TAG_GROUPS)[number]["id"];
export type Tag = (typeof TAG_GROUPS)[number]["tags"][number];

export const DOMAIN_LABELS = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d.label]),
) as Record<DomainId, string>;

/** Every tag in canonical group order — used for stable chip sorting. */
export const ALL_TAGS: readonly Tag[] = TAG_GROUPS.flatMap((g) => g.tags);

const TAG_ORDER = new Map<string, number>(ALL_TAGS.map((t, i) => [t, i]));

export function sortTags(tags: readonly Tag[]): Tag[] {
  return [...tags].sort(
    (a, b) => (TAG_ORDER.get(a) ?? 999) - (TAG_ORDER.get(b) ?? 999),
  );
}

export function tagGroupOf(tag: Tag): TagGroupId | undefined {
  return TAG_GROUPS.find((g) => (g.tags as readonly string[]).includes(tag))?.id;
}
