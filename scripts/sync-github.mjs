#!/usr/bin/env node
/**
 * GitHub sync for the project cascade. Does two things:
 *
 * 1. Drift detection. The cascade is hand-curated on purpose — the written copy
 *    is better than repo descriptions, and static data keeps /projects
 *    prerendered. The cost of curation is that a new repo can sit unlisted for
 *    months. This is the safety net: it fails when GitHub has an authored repo
 *    the portfolio doesn't know about, or when projects.ts points at a repo
 *    that's gone.
 *
 * 2. Activity capture. Curated `year` fields are too coarse to answer "what is
 *    he working on right now" — most of them say 2026. So we read the real
 *    first and last commit dates off each repo's default branch and generate
 *    src/lib/project-activity.ts. Committing that file keeps the site fully
 *    static: no GitHub calls at build or request time, no rate limits, no
 *    token in the deploy environment.
 *
 * Usage: npm run sync:github        (requires the `gh` CLI, authenticated)
 */

import { execFile, execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OWNER = "ishanavasthi";
const ACTIVITY_FILE = join(root, "src/lib/project-activity.ts");

/**
 * Repos deliberately kept off the portfolio. Each needs a reason so future-me
 * doesn't have to re-derive the call.
 */
const EXCLUDED = {
  itube: "not original work — re-upload of alexta69/metube",
  "sample-typesript-app": "scratch app, nothing to show",
  "resume-builder": "empty repo",
  "lld-assignment2": "empty repo",
  ishanavasthi: "GitHub profile README",
};

function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

function listedSlugs() {
  const source = readFileSync(join(root, "src/lib/projects.ts"), "utf8");
  return new Set([...source.matchAll(/^\s*slug: "([^"]+)",$/gm)].map((m) => m[1]));
}

function authoredRepos() {
  const raw = gh([
    "api",
    "user/repos?affiliation=owner&per_page=100",
    "--paginate",
    "--jq",
    ".[] | select(.fork==false) | select(.private==false) | {name, pushed_at, stargazers_count, language} | @json",
  ]);
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
}

/**
 * First and last commit on a repo's default branch, plus the commit count.
 *
 * `pushed_at` is the obvious candidate for "last touched" and the wrong one:
 * it moves for branch deletes and tag pushes, and it says nothing about when a
 * project started. The commits API gives both ends. Paginating at per_page=1
 * makes the Link header's `rel="last"` page number the commit count, so the
 * first commit is one extra request away instead of a full history walk.
 */
async function commitSpan(slug) {
  const { stdout } = await execFileAsync(
    "gh",
    ["api", `repos/${OWNER}/${slug}/commits?per_page=1`, "-i"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  );
  const split = stdout.indexOf("\r\n\r\n");
  const headers = stdout.slice(0, split);
  const head = JSON.parse(stdout.slice(split + 4));
  if (!Array.isArray(head) || head.length === 0) return null; // empty repo

  const last = /[?&]page=(\d+)>; rel="last"/.exec(headers);
  const commits = last ? Number(last[1]) : 1;

  let first = head[0];
  if (commits > 1) {
    const tail = await execFileAsync(
      "gh",
      ["api", `repos/${OWNER}/${slug}/commits?per_page=1&page=${commits}`],
      { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
    );
    first = JSON.parse(tail.stdout)[0];
  }

  // committer.date, not author.date: a rebase or a cherry-pick can carry an
  // author date from months ago, which would misreport an active repo as cold.
  return {
    started: first.commit.committer.date,
    updated: head[0].commit.committer.date,
    commits,
  };
}

/** Bounded concurrency — the commits API is the strictest thing we hit here. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const i = cursor++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

async function writeActivity(slugs) {
  const entries = await mapLimit(slugs, 6, async (slug) => {
    try {
      return [slug, await commitSpan(slug)];
    } catch {
      return [slug, null];
    }
  });

  const found = entries.filter(([, span]) => span);
  // Newest first, so the generated file reads as a changelog of what's live.
  found.sort((a, b) => b[1].updated.localeCompare(a[1].updated));

  const body = found
    .map(
      ([slug, s]) =>
        `  ${JSON.stringify(slug)}: { started: "${s.started}", updated: "${s.updated}", commits: ${s.commits} },`,
    )
    .join("\n");

  writeFileSync(
    ACTIVITY_FILE,
    `// GENERATED by scripts/sync-github.mjs — do not edit by hand.
// Run \`npm run sync:github\` to refresh.

export type ProjectActivity = {
  /** First commit on the default branch (ISO 8601). */
  started: string;
  /** Most recent commit on the default branch (ISO 8601). */
  updated: string;
  /** Commits on the default branch at sync time. */
  commits: number;
};

/** When this file was last regenerated. Rendered as the "as of" in the UI. */
export const ACTIVITY_SYNCED_AT = "${new Date().toISOString()}";

/** Keyed by project slug, which is also the GitHub repo name. */
export const PROJECT_ACTIVITY: Readonly<Record<string, ProjectActivity>> = {
${body}
};
`,
    "utf8",
  );

  return {
    dated: new Set(found.map(([slug]) => slug)),
    missed: entries.filter(([, span]) => !span).map(([slug]) => slug),
  };
}

const listed = listedSlugs();
const repos = authoredRepos();

console.log(
  `${repos.length} authored public repos · ${listed.size} in projects.ts · ` +
    `${Object.keys(EXCLUDED).length} deliberately excluded`,
);

// Dated first, because reaching a repo's commits is the real liveness test.
// `authoredRepos()` intentionally skips forks, so a listed fork we've since
// made our own would otherwise read as deleted.
const { dated, missed } = await writeActivity([...listed]);
console.log(
  `\nWrote src/lib/project-activity.ts — ${dated.size} repos dated` +
    (missed.length ? `, ${missed.length} unreachable` : ""),
);

const missing = repos.filter((r) => !listed.has(r.name) && !(r.name in EXCLUDED));

if (missed.length) {
  console.log("\nIn projects.ts but unreachable on GitHub (renamed, deleted, private, or empty):");
  for (const slug of missed) console.log(`  - ${slug}`);
}

if (missing.length) {
  console.log("\nNot in projects.ts — add it or add it to EXCLUDED in this script:");
  for (const r of missing) {
    console.log(
      `  - ${r.name}  (${r.language ?? "no language"}, pushed ${r.pushed_at.slice(0, 10)})`,
    );
  }
  process.exitCode = 1;
} else if (!missed.length) {
  console.log("\nNo drift.");
}
