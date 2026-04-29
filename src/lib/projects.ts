export type Project = {
  name: string;
  description: string;
  tech: readonly string[];
  github?: string;
  live?: string;
};

export const projects: readonly Project[] = [
  {
    name: "Project One",
    description: "Placeholder — replace with real project copy.",
    tech: ["TypeScript", "Next.js", "OpenAI"],
    github: "https://github.com/ishanavasthi/project-one",
    live: "https://example.com",
  },
  {
    name: "Project Two",
    description: "Placeholder — replace with real project copy.",
    tech: ["Python", "LangGraph", "Postgres"],
    github: "https://github.com/ishanavasthi/project-two",
  },
  {
    name: "Project Three",
    description: "Placeholder — replace with real project copy.",
    tech: ["Rust", "Tokio", "WASM"],
    github: "https://github.com/ishanavasthi/project-three",
    live: "https://example.com",
  },
] as const;
