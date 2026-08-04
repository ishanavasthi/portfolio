# Speed Insights — pre-merge baseline

Snapshot taken **2026-08-05** as the "before" reference for the
`redesign/systems-ledger` PR. Re-run the same queries after the merge and
compare against this file.

## Capture parameters

Every number below was produced with these exact settings. Any comparison run
must use the same ones or the delta is meaningless.

| Parameter | Value |
|---|---|
| Project | `ishan-projects/portfolio` (`prj_XjYKUja3U0SkbpDnbwUn1EOaIj9z`) |
| Environment | production (`--prod`) |
| Window | 7 days — `2026-07-28T21:12Z` → `2026-08-04T21:12Z` |
| Aggregation | p75 for vitals, sum for counts |
| Granularity | 4h buckets (CLI auto) |
| Tool | Vercel CLI 58.5.1, `vercel metrics` |
| Baseline commit | `6e6b32e` (production at time of capture) |

The window is 7 days, not the usual 14, because the Hobby plan rejects longer
ranges: `the hobby plan only grants access to the latest 7 days of data`.

Metric namespace is `vercel.speed_insights.*`. Note that the bundled
`vercel-optimize` skill queries `vercel.speed_insights_metric.*`, which CLI 58
rejects as unknown — use the namespace below, not the skill's registry.

## Headline p75 — all routes, production

| Metric | p75 | Rating | Good / Poor thresholds |
|---|---|---|---|
| LCP | **3156 ms** | Needs improvement | ≤2500 / >4000 |
| INP | 72 ms | Good | ≤200 / >500 |
| CLS | 0.00 | Good | ≤0.1 / >0.25 |
| FCP | 1760 ms | Good (barely) | ≤1800 / >3000 |
| TTFB | 409 ms | Good | ≤800 / >1800 |

## Sample counts — the load-bearing caveat

| Metric | Samples in window |
|---|---|
| LCP | 48 |
| FCP | 48 |
| CLS | 34 |
| TTFB | 28 |
| INP | 22 |

**These counts are too low to support a pass/fail comparison.** Vercel's own
route-level Core Web Vitals analysis expects at least 50 samples *per route*;
here the entire site has 48 LCP samples across all routes combined. Every
per-route figure below is therefore directional at best.

## LCP p75 by route

| Route | p75 LCP | Samples |
|---|---|---|
| `/` | 2820 ms | 32 |
| `/projects` | 3860 ms | 9 |
| `/blog/[slug]` | 3281 ms | 2 |
| `/blog` | 3196 ms | 4 |
| `/projects/comments-remover` | 682 ms | 1 |

## LCP p75 by device

| Device | p75 LCP | Samples |
|---|---|---|
| desktop | 3156 ms | 45 |
| mobile | 3348 ms | 3 |

Mobile rests on 3 samples. Do not read a desktop/mobile gap into this.

## Observations from the raw time series

- LCP swings from 567 ms to 4044 ms across 4-hour buckets. That spread is
  sampling noise at n=48, not a stable signal — the 3156 ms aggregate carries a
  wide error bar.
- CLS is 0.00 in every bucket except one spike to **0.5386** at
  `2026-07-30T16:00Z`. That same bucket also holds the 3860 ms LCP peak,
  suggesting one bad session rather than a systemic layout-shift problem.
- Roughly half of all 4h buckets are `null` (no traffic at all).

## How to reproduce for the "after" run

```bash
# from the linked project directory
for m in lcp_ms inp_ms cls fcp_ms ttfb_ms; do
  vercel metrics vercel.speed_insights.$m -a p75 --prod -s 7d --json
done

for m in lcp_count inp_count cls_count fcp_count ttfb_count; do
  vercel metrics vercel.speed_insights.$m -a sum --prod -s 7d --json
done

vercel metrics vercel.speed_insights.lcp_ms -a p75 --prod -s 7d --group-by route --json
vercel metrics vercel.speed_insights.lcp_count -a sum --prod -s 7d --group-by route --json
vercel metrics vercel.speed_insights.lcp_ms -a p75 --prod -s 7d --group-by device_type --json
```

## Reading the comparison

Immediately after merging, a 7-day window still contains mostly pre-merge
traffic — the two datasets will overlap and any delta will be diluted. For a
clean before/after, wait until the window covers only post-merge traffic
(~7 days), or narrow the "after" run with `-s 1d` / `-s 2d` and accept an even
smaller sample.

Given the sample sizes here, treat a post-merge change under roughly 1000 ms in
LCP p75 as indistinguishable from noise.
