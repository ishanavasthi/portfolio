import { projects, projectsByDomain, type Project } from "@/lib/projects";
import type { Tag } from "@/lib/taxonomy";

export type SkillChip = {
  label: string;
  hot?: boolean;
};

export type SkillProof = {
  value: string;
  unit: string;
  secondaryValue?: string;
  secondaryUnit?: string;
  note?: string;
};

export type SkillCategory = {
  name: string;
  sub?: string;
  chips: readonly SkillChip[];
  proof: () => SkillProof;
};

const hasAnyTag = (project: Project, tags: readonly Tag[]) =>
  tags.some((tag) => project.tags.includes(tag));

/** First `n` names from an already-filtered, order-preserving list. */
function sampleNames(list: readonly Project[], n = 2): string {
  const names = list.slice(0, n).map((p) => p.name);
  return names.join(", ") + (list.length > n ? "…" : "");
}

const BACKEND_TAGS: readonly Tag[] = ["FastAPI", "Spring Boot", "Docker"];
const FRONTEND_TAGS: readonly Tag[] = ["Next.js", "React Native"];

export const SKILLS: readonly SkillCategory[] = [
  {
    name: "Agents & LLM Systems",
    sub: "the core focus",
    chips: [
      { label: "Multi-agent pipelines", hot: true },
      { label: "MCP", hot: true },
      { label: "Tool calling", hot: true },
      { label: "Claude API" },
      { label: "Gemini" },
      { label: "Groq" },
      { label: "LangGraph" },
      { label: "LangChain" },
      { label: "Voice agents · LiveKit" },
      { label: "RAG · ChromaDB" },
    ],
    proof: () => {
      const list = [...projectsByDomain("agents"), ...projectsByDomain("rag")];
      return { value: `${list.length}`, unit: "projects", note: sampleNames(list) };
    },
  },
  {
    name: "Evals & Reliability",
    sub: "what makes agents shippable",
    chips: [
      { label: "Agent evals", hot: true },
      { label: "OpenTelemetry tracing", hot: true },
      { label: "LangSmith" },
      { label: "RL environments · OpenEnv" },
      { label: "CI regression gates" },
      { label: "Deterministic guardrails" },
      { label: "Prompt-injection defense" },
      { label: "SigNoz / ClickHouse" },
    ],
    proof: () => {
      const list = projects.filter((p) => p.tags.includes("Evals"));
      return { value: `${list.length}`, unit: "projects", note: sampleNames(list) };
    },
  },
  {
    name: "Languages",
    sub: "daily drivers first",
    chips: [
      { label: "Python", hot: true },
      { label: "TypeScript", hot: true },
      { label: "JavaScript" },
      { label: "Java" },
      { label: "SQL" },
      { label: "C#" },
    ],
    proof: () => {
      const python = projects.filter((p) => p.tags.includes("Python"));
      const typescript = projects.filter((p) => p.tags.includes("TypeScript"));
      return {
        value: `${python.length}`,
        unit: "Python",
        secondaryValue: `${typescript.length}`,
        secondaryUnit: "TS",
      };
    },
  },
  {
    name: "Backend & Infra",
    chips: [
      { label: "FastAPI" },
      { label: "Node / Express" },
      { label: "Spring Boot" },
      { label: "Postgres" },
      { label: "Supabase" },
      { label: "MongoDB" },
      { label: "Docker" },
      { label: "GitHub Actions" },
      { label: "AWS" },
      { label: "asyncio / TCP" },
    ],
    proof: () => {
      const list = projects.filter((p) => hasAnyTag(p, BACKEND_TAGS));
      return { value: `${list.length}`, unit: "projects" };
    },
  },
  {
    name: "Frontend",
    chips: [
      { label: "Next.js" },
      { label: "React" },
      { label: "Tailwind CSS" },
      { label: "React Native" },
      { label: "Chrome Extensions · MV3" },
    ],
    proof: () => {
      const list = projects.filter((p) => hasAnyTag(p, FRONTEND_TAGS));
      return { value: `${list.length}`, unit: "projects" };
    },
  },
] as const;
