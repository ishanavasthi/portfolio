import { site } from "@/lib/site";

/**
 * A route handler instead of `app/robots.ts`, because Next's robots metadata
 * type can't emit the `Content-Signal` line.
 *
 * AI crawlers are named explicitly, not just covered by `*`, so the opt-in is
 * unambiguous to bots that look for their own user-agent group.
 */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google, Apple, Meta, ByteDance, Amazon
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Bytespider",
  "Amazonbot",
  // Others
  "CCBot",
  "cohere-ai",
  "MistralAI-User",
  "DuckAssistBot",
];

export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-agent: *",
    // contentsignals.org: allow search indexing and use as AI answer input.
    "Content-Signal: search=yes, ai-input=yes",
    "Allow: /",
    "",
    ...AI_CRAWLERS.map((ua) => `User-agent: ${ua}`),
    "Allow: /",
    "",
    `Sitemap: ${site.url}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
