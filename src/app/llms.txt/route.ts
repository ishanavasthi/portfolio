import { site, socials } from "@/lib/site";
import { projects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";
import {
  BIO,
  LLMS_HEADERS,
  domainsWithProjects,
  header,
  postUrl,
  primaryLink,
  profileLines,
  skillsSection,
} from "@/lib/llms";

export const dynamic = "force-static";

function projectsSection(): string {
  const groups = domainsWithProjects().map(({ domain, list }) =>
    [
      `### ${domain.label}`,
      "",
      ...list.map((p) => `- [${p.name}](${primaryLink(p)}): ${p.headline}`),
    ].join("\n"),
  );
  return [`## Projects (${projects.length})`, "", groups.join("\n\n")].join("\n");
}

function writingSection(): string {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return ["## Writing", "", "_No posts yet._"].join("\n");
  }
  const lines = posts.map(
    (p) => `- [${p.title}](${postUrl(p.slug)}): ${p.summary} (${p.date})`,
  );
  return ["## Writing", "", ...lines].join("\n");
}

function docsSection(): string {
  return [
    "## Docs",
    "",
    `- [Full context](${site.url}/llms-full.txt): every project's full description, stack, links and commit activity, plus the complete text of every blog post, in one file`,
    `- [Projects page](${site.url}/projects): the filterable project archive`,
    `- [Sitemap](${site.url}/sitemap.xml)`,
  ].join("\n");
}

function optionalSection(): string {
  return [
    "## Optional",
    "",
    `- [GitHub](${socials.github})`,
    `- [LinkedIn](${socials.linkedin})`,
    `- [Email](${socials.email})`,
  ].join("\n");
}

function buildLlmsTxt(): string {
  return [
    header(),
    "",
    BIO[0],
    "",
    ...profileLines(),
    "",
    docsSection(),
    "",
    skillsSection(),
    "",
    projectsSection(),
    "",
    writingSection(),
    "",
    optionalSection(),
    "",
  ].join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), { headers: LLMS_HEADERS });
}
