#!/usr/bin/env node
/**
 * Drift detector between GitHub and src/lib/projects.ts.
 *
 * The project cascade is hand-curated on purpose — the written copy is better
 * than repo descriptions, and static data keeps /projects prerendered. The cost
 * of curation is that a new repo can sit unlisted for months. This script is
 * the safety net: it fails when GitHub has an authored repo the portfolio
 * doesn't know about, or when projects.ts points at a repo that's gone.
 *
 * Usage: npm run sync:github        (requires the `gh` CLI, authenticated)
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

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

const listed = listedSlugs();
const repos = authoredRepos();
const repoNames = new Set(repos.map((r) => r.name));

const missing = repos.filter((r) => !listed.has(r.name) && !(r.name in EXCLUDED));
const stale = [...listed].filter((slug) => !repoNames.has(slug));

console.log(
  `${repos.length} authored public repos · ${listed.size} in projects.ts · ` +
    `${Object.keys(EXCLUDED).length} deliberately excluded`,
);

if (stale.length) {
  console.log("\nIn projects.ts but not on GitHub (renamed, deleted, or private):");
  for (const slug of stale) console.log(`  - ${slug}`);
}

if (missing.length) {
  console.log("\nNot in projects.ts — add it or add it to EXCLUDED in this script:");
  for (const r of missing) {
    console.log(
      `  - ${r.name}  (${r.language ?? "no language"}, pushed ${r.pushed_at.slice(0, 10)})`,
    );
  }
  process.exitCode = 1;
} else if (!stale.length) {
  console.log("\nNo drift.");
}
