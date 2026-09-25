import {
  getContributions,
  GITHUB_USERNAME,
  type ContributionDay,
} from "@/lib/github-contributions";
import { socials } from "@/lib/site";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const GUTTER_LEFT = 26; // weekday labels
const GUTTER_TOP = 16; // month labels

/**
 * GitHub's five intensity buckets, derived from the single accent token so the
 * calendar stays inside the site's one-hue palette instead of importing
 * GitHub's greens.
 */
const LEVEL_FILL = [
  "var(--border)",
  "color-mix(in oklab, var(--accent) 28%, var(--bg))",
  "color-mix(in oklab, var(--accent) 50%, var(--bg))",
  "color-mix(in oklab, var(--accent) 75%, var(--bg))",
  "var(--accent)",
] as const;

const WEEKDAY_LABELS = [
  { row: 1, label: "Mon" },
  { row: 3, label: "Wed" },
  { row: 5, label: "Fri" },
];

function utcDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

function formatDay(iso: string) {
  return utcDate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function plural(n: number, word: string) {
  return `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;
}

/** Places each day in a Sunday-first week column, like github.com. */
function layout(days: ContributionDay[]) {
  const offset = utcDate(days[0].date).getUTCDay();
  const cells = days.map((day, i) => ({
    day,
    col: Math.floor((i + offset) / 7),
    row: (i + offset) % 7,
  }));
  const weeks = cells[cells.length - 1].col + 1;

  // A month is labelled over the first column whose top cell falls in it;
  // labels closer than three columns apart would collide, so the earlier
  // (partial) month gives way.
  const months: { col: number; label: string }[] = [];
  let lastMonth = -1;
  for (const { day, col, row } of cells) {
    if (row !== 0 && col !== 0) continue;
    const month = utcDate(day.date).getUTCMonth();
    if (month === lastMonth) continue;
    lastMonth = month;
    const label = utcDate(day.date).toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    const prev = months[months.length - 1];
    if (prev && col - prev.col < 3) months.pop();
    months.push({ col, label });
  }

  return { cells, weeks, months };
}

export async function GitHubActivity() {
  const summary = await getContributions();
  if (!summary) return null;

  const { cells, weeks, months } = layout(summary.days);
  const width = GUTTER_LEFT + weeks * STEP - GAP;
  const height = GUTTER_TOP + 7 * STEP - GAP;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
        <span>
          <b className="font-medium text-foreground">
            {summary.total.toLocaleString("en-US")}
          </b>{" "}
          contributions in the last year
        </span>
        <span>
          current streak{" "}
          <b className="font-medium text-foreground">
            {plural(summary.currentStreak, "day")}
          </b>
          <span aria-hidden className="mx-2 text-[var(--border-strong)]">
            /
          </span>
          longest{" "}
          <b className="font-medium text-foreground">
            {plural(summary.longestStreak, "day")}
          </b>
        </span>
      </div>

      {/* Row-reversed scroller: on narrow screens the calendar overflows and
          the scroll origin sits at the right edge, so the most recent weeks
          are what a phone sees first. */}
      <div className="flex flex-row-reverse overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`GitHub contribution calendar for @${GITHUB_USERNAME}: ${summary.total.toLocaleString("en-US")} contributions in the last year, current streak ${plural(summary.currentStreak, "day")}.`}
          className="h-auto w-full min-w-[640px] shrink-0 font-mono"
        >
          {months.map(({ col, label }) => (
            <text
              key={`${col}-${label}`}
              x={GUTTER_LEFT + col * STEP}
              y={9}
              fontSize={9}
              className="fill-muted-foreground"
            >
              {label}
            </text>
          ))}
          {WEEKDAY_LABELS.map(({ row, label }) => (
            <text
              key={label}
              x={0}
              y={GUTTER_TOP + row * STEP + CELL - 1.5}
              fontSize={9}
              className="fill-muted-foreground"
            >
              {label}
            </text>
          ))}
          {cells.map(({ day, col, row }) => (
            <rect
              key={day.date}
              x={GUTTER_LEFT + col * STEP}
              y={GUTTER_TOP + row * STEP}
              width={CELL}
              height={CELL}
              rx={2}
              style={{ fill: LEVEL_FILL[day.level] }}
            >
              <title>{`${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDay(day.date)}`}</title>
            </rect>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          @{GITHUB_USERNAME} on GitHub ↗
        </a>
        <span className="flex items-center gap-1.5" aria-hidden>
          Less
          {LEVEL_FILL.map((fill) => (
            <span
              key={fill}
              className="inline-block size-2.5 rounded-[2px]"
              style={{ background: fill }}
            />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
