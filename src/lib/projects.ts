export type Project = {
  name: string;
  description: string;
  tech: readonly string[];
  github?: string;
  live?: string;
};

export const projects: readonly Project[] = [
  {
    name: "Code Review Agent",
    description: "Built a GitHub App that autonomously reviews pull requests using LLMs and posts structured feedback directly on PRs.",
    tech: ["TypeScript", "Node.js", "Express.js", "Octokit", "Docker", "GitHub Actions", "Gemini API"],
    github: "https://github.com/ishanavasthi/pr-review-bot",
    // live: "https://example.com",
  },
  {
    name: "AI PDF Chatbot & Agent",
    description: "Developed a full-stack, AI-powered document assistant enabling users to upload PDFs and interactively query them using a RAG pipeline with an agentic reasoning loop, inspired by NotebookLM.",
    tech: ["Python", "LangChain", "LangGraph", "ChromaDB", "Next.js", "Tailwind CSS"],
    github: "https://github.com/ishanavasthi/ChatWithPDF",
  },
  {
    name: "RecruitEnv - RL Candidate Triage Environment",
    description: "Built OpenEnv-compliant RL environment simulating AI-driven candidate screening across difficulty levels.",
    tech: ["Python", "FastAPI", "NumPy", "Docker", "Pytest"],
    github: "https://github.com/ishanavasthi/recruit-env",
    // live: "https://example.com",
  },
] as const;
