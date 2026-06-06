import { site, socials } from "@/lib/site";
import { projects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

function projectsSection(): string {
  const lines = projects.map((p) => {
    const url = p.live ?? p.github ?? site.url;
    return `- [${p.name}](${url}): ${p.description}`;
  });
  return ["## Projects", "", ...lines].join("\n");
}

function writingSection(): string {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return ["## Writing", "", "_No posts yet._"].join("\n");
  }
  const lines = posts.map(
    (p) =>
      `- [${p.title}](${site.url}/blog/${p.slug}): ${p.summary} (${p.date})`,
  );
  return ["## Writing", "", ...lines].join("\n");
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
    `# ${site.name}`,
    "",
    `> ${site.title} — ${site.description}`,
    "",
    "Personal portfolio. Source of truth for projects and writing.",
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
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
