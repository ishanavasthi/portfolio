import { socials } from "@/lib/site";

/**
 * Live GitHub contribution calendar for the homepage.
 *
 * This is the one deliberate exception to "no GitHub calls at request time"
 * (see scripts/sync-github.mjs): a streak is only worth showing if it's
 * current. The data comes from github-contributions-api.jogruber.de, which
 * reads the public profile calendar — no token in the deploy environment, and
 * the numbers match what github.com shows. The fetch is ISR-cached, so the
 * homepage stays prerendered and refreshes at most once an hour.
 */

export const GITHUB_USERNAME = new URL(socials.github).pathname.slice(1);

const REVALIDATE_SECONDS = 60 * 60;

export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // GitHub's own intensity bucket
};

export type ContributionSummary = {
  days: ContributionDay[];
  total: number;
  currentStreak: number;
  longestStreak: number;
};

type ApiResponse = {
  total: { lastYear: number };
  contributions: ContributionDay[];
};

export async function getContributions(): Promise<ContributionSummary | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ApiResponse;
    const days = data.contributions;
    if (!days?.length) return null;
    return {
      days,
      total: data.total.lastYear,
      currentStreak: currentStreak(days),
      longestStreak: longestStreak(days),
    };
  } catch {
    // The section is a nice-to-have; an upstream outage drops it rather than
    // failing the build or the page.
    return null;
  }
}

/**
 * Consecutive active days ending today. A quiet today doesn't break the
 * streak yet — same rule GitHub-style streak counters use — so the count
 * starts from yesterday until the first contribution of the day lands.
 */
function currentStreak(days: ContributionDay[]) {
  let i = days.length - 1;
  if (days[i].count === 0) i--;
  let streak = 0;
  for (; i >= 0 && days[i].count > 0; i--) streak++;
  return streak;
}

function longestStreak(days: ContributionDay[]) {
  let best = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}
