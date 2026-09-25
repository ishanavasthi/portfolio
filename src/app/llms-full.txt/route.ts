import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import {
  ACTIVITY_SYNCED_AT,
  BIO,
  LLMS_HEADERS,
  demoteHeadings,
  domainsWithProjects,
  fullPosts,
  header,
  postUrl,
  profileLines,
  projectDetail,
  skillsSection,
} from "@/lib/llms";

export const dynamic = "force-static";

function aboutSection(): string {
  return ["## About", "", ...BIO.flatMap((p) => [p, ""]), ...profileLines()].join("\n");
}

function focusSection(): string {
  const lines = domainsWithProjects().map(
    ({ domain, list }) =>
      `- **${domain.label}** (${list.length} projects): ${domain.blurb}`,
  );
  return ["## Focus areas", "", ...lines].join("\n");
}

function projectsSection(): string {
  const groups = domainsWithProjects().map(({ domain, list }) =>
    [
      `## Projects: ${domain.label}`,
      "",
      domain.blurb,
      "",
      list.map(projectDetail).join("\n\n"),
    ].join("\n"),
  );
  return [
    `_${projects.length} projects. Commit activity synced from GitHub on ${ACTIVITY_SYNCED_AT.slice(0, 10)}._`,
    "",
    groups.join("\n\n"),
  ].join("\n");
}

function writingSection(): string {
  const posts = fullPosts();
  if (posts.length === 0) {
    return ["## Writing", "", "_No posts yet._"].join("\n");
  }
  const bodies = posts.map((p) =>
    [
      `### ${p.title}`,
      "",
      `- **URL:** ${postUrl(p.slug)}`,
      `- **Published:** ${p.date}`,
      `- **Reading time:** ${p.readingTime} min`,
      `- **Summary:** ${p.summary}`,
      "",
      demoteHeadings(p.content.trim(), 2),
    ].join("\n"),
  );
  return ["## Writing", "", bodies.join("\n\n---\n\n")].join("\n");
}

function buildLlmsFullTxt(): string {
  return [
    header(),
    "",
    `The complete portfolio of ${site.name} in one document: bio, skills, every project in full, and every blog post in full. The short index is at ${site.url}/llms.txt.`,
    "",
    aboutSection(),
    "",
    focusSection(),
    "",
    skillsSection(),
    "",
    projectsSection(),
    "",
    writingSection(),
    "",
  ].join("\n");
}

export function GET() {
  return new Response(buildLlmsFullTxt(), { headers: LLMS_HEADERS });
}
