import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { getAllPosts, getPost } from "@/lib/blog";
import {
  BIO,
  domainsWithProjects,
  header,
  postUrl,
  profileLines,
  projectDetail,
  skillsSection,
} from "@/lib/llms";

/**
 * Markdown versions of the HTML pages, served to clients that send
 * `Accept: text/markdown` and at `<page>.md` (see src/middleware.ts). Built
 * from the same data as the pages and the llms files.
 *
 * Keys are page paths without the leading slash ("" is the home page).
 */
export function markdownPaths(): string[] {
  return ["", "projects", "blog", ...getAllPosts().map((p) => `blog/${p.slug}`)];
}

/** The HTML page a Markdown path stands for. */
export function htmlUrl(path: string): string {
  return path ? `${site.url}/${path}` : `${site.url}/`;
}

/** The `.md` URL of a page path. Home is `/index.md`. */
export function markdownUrl(path: string): string {
  return `${site.url}/${path || "index"}.md`;
}

function home(): string {
  return [
    header(),
    "",
    ...BIO.flatMap((p) => [p, ""]),
    ...profileLines(),
    "",
    skillsSection(),
    "",
    `## Projects (${projects.length})`,
    "",
    ...domainsWithProjects().map(
      ({ domain, list }) => `- **${domain.label}** (${list.length}): ${domain.blurb}`,
    ),
    "",
    `Full list: ${site.url}/projects.md`,
    "",
    "## Writing",
    "",
    ...getAllPosts().map((p) => `- [${p.title}](${postUrl(p.slug)}.md) (${p.date})`),
    "",
  ].join("\n");
}

function projectsPage(): string {
  return [
    `# Projects - ${site.name}`,
    "",
    `${projects.length} projects across agent systems, RAG, RL environments, developer tools, and full-stack web, grouped by domain.`,
    "",
    ...domainsWithProjects().flatMap(({ domain, list }) => [
      `## ${domain.label}`,
      "",
      domain.blurb,
      "",
      list.map(projectDetail).join("\n\n"),
      "",
    ]),
  ].join("\n");
}

function blogIndex(): string {
  const posts = getAllPosts();
  return [
    `# Blog - ${site.name}`,
    "",
    "Notes on AI engineering, LLM apps, and developer tooling.",
    "",
    ...(posts.length === 0
      ? ["_No posts yet._"]
      : posts.flatMap((p) => [
          `## [${p.title}](${postUrl(p.slug)}.md)`,
          "",
          `${p.date} · ${p.readingTime} min read`,
          "",
          p.summary,
          "",
        ])),
  ].join("\n");
}

function post(slug: string): string | null {
  const p = getPost(slug);
  if (!p) return null;
  return [
    `# ${p.title}`,
    "",
    `- **Author:** ${site.name} (${site.url})`,
    `- **Published:** ${p.date}`,
    `- **URL:** ${postUrl(p.slug)}`,
    "",
    `> ${p.summary}`,
    "",
    p.content.trim(),
    "",
  ].join("\n");
}

export function markdownFor(path: string): string | null {
  if (path === "") return home();
  if (path === "projects") return projectsPage();
  if (path === "blog") return blogIndex();
  const match = path.match(/^blog\/([^/]+)$/);
  return match ? post(match[1]) : null;
}
