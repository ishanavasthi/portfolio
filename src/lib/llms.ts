import { site, socials } from "@/lib/site";
import { activityOf, projectsByDomain, type Project } from "@/lib/projects";
import { getAllPosts, getPost } from "@/lib/blog";
import { SKILLS } from "@/lib/skills";
import { ACTIVITY_SYNCED_AT } from "@/lib/project-activity";
import { ARCHIVED_DOMAINS, DOMAINS } from "@/lib/taxonomy";

/**
 * Shared builders for /llms.txt (the index) and /llms-full.txt (everything in
 * one document). Both are generated from the same data the pages render, so
 * they can't drift from the site.
 */

export const LLMS_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=0, must-revalidate",
} as const;

const email = socials.email.replace(/^mailto:/, "");

/** Mirrors the hero and About copy (hero.tsx, about.tsx). */
export const BIO = [
  "I'm a CS undergrad at BITS Pilani working on AI engineering. I build the layer between raw language models and working products: agent pipelines, RAG systems, and the observability and evals that make them reliable enough to ship.",
  "In practice that means pipelines that retrieve the right context, agents that take actions, and tooling that makes the whole thing reliable. I care about testing things properly, making systems easy to work with, and shipping stuff that holds up in the real world.",
] as const;

export function header(): string {
  return [`# ${site.name}`, "", `> ${site.title} — ${site.description}`].join("\n");
}

export function profileLines(): string[] {
  return [
    `- **Role:** ${site.title}`,
    `- **Based in / studying at:** ${site.location}`,
    `- **Status:** ${site.status}`,
    `- **Email:** ${email}`,
    `- **Website:** ${site.url}`,
    `- **GitHub:** ${socials.github}`,
    `- **LinkedIn:** ${socials.linkedin}`,
  ];
}

export function skillsSection(): string {
  const lines = SKILLS.map((category) => {
    const chips = category.chips.map((c) => c.label).join(", ");
    const proof = category.proof();
    const proofText = proof.secondaryValue
      ? `${proof.value} ${proof.unit}, ${proof.secondaryValue} ${proof.secondaryUnit}`
      : `${proof.value} ${proof.unit}`;
    return `- **${category.name}**${category.sub ? ` (${category.sub})` : ""}: ${chips} — ${proofText}`;
  });
  return ["## Skills", "", ...lines].join("\n");
}

/** Code first: most "live" links are demo videos, the repo is the substance. */
export function primaryLink(p: Project): string {
  return p.github ?? p.live ?? `${site.url}/projects`;
}

/** Domains in display order, archived ones last, empty ones dropped. */
export function domainsWithProjects() {
  return [...DOMAINS]
    .sort(
      (a, b) =>
        Number(ARCHIVED_DOMAINS.includes(a.id)) -
        Number(ARCHIVED_DOMAINS.includes(b.id)),
    )
    .map((domain) => ({ domain, list: projectsByDomain(domain.id) }))
    .filter(({ list }) => list.length > 0);
}

export function projectDetail(p: Project): string {
  const activity = activityOf(p.slug);
  const facts = [
    `- **Year:** ${p.year}${p.featured ? " (featured)" : ""}`,
    `- **Tags:** ${p.tags.join(", ")}`,
    `- **Tech:** ${p.tech.join(", ")}`,
    p.github ? `- **Source:** ${p.github}` : null,
    p.live ? `- **Live / demo:** ${p.live}` : null,
    activity
      ? `- **Activity:** ${activity.commits} commits, ${activity.started.slice(0, 10)} → ${activity.updated.slice(0, 10)}`
      : null,
  ].filter((line): line is string => line !== null);

  return [`### ${p.name}`, "", `_${p.headline}_`, "", p.description, "", ...facts].join(
    "\n",
  );
}

/**
 * Pushes a post's headings down so they nest under its `###` title instead of
 * competing with the document's own `##` sections. Fenced code is left alone
 * so shell comments don't turn into headings.
 */
export function demoteHeadings(markdown: string, by: number): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      if (inFence || !/^#{1,6}\s/.test(line)) return line;
      const level = line.match(/^#+/)![0].length;
      return "#".repeat(Math.min(6, level + by)) + line.slice(level);
    })
    .join("\n");
}

export function postUrl(slug: string): string {
  return `${site.url}/blog/${slug}`;
}

export function fullPosts() {
  return getAllPosts()
    .map((meta) => getPost(meta.slug))
    .filter((p) => p !== null);
}

export { ACTIVITY_SYNCED_AT, email };
