export type Project = {
  name: string;
  description: string;
  tech: readonly string[];
  github?: string;
  live?: string;
};

export const projects: readonly Project[] = [
  {
    name: "Preflight: AI Agent Regression Detection",
    description: "Built a CI tool that catches cost, latency, token, and success-rate regressions in AI agent systems before deployment, comparing agent behavior across commits and posting findings to pull requests with deep links to the offending trace spans. A diagnosis agent queries SigNoz over MCP to explain each failed gate in natural language, and its own investigation is traced and queryable.",
    tech: ["Python", "OpenTelemetry", "SigNoz", "ClickHouse", "MCP", "Claude API", "Docker Compose", "GitHub Actions", "YAML"],
    github: "https://github.com/ishanavasthi/preflight",
    live: "https://link.ishanavasthi.in/preflight-video",
  },
  {
    name: "ClinicFlow: AI Healthcare Receptionist",
    description: "Built a real-time AI voice agent that answers patient calls, runs intake, books appointments, and routes callers, with a live operator dashboard. Combines a barge-in capable LiveKit pipeline with auditable LLM function tools and deterministic guardrails so the agent never invents facts or skips steps.",
    tech: ["Python", "LiveKit", "Deepgram STT", "Groq", "Numik TTS", "FastAPI", "SQLModel", "SQLite", "Next.js", "TypeScript"],
    github: "https://github.com/ishanavasthi/clinicflow",
    live: "https://link.ishanavasthi.in/clinicflow-video",
  },
  {
    name: "AgentGrid: Autonomous Multi-Agent Coding Pipeline",
    description: "Built a coding pipeline of 9 Gemini agents that takes a software issue from report to tested, merged pull request with zero human intervention. Specialized agents (Planner, Coder, Reviewer, Integrator, Tester, Publisher) collaborate through context-preserving handoffs and conflict resolution, backed by a live dashboard.",
    tech: ["Python", "Gemini API", "google-genai", "stdlib http.server", "SSE", "subprocess/git", "threading", "concurrent.futures", "argparse", "Playwright", "HTML/CSS/JS", "WAV/PNG (stdlib)"],
    github: "https://github.com/ishanavasthi/agentgrid",
    live: "https://link.ishanavasthi.in/agentgrid-demo-video",
  },
  {
    name: "AlphaDesk: Multi-Agent Equity Research System",
    description: "Built a full-stack multi-agent research platform that automates Indian stock analysis with LangGraph, live NSE market data, RAG over financial filings, human approval checkpoints, and a real-time research dashboard.",
    tech: ["LangGraph", "Next.js", "TypeScript", "FastAPI", "ChromaDB", "ONNX", "LangSmith"],
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
  // {
  //   name: "Code Review Agent",
  //   description: "Built a GitHub App that autonomously reviews pull requests using LLMs and posts structured feedback directly on PRs.",
  //   tech: ["TypeScript", "Node.js", "Express.js", "Octokit", "Docker", "GitHub Actions", "Gemini API"],
  //   github: "https://github.com/ishanavasthi/pr-review-bot",
  //   // live: "https://example.com",
  // },
] as const;
