import type { DomainId, Tag } from "@/lib/taxonomy";
import { PROJECT_ACTIVITY, type ProjectActivity } from "@/lib/project-activity";

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
  /**
   * Optional hero screenshot, served from /public/projects. Rendered at the
   * top of the cascade card with a 16/10 crop from the top edge.
   */
  image?: {
    src: string;
    alt: string;
  };
  /**
   * Optional short silent loop, served from /public/projects. Takes the same
   * 16/10 slot as `image` (and wins over it). The poster is a frame that reads
   * on its own: it is all that reduced-motion and static-capture visitors get,
   * and the video file is never requested for them.
   */
  video?: {
    mp4: string;
    webm?: string;
    poster: string;
    alt: string;
  };
};

const gh = (slug: string) => `https://github.com/ishanavasthi/${slug}`;

export const projects: readonly Project[] = [
  // ─── Agents & LLM Systems ──────────────────────────────────────────────
  {
    slug: "agent-store",
    name: "Agent Store",
    headline: "Merchant-side agentic commerce: messy captions in, buyable MCP catalog out.",
    description:
      "Turns long-tail sellers' Instagram and Hinglish captions into a catalog an AI buyer agent can buy from over MCP (6 buyer tools, 8 merchant tools) plus a REST twin. Extraction runs server-side and holds the whole product for the merchant if any field scores under 0.90; stock is never invented and prices are parsed by deterministic code, not the model. Purchases run a signed intent → cart → payment mandate chain with per-agent caps and per-purchase budgets on Razorpay test rails, and every check runs before the gateway is called, so a refusal means no money moved. Each decision lands in an append-only audit log that an independent rule-auditor recomputes: 30/30 protocol scenarios, 0 violations over 250 audit events, and 96–100% field accuracy on 28 hand-labelled captions. A real Claude buyer agent has completed a purchase end to end on test rails.",
    domain: "agents",
    tags: ["TypeScript", "MCP", "Claude", "Evals", "Full-Stack"],
    tech: ["TypeScript", "Node 22", "Express", "MCP SDK", "Drizzle", "Neon Postgres", "Ed25519", "Razorpay", "Zod", "React", "Vite", "Vitest"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("agent-store"),
    live: "https://link.ishanavasthi.in/agent-store-live",
    image: {
      src: "/projects/agent-store-viewer-order-replay.png",
      alt: "An order replayed event by event in the Agent Store audit viewer",
    },
    video: {
      mp4: "/projects/agent-store.mp4",
      webm: "/projects/agent-store.webm",
      poster: "/projects/agent-store-poster.webp",
      alt: "Agent Store refusing a buyer agent's MCP payment: the ₹1,299.00 cart exceeds the signed ₹1,000.00 budget, so the payment gateway is never called and OVER_BUDGET is appended to the audit log",
    },
  },
  {
    slug: "preflight",
    name: "Preflight",
    headline: "CI gate that catches AI agent regressions before they ship.",
    description:
      "A CI gate that catches agent behaviour regressions on the pull request that causes them, in the common case where unit tests still pass because only a prompt changed. Six per-task metrics (cost, tokens, p95 latency, tool calls, retrieval hops, success rate), each with its own threshold, are compared baseline vs candidate on every commit, and the biggest mover is attributed to a single eval case with a deep link to its trace in SigNoz. Model responses are recorded as committed cassettes, so the suite replays offline and byte-identically with no API key; GitHub Actions fails the PR check and posts the metric table. A diagnosis agent queries SigNoz over MCP to explain each failed gate, and its own investigation is traced too.",
    domain: "agents",
    tags: ["Python", "Claude", "MCP", "Docker", "Evals", "DevTools"],
    tech: ["Python", "OpenTelemetry", "SigNoz", "ClickHouse", "MCP", "Claude API", "Docker Compose", "GitHub Actions", "YAML"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("preflight"),
    live: "https://link.ishanavasthi.in/preflight-video",
    video: {
      mp4: "/projects/preflight.mp4",
      webm: "/projects/preflight.webm",
      poster: "/projects/preflight-poster.webp",
      alt: "Preflight's PR comment: five of six agent metrics over threshold, p95 latency up 167%, biggest mover damaged-item linked to its SigNoz trace",
    },
  },
  {
    slug: "clinicflow",
    name: "ClinicFlow",
    headline: "Real-time AI voice receptionist for clinics, with a live operator dashboard.",
    description:
      "A real-time voice agent that answers a patient call end to end (intake, booking, FAQs, routing to a department) while an operator dashboard mirrors the call live off the same LiveKit room. Every state change is an LLM function tool. A red-flag symptom skips intake and routes the call to Emergency, which locks out further scheduling, and deterministic guardrails sit above the model: no times are offered before intake is complete, and no booking is claimed that a tool didn't confirm. Three pipelines (cascaded on Groq, cascaded on OpenAI, or gpt-realtime speech-to-speech) swap by env var with tools and guardrails unchanged, and every turn's latency is broken down stage by stage. An eval harness of 20 fault-injected scenarios checks the database and tool trace before an LLM judge scores a frozen rubric; bounded policy edits took strict passes from 14/80 to 60/80, and 5/20 to 16/20 on held-out scenarios.",
    domain: "agents",
    tags: ["Python", "TypeScript", "LiveKit", "FastAPI", "Groq", "Claude", "Next.js", "Voice AI", "Evals", "Full-Stack"],
    tech: ["Python", "LiveKit Agents", "Deepgram STT", "Groq", "OpenAI Realtime", "Rumik TTS", "Claude (eval judge)", "FastAPI", "SQLModel", "Next.js", "Zustand", "TanStack Query"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("clinicflow"),
    live: "https://link.ishanavasthi.in/clinicflow-video",
    image: {
      src: "/projects/clinicflow-dashboard.webp",
      alt: "ClinicFlow operator dashboard: receptionist status, simulate-call console, and department roster",
    },
    video: {
      mp4: "/projects/clinicflow.mp4",
      webm: "/projects/clinicflow.webm",
      poster: "/projects/clinicflow-poster.webp",
      alt: "ClinicFlow mid-intake: the caller reports severe chest pain and trouble breathing, the agent calls route_to_department(\"Emergency\"), the emergency lock engages, and the receptionist tells the caller to call their local emergency number",
    },
  },
  {
    slug: "agentgrid",
    name: "AgentGrid",
    headline: "Nine Gemini agents take an issue from bug report to merged PR, unattended.",
    description:
      "Built at the Google DeepMind Bangalore hackathon: a pipeline of 9 Gemini agents that takes a software issue from report to tested, merged pull request with no human in the loop. Planner, Coder, Reviewer, Integrator, and Tester agents hand off through a structured ledger, parallel coders work in isolated git worktrees, and an adversarial Breaker/Fixer TDD loop plus a Computer Use browser verifier check the result against the real unittest suite. The backend swaps between a mock, Gemini function calling, and Gemini Managed Agents, all behind a live dashboard.",
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
    headline: "Multi-tenant portfolio analyzer for Indian investors, narrated by agents that can't invent a number.",
    description:
      "Sign in with Clerk, link an IND Money account over MCP, and get net worth, allocation, holdings, and a nightly net-worth trend, with an AI overview written by a fan-out of specialist agents. Every figure is computed in Python first, and any digit an agent writes freehand trips a scripted fallback, so the narrative can never fabricate one. Per-user broker tokens are Fernet-encrypted in Neon Postgres; a labelled paper-trading Lab runs the multi-agent research desk as a simulation, never mixed with real holdings.",
    domain: "agents",
    tags: ["Python", "TypeScript", "LangGraph", "FastAPI", "Next.js", "MCP", "Multi-Agent", "Full-Stack"],
    tech: ["LangGraph", "FastAPI", "Next.js", "TypeScript", "Clerk", "Neon Postgres", "SQLModel + Alembic", "IND Money MCP", "OpenAI", "Groq"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("alphadesk"),
    live: "https://link.ishanavasthi.in/alphadesk",
    image: {
      src: "/projects/alphadesk-demo.png",
      alt: "AlphaDesk demo dashboard: net worth cards, AI overview, and allocation breakdown",
    },
    video: {
      mp4: "/projects/alphadesk.mp4",
      webm: "/projects/alphadesk.webm",
      poster: "/projects/alphadesk-poster.webp",
      alt: "AlphaDesk demo portfolio: the AI overview's overall-return sentence with +₹88,905 and +8.4% as metric chips bound to the computed Overall return card",
    },
  },
  {
    slug: "swiggy-claw",
    name: "Swiggy Claw",
    headline: "Order food, groceries, and tables in plain English, built against Swiggy's MCP manifest.",
    description:
      "A natural-language agent for food ordering, grocery shopping, and restaurant table booking, built against Swiggy's published MCP manifest: 28 tools across three service surfaces for roughly 7,100 tokens per request. Every backend call goes through a single guard function, which enforces a hard ₹1,000 ceiling on food carts because cash-on-delivery orders can't be cancelled. The LLM provider (NVIDIA NIM or Groq) and the transport (in-process mock MCP server or StreamableHTTP) are swappable seams behind a streaming Next.js chat UI. The source is private; the case study is public.",
    domain: "agents",
    tags: ["TypeScript", "Next.js", "MCP", "Groq", "Full-Stack"],
    tech: ["Next.js 16", "React 19", "TypeScript", "MCP SDK", "NVIDIA NIM", "Groq", "Zustand", "Tailwind CSS", "SSE"],
    year: 2026,
    featured: true,
    weight: 2,
    live: "https://link.ishanavasthi.in/swiggy-claw",
  },
  {
    slug: "reviewgrid",
    name: "ReviewGrid",
    headline: "Agent-callable code review skill returning a deterministic verdict.",
    description:
      "A backend code-review skill any agent or webhook can call: POST a raw diff or a PR URL and get back a pass / needs_changes / fail verdict with line-anchored issues. A deterministic ESLint pass (23 fragment-safe rules, JavaScript and TypeScript) runs beside a model pass, and the verdict comes from fixed rules, never the model's own judgment; a diff-keyed cache means the same diff always gets the same answer. Five Deno functions on Base44, with a GitHub webhook that verifies the HMAC signature and posts the verdict on the PR.",
    domain: "agents",
    tags: ["TypeScript", "Deno", "DevTools", "Evals"],
    tech: ["TypeScript", "Deno", "Base44", "ESLint", "GitHub Webhooks", "Agent Skills"],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("reviewgrid"),
    live: "https://reviewgrid-915b1bbc.base44.app",
  },
  {
    slug: "panorama",
    name: "Panorama",
    headline: "Reviews a pull request using evidence from the other repos in the org.",
    description:
      "Built a CLI and watcher that reviews a GitHub PR against its sibling repositories — a rename that breaks a client, a helper that already exists next door, an endpoint that ignores an org convention — citing repo/path:line and never copying source across a trust boundary. Four independent retrieval channels (lexical, dependency graph, symbol index, HTTP contract) are rank-fused to orient the model, then every citation it returns is re-checked against the real files, so an unsupported finding is discarded rather than downgraded. V2 turned quality into a number gated on every commit: on an 18-case seeded corpus over six repos and three languages, recall@1 rose from a 0.750 lexical baseline to 1.000, and 54 live reviews produced zero false positives on the negative controls, with category accuracy (0.718) and run-to-run flake (22%) reported alongside.",
    domain: "agents",
    tags: ["Python", "Claude", "DevTools", "Evals"],
    tech: ["Python", "Typer", "Pydantic", "uv", "Claude Code CLI", "GitHub CLI", "git"],
    year: 2026,
    weight: 2,
    github: "https://github.com/ishanavasthi/panorama/tree/v2",
    live: "https://link.ishanavasthi.in/panorama-video",
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
      "Built for the HackerRank Orchestrate 24-hour hackathon: a multimodal router that decides which WhatsApp messages interrupt you, which wait for a digest, and which stay muted, reasoning over text, 20 image posters (Gemini OCR), and 13 voice notes (Groq Whisper) with per-user history, group dynamics, and sender trust. A safety gate runs first and deliberately blind to engagement history, so a scam can't be argued down by a strong relationship. Evidence retrieval and confidence are deterministic code, not model output, and all 114 model responses are committed, so the run reproduces byte-for-byte with no API key set. 93% action accuracy on the 30 labelled sample rows, standard library only.",
    domain: "agents",
    tags: ["Python", "Claude", "Gemini", "Groq", "Evals", "Data"],
    tech: ["Python", "Claude Haiku", "NVIDIA NIM", "Gemini OCR", "Groq Whisper", "Committed response cache"],
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
    slug: "lenny-growth-assistant",
    name: "Lenny Growth Assistant",
    headline: "Grounded answers over 301 Lenny's Podcast episodes, cited to the exact YouTube second.",
    description:
      "Conversational assistant over 15,983 passages from Lenny's Podcast: hybrid retrieval with RRF reranking over pgvector answers product and growth questions with citations linking to exact YouTube timestamps. Ships a Ship 30 essay skill, versioned Markdown and HTML artifacts with a sandboxed viewer, and a 9/10 golden eval set. Runs on Anthropic, OpenAI, OpenRouter, or local Ollama with zero keys.",
    domain: "rag",
    tags: ["Python", "TypeScript", "Claude", "RAG", "Evals", "Full-Stack", "Data"],
    tech: ["Python", "FastAPI", "Claude Agent SDK", "pgvector", "LiteLLM", "React", "Vite", "Docker"],
    year: 2026,
    weight: 2,
    github: gh("lenny-growth-assistant"),
  },
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
      "An OpenEnv-compliant RL environment simulating candidate pipeline triage: an agent reviews synthetic developer profiles across GitHub, LeetCode, Kaggle, and resume signals and makes shortlisting decisions under a step budget that tightens from 4 to 1.5 steps per candidate across three tasks. Profiles come from seeded distributions with ground-truth labels and controlled noise, fully deterministic on reset, and a fairness checker penalises the largest shortlist-rate gap between origin groups. 35 tests, Dockerised FastAPI. Built for the OpenEnv Hackathon by Meta x Hugging Face.",
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
    tech: ["TypeScript", "Chrome MV3", "IndexedDB", "Hono", "Zod", "Postgres", "Vite", "Vitest", "Playwright", "ULID"],
    year: 2026,
    weight: 2,
    github: gh("context-lens"),
  },
  {
    slug: "resume-tailor",
    name: "Resume Tailor",
    headline: "Agent skill that tailors a one-page LaTeX resume to a job description without inventing facts.",
    description:
      "An Agent Skills package for Claude Code, Codex, Cursor, and other agents. Setup reads your GitHub repositories through gh and drafts a facts entry per project for you to confirm; tailoring then rewords bullets for a job description but can only make claims that trace back to that file. Python scripts compile the page, check it is still one page with no overfull boxes, render it to an image for the agent to look at, and measure an overflow in lines so you choose every cut. CI runs the suite against both pdflatex and tectonic.",
    domain: "tools",
    tags: ["Python", "Claude", "DevTools"],
    tech: ["Python", "Agent Skills", "LaTeX", "tectonic", "pypdf", "GitHub CLI", "pytest"],
    year: 2026,
    weight: 2,
    github: gh("resume-tailor"),
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
      "An in-memory key-value cache server on Python asyncio, speaking a custom wire protocol over raw TCP. Layered into network, protocol, and cache tiers with an O(1) store, LRU eviction, and TTL expiry, plus Docker packaging and EC2 deploy scripts. Load-tested on AWS EC2: 13,348 req/s across 100 concurrent connections, 100,000 requests with none failed, p95 8.1 ms.",
    domain: "tools",
    tags: ["Python", "Docker", "Systems"],
    tech: ["Python", "asyncio", "TCP Sockets", "Docker", "AWS", "Shell"],
    year: 2026,
    weight: 2,
    github: gh("kv-cache"),
  },

  // ─── Full-Stack & Web ──────────────────────────────────────────────────
  {
    slug: "verdict-desk",
    name: "Verdict Desk",
    headline:
      "Grades student code in a hardened Docker sandbox, and no AI answer reaches a student until a teacher approves it.",
    description:
      "An AI code-grading and doubt-resolution portal built around what happens when the inputs are hostile. Student submissions run in a network-isolated, resource-capped throwaway container per submission — the API deliberately stays on the host rather than mounting the Docker socket into a container. AI drafts answers to student doubts, but the draft → pending → approved state machine is enforced by Postgres triggers, not application code, so an illegal transition fails at the database even if every layer above it is compromised. Ships with an abuse suite that proves containment: fork bombs, infinite loops, network calls, and 100MB of stdout all get contained without moving API memory.",
    domain: "web",
    tags: ["TypeScript", "Next.js", "Docker", "Full-Stack", "Systems", "Evals"],
    tech: [
      "Next.js 15",
      "NestJS 11",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Docker",
      "pnpm workspaces",
    ],
    year: 2026,
    featured: true,
    weight: 2,
    github: gh("verdict-desk"),
  },
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
    headline: "Event discovery and ticketing app: I led the team and wrote the API behind its React Native client.",
    description:
      "A four-person BITS Pilani capstone that I led. I wrote the original Express and MongoDB backend: JWT middleware, auth with bcrypt and Google Sign-In, event creation with validation, and a two-step Razorpay checkout that creates the order and then writes the booking. I also set up the CI that lints and runs the integration tests against an ephemeral Mongo container. A teammate built the React Native (Expo) client.",
    domain: "web",
    tags: ["JavaScript", "React Native", "Full-Stack"],
    tech: ["Node.js", "Express 5", "MongoDB", "Mongoose", "JWT", "Razorpay", "GitHub Actions", "React Native", "Expo"],
    year: 2026,
    weight: 2,
    github: gh("EventHive"),
    live: "https://link.ishanavasthi.in/eventhive-video",
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

  // ─── Foundations ───────────────────────────────────────────────────────
  {
    slug: "Product-Service",
    name: "Product Service",
    headline: "Spring Boot product catalogue microservice with Flyway migrations.",
    description:
      "A Spring Boot product catalogue microservice: one ProductService interface with two interchangeable implementations (JPA over MySQL, and the FakeStore API) chosen through Spring DI, so controllers don't change when the data source does. Flyway migrations, paginated queries, a global exception handler, Eureka registration, Mockito controller tests, and Kubernetes manifests.",
    domain: "foundations",
    tags: ["Java", "Spring Boot", "Docker", "Systems"],
    tech: ["Java", "Spring Boot", "JPA", "MySQL", "Flyway", "Eureka", "Docker", "Kubernetes", "JUnit", "Mockito"],
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
      "A business case study on 180 Aerofit treadmill buyers across three models, using descriptive statistics and probability: univariate and bivariate analysis, marginal and conditional probabilities, per-model customer profiles, and recommendations drawn from them.",
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

/**
 * Selected-work order. Projects with a screenshot lead — they carry the
 * visual weight of the grid — and everything else keeps its curated array
 * order behind them (sort is stable). Single source for the home ledger and
 * the /projects hero grid so both surfaces agree.
 */
export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));

export function projectsByDomain(domain: DomainId) {
  return projects.filter((p) => p.domain === domain);
}

// ─── Activity ────────────────────────────────────────────────────────────────
//
// `year` is a curated field and nearly everything here says 2026, which makes
// it useless for the one question a visitor actually has: what is he working on
// *now*. Commit dates answer that. They come from GitHub via
// `npm run sync:github`, generated into project-activity.ts and committed, so
// nothing here touches the network at build or request time.

/** Commit span for a project, or undefined if the repo is private/unreachable. */
export function activityOf(slug: string): ProjectActivity | undefined {
  return PROJECT_ACTIVITY[slug];
}

/**
 * Most-recently-committed first. Undated projects sink below every dated one
 * rather than jumping to the top on an empty sort key, and fall back to the
 * curated year among themselves.
 */
export const projectsByRecency: readonly Project[] = [...projects].sort((a, b) => {
  const x = activityOf(a.slug)?.updated;
  const y = activityOf(b.slug)?.updated;
  if (x && y) return y.localeCompare(x);
  if (x) return -1;
  if (y) return 1;
  return b.year - a.year || a.name.localeCompare(b.name);
});

/** Days since the last commit, or null when the project has no activity data. */
export function daysSinceUpdate(slug: string, now = Date.now()): number | null {
  const updated = activityOf(slug)?.updated;
  if (!updated) return null;
  return (now - new Date(updated).getTime()) / 86_400_000;
}

/**
 * Committed within the fortnight. Two weeks is long enough to survive a busy
 * week away from a repo and short enough that "active" still means something.
 */
export const ACTIVE_WINDOW_DAYS = 14;

export function isActive(slug: string, now = Date.now()): boolean {
  const days = daysSinceUpdate(slug, now);
  return days !== null && days < ACTIVE_WINDOW_DAYS;
}

/**
 * Compact age label — "today", "3d ago", "5mo ago". Deliberately coarse: this
 * sits in a narrow column next to a project name, and nobody needs the hour.
 */
export function lastTouchedLabel(slug: string, now = Date.now()): string | null {
  const days = daysSinceUpdate(slug, now);
  if (days === null) return null;
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 7) return `${Math.floor(days)}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}
