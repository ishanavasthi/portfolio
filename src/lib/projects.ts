export type Project = {
  name: string;
  description: string;
  tech: readonly string[];
  github?: string;
  live?: string;
};

export const projects: readonly Project[] = [
  {
    name: "AlphaDesk: Multi-Agent Equity Research System",
    description: "Built a full-stack multi-agent research platform that automates Indian stock analysis with LangGraph, live NSE market data, RAG over financial filings, human approval checkpoints, and a real-time research dashboard.",
    tech: ["LangGraph", "Next.js", "FastAPI", "ChromaDB", "ONNX", "LangSmith"],
    github: "https://github.com/ishanavasthi/alphadesk",
    live: "https://link.ishanavasthi.in/alphadesk",
  },
  {
    name: "ChatWithPDF: AI Agentic PDF Chatbot",
    description: "Developed a full-stack, AI-powered document assistant enabling users to upload PDFs and interactively query them using a RAG pipeline with an agentic reasoning loop, inspired by NotebookLM.",
    tech: ["Python", "LangChain", "LangGraph", "ChromaDB", "Next.js", "Tailwind CSS"],
    github: "https://github.com/ishanavasthi/ChatWithPDF",
    live: "https://link.ishanavasthi.in/ChatWithPDF",
  },
  {
    name: "RecruitEnv: RL Candidate Triage Environment",
    description: "Built OpenEnv-compliant RL environment simulating AI-driven candidate screening across difficulty levels.",
    tech: ["Python", "FastAPI", "NumPy", "Docker", "Pytest"],
    github: "https://github.com/ishanavasthi/recruit-env",
    // live: "https://example.com",
  },
  {
    name: "Swiggy Claw: AI Ordering Agent",
    description: "Built a full-stack AI ordering agent for food, groceries, and restaurant bookings using plain English, powered by Swiggy's MCP platform, Groq tool calling, resilient retries, and a streaming Next.js chat UI.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "MCP", "Groq", "OpenAI Tool Format"],
    github: "https://github.com/ishanavasthi/swiggy-claw",
    live: "https://link.ishanavasthi.in/swiggy-claw",
  },
  {
    name: "Code Review Agent",
    description: "Built a GitHub App that autonomously reviews pull requests using LLMs and posts structured feedback directly on PRs.",
    tech: ["TypeScript", "Node.js", "Express.js", "Octokit", "Docker", "GitHub Actions", "Gemini API"],
    github: "https://github.com/ishanavasthi/pr-review-bot",
    // live: "https://example.com",
  },
] as const;
