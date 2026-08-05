import type { DomainId, Tag } from "@/lib/taxonomy";

export type Project = {
  /** Stable key + deep-link target. Matches the GitHub repo name. */
  slug: string;
  name: string;
  /** One line, always shown on the card. */
  headline: string;
  /** Long form. Shown on featured cards and on weight-2 cascade cards. */
  description: string;
  domain: DomainId;
  tags: readonly Tag[];
  tech: readonly string[];
  year: number;
  /** Top-of-page hero treatment. Keep this to ~6 projects. */
  featured?: boolean;
  /**
   * Card mass in the cascade. 2 renders the long description (taller card),
   * 1 renders the headline only. This is what makes the columns stagger
   * deliberately instead of accidentally.
   */
  weight?: 1 | 2;
  github?: string;
  live?: string;
};

const gh = (slug: string) => `https://github.com/ishanavasthi/${slug}`;

export const projects: readonly Project[] = [
  // ─── Agents & LLM Systems ──────────────────────────────────────────────
  {
    slug: "preflight",
    name: "Preflight",
    headline: "CI gate that catches AI agent regressions before they ship.",
    description:
      "Built a CI tool that catches cost, latency, token, and success-rate regressions in AI agent systems before deployment, comparing agent behavior across commits and posting findings to pull requests with deep links to the offending trace spans. A diagnosis agent queries SigNoz over MCP to explain each failed gate in natural language, and its own investigation is traced and queryable.",
    domain: "agents",
    tags: ["Python", "Claude", "MCP", "Docker", "Multi-Agent", "Evals", "DevTools"],
    tech: ["Python", "OpenTelemetry", "SigNoz", "ClickHouse", "MCP", "Claude API", "Docker Compose", "GitHub Actions", "YAML"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("preflight"),
    live: "https://link.ishanavasthi.in/preflight-video",
  },
  {
    slug: "clinicflow",
    name: "ClinicFlow",
    headline: "Real-time AI voice receptionist for clinics, with a live operator dashboard.",
    description:
      "Built a real-time AI voice agent that answers patient calls, runs intake, books appointments, and routes callers, with a live operator dashboard. Combines a barge-in capable LiveKit pipeline with auditable LLM function tools and deterministic guardrails so the agent never invents facts or skips steps.",
    domain: "agents",
    tags: ["Python", "TypeScript", "LiveKit", "FastAPI", "Groq", "Next.js", "Voice AI", "Full-Stack"],
    tech: ["Python", "LiveKit", "Deepgram STT", "Groq", "Numik TTS", "FastAPI", "SQLModel", "SQLite", "Next.js", "TypeScript"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("clinicflow"),
    live: "https://link.ishanavasthi.in/clinicflow-video",
  },
  {
    slug: "agentgrid",
    name: "AgentGrid",
    headline: "Nine Gemini agents take an issue from bug report to merged PR, unattended.",
    description:
      "Built a coding pipeline of 9 Gemini agents that takes a software issue from report to tested, merged pull request with zero human intervention. Specialized agents (Planner, Coder, Reviewer, Integrator, Tester, Publisher) collaborate through context-preserving handoffs and conflict resolution, backed by a live dashboard.",
    domain: "agents",
    tags: ["Python", "Gemini", "Multi-Agent", "DevTools"],
    tech: ["Python", "Gemini API", "google-genai", "SSE", "subprocess/git", "threading", "Playwright", "HTML/CSS/JS"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("agentgrid"),
    live: "https://link.ishanavasthi.in/agentgrid-demo-video",
  },
  {
    slug: "alphadesk",
    name: "AlphaDesk",
    headline: "Multi-agent Indian equity research desk with human approval checkpoints.",
    description:
      "Built a full-stack multi-agent research platform that automates Indian stock analysis with LangGraph, live NSE market data, RAG over financial filings, human approval checkpoints, and a real-time research dashboard.",
    domain: "agents",
    tags: ["Python", "TypeScript", "LangGraph", "FastAPI", "Next.js", "Multi-Agent", "RAG", "Full-Stack"],
    tech: ["LangGraph", "Next.js", "TypeScript", "FastAPI", "ChromaDB", "ONNX", "LangSmith"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("alphadesk"),
    live: "https://link.ishanavasthi.in/alphadesk",
  },
  {
    slug: "swiggy-claw",
    name: "Swiggy Claw",
    headline: "Order food, groceries, and tables in plain English over Swiggy's MCP platform.",
    description:
      "Built a full-stack AI ordering agent for food, groceries, and restaurant bookings using plain English, powered by Swiggy's MCP platform, Groq tool calling, resilient retries, and a streaming Next.js chat UI.",
    domain: "agents",
    tags: ["TypeScript", "Next.js", "MCP", "Groq", "Multi-Agent", "Full-Stack"],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "MCP", "Groq", "OpenAI Tool Format"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("swiggy-claw"),
    live: "https://link.ishanavasthi.in/swiggy-claw",
  },
  {
    slug: "reviewgrid",
    name: "ReviewGrid",
    headline: "Agent-callable code review skill returning a deterministic verdict.",
    description:
      "Built a backend code-review skill any agent can call: POST a raw diff or a PR URL and get back a deterministic pass / needs_changes / fail verdict with line-anchored issues. Runs as a Deno service on Base44 with static analysis behind the verdict, so the same diff always grades the same way.",
    domain: "agents",
    tags: ["TypeScript", "Deno", "Claude", "DevTools", "Evals"],
    tech: ["TypeScript", "Deno", "Base44", "Static Analysis", "Agent Skills"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("reviewgrid"),
    live: "https://reviewgrid-915b1bbc.base44.app",
  },
  {
    slug: "pr-review-bot",
    name: "PR Review Bot",
    headline: "GitHub App that reviews every pull request with Gemini.",
    description:
      "Built a GitHub App that autonomously reviews pull requests using LLMs and posts structured feedback directly on the PR. On open, sync, or reopen it fetches the diff, sends it to Gemini for analysis, and comments a structured review.",
    domain: "agents",
    tags: ["TypeScript", "Gemini", "Docker", "DevTools"],
    tech: ["TypeScript", "Node.js", "Express.js", "Octokit", "Docker", "GitHub Actions", "Gemini API"],
    year: 2026,
    weight: 2,
    github: gh("pr-review-bot"),
  },
  {
    slug: "personalized-message-router",
    name: "Message Notification Router",
    headline: "Routes every WhatsApp message to notify, digest, or mute — and reproduces its own results offline.",
    description:
      "A multimodal notification router that decides which WhatsApp messages interrupt you, which wait for a digest, and which stay muted, reasoning over text, image posters, and voice notes with per-user history, group dynamics, and sender trust. A safety gate runs first and deliberately blind to engagement history, so a scam can't be argued down by a strong relationship. Evidence retrieval and confidence are deterministic code, not model output, and every model response is cached and committed — the run reproduces byte-for-byte with no API key set. 93% action accuracy on the labelled samples, standard library only.",
    domain: "agents",
    tags: ["Python", "Claude", "Gemini", "Groq", "Evals", "Data"],
    tech: ["Python", "Claude Haiku", "NVIDIA NIM", "Gemini OCR", "Groq Whisper", "Prompt Caching"],
    year: 2026,
    weight: 2,
    github: gh("personalized-message-router"),
  },
  {
    slug: "composio-research",
    name: "Agent-Toolkit Buildability Atlas",
    headline: "An agent pipeline researched 100 apps to answer one question: can we build a toolkit for it?",
    description:
      "An agent pipeline — not a spreadsheet — researched 100 apps across 10 categories on auth method, self-serve access, API surface, and existing MCP support, then graded each on whether an AI-agent toolkit is buildable today. Findings were verified against first-party docs through an accuracy loop, and the whole case study ships as a single self-contained HTML page.",
    domain: "agents",
    tags: ["Python", "JavaScript", "Multi-Agent", "Data"],
    tech: ["Python", "Agent Pipeline", "HTML/CSS/JS", "Composio"],
    year: 2026,
    weight: 2,
    github: gh("composio-research"),
  },
  {
    slug: "swiggy-n8n",
    name: "Swiggy Agent (n8n)",
    headline: "Agentic food-ordering concierge built entirely out of n8n workflows.",
    description:
      "An agentic food-ordering concierge with no application code — two chained n8n workflows do the work. A natural-language request like \"vegetarian dinner for 2 under 500\" is parsed into structured intent, then refined through search, recommendation, and review passes. The restaurant backend is a deliberate mock behind one HTTP node, so swapping in the real API changes exactly one thing.",
    domain: "agents",
    tags: ["n8n", "Multi-Agent"],
    tech: ["n8n", "HTTP Workflows", "LLM Intent Parsing"],
    year: 2026,
    weight: 1,
    github: gh("swiggy-n8n"),
  },

  // ─── RAG & Document AI ─────────────────────────────────────────────────
  {
    slug: "ChatWithPDF",
    name: "ChatWithPDF",
    headline: "NotebookLM-style agentic assistant for querying your own PDFs.",
    description:
      "Developed a full-stack, AI-powered document assistant enabling users to upload PDFs and interactively query them using a RAG pipeline with an agentic reasoning loop, inspired by NotebookLM.",
    domain: "rag",
    tags: ["Python", "TypeScript", "LangGraph", "FastAPI", "Next.js", "Gemini", "RAG", "Full-Stack"],
    tech: ["Python", "LangChain", "LangGraph", "ChromaDB", "Next.js", "Tailwind CSS"],
    year: 2026,
    weight: 2,
    github: gh("ChatWithPDF"),
    live: "https://link.ishanavasthi.in/ChatWithPDF",
  },
  {
    slug: "lexguard",
    name: "LexGuard",
    headline: "Upload a contract, get plain-English risk analysis of every clause.",
    description:
      "AI-powered contract intelligence. Upload a PDF or DOCX and get plain-English risk analysis of every clause — red flags, real-world impact, and negotiation tips — instead of a summary that skips the parts that matter.",
    domain: "rag",
    tags: ["Python", "TypeScript", "FastAPI", "Next.js", "Gemini", "RAG", "Full-Stack"],
    tech: ["FastAPI", "Gemini", "Next.js 14", "Tailwind CSS", "PDF/DOCX Parsing"],
    year: 2026,
    weight: 2,
    github: gh("lexguard"),
  },

  // ─── RL Environments & Evals ───────────────────────────────────────────
  {
    slug: "recruit-env",
    name: "RecruitEnv",
    headline: "OpenEnv RL environment for candidate pipeline triage under a step budget.",
    description:
      "An OpenEnv-compliant RL environment simulating candidate pipeline triage: an agent reviews synthetic developer profiles across GitHub, LeetCode, Kaggle, and resume signals and makes shortlisting decisions under a step budget. Built for the OpenEnv Hackathon by Meta x Hugging Face.",
    domain: "rl",
    tags: ["Python", "FastAPI", "Docker", "RL Env", "Evals"],
    tech: ["Python", "FastAPI", "NumPy", "Docker", "Pytest"],
    year: 2026,
    weight: 2,
    github: gh("recruit-env"),
  },
  {
    slug: "insurance-claim-env",
    name: "InsuranceClaimEnv",
    headline: "OpenEnv environment for high-stakes insurance claim adjudication.",
    description:
      "An OpenEnv environment simulating insurance claim adjudication — the document-heavy, high-stakes workflow where an adjudicator reviews a claim against a policy document and must approve, deny, or escalate, with a payout amount and a written justification.",
    domain: "rl",
    tags: ["Python", "Docker", "RL Env", "Evals"],
    tech: ["Python", "OpenEnv", "Docker"],
    year: 2026,
    weight: 2,
    github: gh("insurance-claim-env"),
  },

  // ─── Developer Tools ───────────────────────────────────────────────────
  {
    slug: "context-lens",
    name: "ContextLens",
    headline: "Browser activity capture that survives MV3 service worker death without dropping or duplicating a single event.",
    description:
      "A Chrome Manifest V3 extension that captures tab changes, navigation, interactions, and screenshots into Postgres through a backend API. Because MV3 kills the service worker on idle, nothing durable lives in memory: events hit IndexedDB before they count as captured and client-generated ULIDs make retries idempotent. Capture is off by default and granted scope by scope.",
    domain: "tools",
    tags: ["TypeScript", "Docker", "DevTools", "Full-Stack", "Systems"],
    tech: ["TypeScript", "Chrome MV3", "IndexedDB", "Postgres", "Docker", "Playwright", "ULID"],
    year: 2026,
    weight: 2,
    github: gh("context-lens"),
  },
  {
    slug: "markdown-copier",
    name: "Markdown Copier",
    headline: "Chrome extension that turns any page into clean, LLM-ready Markdown.",
    description:
      "Chrome extension that converts a whole webpage or just the selected content into clean, LLM-ready Markdown with one click — no nav chrome, no tracking pixels, no hand-editing before you paste it into a prompt.",
    domain: "tools",
    tags: ["TypeScript", "DevTools"],
    tech: ["TypeScript", "Chrome Extension APIs", "Turndown"],
    year: 2026,
    weight: 2,
    github: gh("markdown-copier"),
  },
  {
    slug: "kv-cache",
    name: "KV-Cache",
    headline: "In-memory key-value store over raw TCP, built on asyncio.",
    description:
      "A high-performance in-memory key-value cache server built with Python asyncio, speaking a custom wire protocol over raw TCP sockets. Layered into network, protocol, and cache tiers, with Docker packaging, AWS deployment scripts, and load tests.",
    domain: "tools",
    tags: ["Python", "Docker", "Systems"],
    tech: ["Python", "asyncio", "TCP Sockets", "Docker", "AWS", "Shell"],
    year: 2026,
    weight: 2,
    github: gh("kv-cache"),
  },
  {
    slug: "gemini-api-tester",
    name: "Gemini API Tester",
    headline: "Validate a Gemini key, list usable models, run a live smoke test.",
    description:
      "A lightweight Python toolkit to validate Gemini API keys, list available text-generation models, and run interactive live smoke tests. Includes a pytest suite for baseline API verification.",
    domain: "tools",
    tags: ["Python", "Gemini", "DevTools"],
    tech: ["Python", "Gemini API", "Pytest"],
    year: 2026,
    weight: 1,
    github: gh("gemini-api-tester"),
  },
  {
    slug: "comments-remover",
    name: "Comments Remover",
    headline: "Strip comments from almost any language, in the browser.",
    description:
      "A general-purpose comment remover covering almost any programming or markup language — C++, PHP, JavaScript, Python, HTML, Java, CSS and more — running entirely client-side.",
    domain: "tools",
    tags: ["JavaScript", "DevTools"],
    tech: ["JavaScript", "HTML", "CSS", "Regex Parsing"],
    year: 2023,
    weight: 1,
    github: gh("comments-remover"),
    live: "https://ishanavasthi.in/projects/comments-remover",
  },
  {
    slug: "web-scraper",
    name: "Web Scraper",
    headline: "CLI scraper for product listings across three Indian marketplaces.",
    description:
      "A Python CLI that extracts product name and canonical URL from Amazon, Flipkart, and Snapdeal listings using requests and BeautifulSoup, with a per-site parsing strategy behind one prompt-driven interface.",
    domain: "tools",
    tags: ["Python", "DevTools", "Data"],
    tech: ["Python", "BeautifulSoup", "Requests"],
    year: 2023,
    weight: 1,
    github: gh("web-scraper"),
  },

  // ─── Full-Stack & Web ──────────────────────────────────────────────────
  {
    slug: "fintracker",
    name: "FinTracker",
    headline: "Personal finance tracker with category budgets and live spend breakdowns.",
    description:
      "A personal finance tracker for logging income and expenses, visualising where money actually goes, and holding a monthly per-category budget. Supabase auth with protected routes, dashboard summary cards, a category pie chart, a six-month income-vs-expense bar chart, and full transaction CRUD.",
    domain: "web",
    tags: ["JavaScript", "Supabase", "Full-Stack", "Data"],
    tech: ["React", "Supabase", "Supabase Auth", "Recharts", "Vercel"],
    year: 2026,
    weight: 2,
    github: gh("fintracker"),
    live: "https://fintracker-three-iota.vercel.app",
  },
  {
    slug: "EventHive",
    name: "EventHive",
    headline: "Event discovery and booking platform with a React Native client.",
    description:
      "A full-stack event discovery and booking platform: an Express and MongoDB REST API with JWT auth covering users, events, and bookings, paired with a React Native (Expo) mobile client with custom navigation and a glass-card UI kit.",
    domain: "web",
    tags: ["JavaScript", "React Native", "Full-Stack"],
    tech: ["Node.js", "Express", "MongoDB", "JWT", "React Native", "Expo"],
    year: 2026,
    weight: 2,
    github: gh("EventHive"),
  },
  {
    slug: "portfolio",
    name: "This Portfolio",
    headline: "The site you're reading — Next.js, MDX blog, and this cascade.",
    description:
      "Personal site built with Next.js App Router and Tailwind CSS v4: an MDX blog pipeline, a faceted project cascade, and an llms.txt route so agents can read it too.",
    domain: "web",
    tags: ["TypeScript", "Next.js", "Full-Stack"],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "MDX", "shadcn/ui", "Framer Motion"],
    year: 2023,
    weight: 1,
    github: gh("portfolio"),
    live: "https://ishanavasthi.in",
  },
  {
    slug: "hotel-booking",
    name: "Hotel Booking Chatbot",
    headline: "Session-aware LLM chatbot for hotel enquiries and bookings.",
    description:
      "A Node.js hotel booking chatbot that handles enquiries and reservations through conversation, keeping per-session state behind a single /chat REST endpoint.",
    domain: "web",
    tags: ["JavaScript", "Full-Stack"],
    tech: ["Node.js", "Express", "OpenAI API"],
    year: 2025,
    weight: 1,
    github: gh("hotel-booking"),
  },
  {
    slug: "iitjee.art",
    name: "iitjee.art",
    headline: "Search and browse a Google Drive library from one web app.",
    description:
      "A web app over the Google Drive API for organising, viewing, and searching files, folders, and study documents without digging through Drive's own UI.",
    domain: "web",
    tags: ["JavaScript", "Full-Stack"],
    tech: ["JavaScript", "Google Drive API", "HTML", "CSS"],
    year: 2023,
    weight: 1,
    github: gh("iitjee.art"),
    live: "https://iitjee.art",
  },
  {
    slug: "sst-hackathon",
    name: "HTML Minifier",
    headline: "Two-way HTML minifier and unminifier, built at a hackathon.",
    description:
      "A browser-based HTML minifier and unminifier — strip whitespace, comments, and line breaks, or restore readable formatting from minified markup. Built for the SST hackathon.",
    domain: "web",
    tags: ["JavaScript", "DevTools"],
    tech: ["JavaScript", "HTML", "CSS"],
    year: 2023,
    weight: 1,
    github: gh("sst-hackathon"),
  },

  // ─── Foundations ───────────────────────────────────────────────────────
  {
    slug: "Product-Service",
    name: "Product Service",
    headline: "Spring Boot product catalogue microservice with Flyway migrations.",
    description:
      "A Spring Boot product catalogue microservice with JPA persistence, Flyway migrations, a FakeStore API fallback implementation behind the same service interface, global exception handling, and Kubernetes deployment manifests.",
    domain: "foundations",
    tags: ["Java", "Spring Boot", "Docker", "Systems"],
    tech: ["Java", "Spring Boot", "JPA", "Flyway", "Docker", "Kubernetes", "JUnit"],
    year: 2024,
    weight: 1,
    github: gh("Product-Service"),
  },
  {
    slug: "cart-service",
    name: "Cart Service",
    headline: "Spring Boot cart service with layered domain design.",
    description:
      "A Spring Boot application implementing a shopping cart service, built to practise layered controller/service/repository design and REST API conventions.",
    domain: "foundations",
    tags: ["Java", "Spring Boot", "Systems"],
    tech: ["Java", "Spring Boot", "Maven"],
    year: 2024,
    weight: 1,
    github: gh("cart-service"),
  },
  {
    slug: "Patient-Record-System",
    name: "Patient Record System",
    headline: "Spring Boot REST API for patients, histories, and appointments.",
    description:
      "A Spring Boot REST API for managing patients, their medical histories, and appointments, with a layered controller/service/repository architecture and custom domain exceptions.",
    domain: "foundations",
    tags: ["Java", "Spring Boot", "Systems"],
    tech: ["Java", "Spring Boot", "JPA", "Maven"],
    year: 2024,
    weight: 1,
    github: gh("Patient-Record-System"),
  },
  {
    slug: "spring-book",
    name: "Book Management",
    headline: "Spring Boot book and author CRUD with a full test suite.",
    description:
      "A Spring Boot book and author management app with JPA repositories, JSP views, and test coverage across both the service and repository layers.",
    domain: "foundations",
    tags: ["Java", "Spring Boot", "Full-Stack"],
    tech: ["Java", "Spring Boot", "JPA", "JSP", "JUnit"],
    year: 2025,
    weight: 1,
    github: gh("spring-book"),
  },
  {
    slug: "lld-assignment",
    name: "Bestsellers Analyser",
    headline: "Java CSV analysis of Amazon's top 50 bestsellers, 2009–2019.",
    description:
      "A Java program that reads and analyses Amazon's top 50 bestselling books from 2009 to 2019 out of a CSV dataset, split into model, dataset-reader, and driver layers.",
    domain: "foundations",
    tags: ["Java", "Systems", "Data"],
    tech: ["Java", "CSV Parsing"],
    year: 2025,
    weight: 1,
    github: gh("lld-assignment"),
  },
  {
    slug: "image-editor",
    name: "Image Editor",
    headline: "Image manipulation in pure Java — grayscale, blur, rotate.",
    description:
      "Various image manipulation operations implemented in pure Java with javax.imageio: grayscale conversion, brightness adjustment, rotation, and blurring.",
    domain: "foundations",
    tags: ["Java", "Systems"],
    tech: ["Java", "Java IO", "javax.imageio"],
    year: 2023,
    weight: 1,
    github: gh("image-editor"),
  },
  {
    slug: "aerofit-analysis",
    name: "Aerofit Sales Analysis",
    headline: "Exploratory case study on Aerofit treadmill sales.",
    description:
      "A case study analysing Aerofit sales data across Python's analysis stack — profiling customer segments, comparing product tiers, and visualising the drivers behind each purchase.",
    domain: "foundations",
    tags: ["Python", "Data"],
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter"],
    year: 2024,
    weight: 1,
    github: gh("aerofit-analysis"),
  },
  {
    slug: "rn-assignment-ishanavasthi",
    name: "Easy App",
    headline: "React Native unit converter with live conversion.",
    description:
      "A React Native (Expo) unit converter with live conversion for meters/feet and Celsius/Fahrenheit, numeric input validation, and a clean responsive UI.",
    domain: "foundations",
    tags: ["JavaScript", "React Native", "Full-Stack"],
    tech: ["React Native", "Expo", "JavaScript"],
    year: 2025,
    weight: 1,
    github: gh("rn-assignment-ishanavasthi"),
  },
  {
    slug: "OverloadingMVP",
    name: "Overloading",
    headline: "Unity game-jam prototype about not tipping over a loaded truck.",
    description:
      "A 3D Unity truck-simulator game-jam prototype with one focused mechanic: drive a top-heavy overloaded truck to the finish line without tipping. A raised centre of mass, lateral tip forces, and steering roll torque make aggressive driving lose.",
    domain: "foundations",
    tags: ["C#"],
    tech: ["C#", "Unity 6", "WebGL"],
    year: 2026,
    weight: 1,
    github: gh("OverloadingMVP"),
  },
] as const;

export const featuredProjects = projects.filter((p) => p.featured);

export function projectsByDomain(domain: DomainId) {
  return projects.filter((p) => p.domain === domain);
}
