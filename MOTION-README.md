# Motion kit

Every animated primitive on the site lives in `src/components/motion/` and shares
one easing curve and one set of variants from `src/lib/motion/variants.ts`. Read
this before adding anything animated — the conventions are enforced by
`.claude/skills/motion-design/SKILL.md`, and the short version is: reuse what is
here, and don't add a second thing that demands attention.

## Inventory

| File | Exports | Where it's used |
| --- | --- | --- |
| `src/lib/motion/variants.ts` | `EASE_SIGNATURE`, `springSettle`, `VIEWPORT_ONCE`, `staggerContainer`, `fadeUpItem` | Imported everywhere. `EASE_SIGNATURE` is the one deceleration curve for scheduled motion; `springSettle` is for cursor-tracking only; `staggerContainer`/`fadeUpItem` drive the hero, stats, about, skills and contact groups directly. |
| `src/components/motion/use-skip-entrance.ts` | `useSkipEntrance()`, `staticCapture` | Every motion component. Returns true for `prefers-reduced-motion: reduce` **or** `NEXT_PUBLIC_STATIC_CAPTURE=1`. Always use this instead of raw `useReducedMotion()`. |
| `src/components/motion/reveal.tsx` | `Reveal` | Section heads, 5 places: `sections/about.tsx`, `sections/skills.tsx`, `sections/projects.tsx`, `sections/contact.tsx`, and `app/projects/page.tsx`. One-off blocks only — sets belong in a `StaggerGroup`. |
| `src/components/motion/stagger.tsx` | `StaggerGroup`, `StaggerItem` | `StaggerGroup` drives the project cascade on `/projects` (`components/projects/project-cascade.tsx`) in `mode="mount"`, so the cascade replays when the filter remounts it with a new key, and the homepage featured ledger (`sections/projects.tsx`) in the default `mode="inView"`, where each `ProjectLedgerRow` sits in a `StaggerItem`. Cascade cards supply their own `cardVariants` instead of `StaggerItem` because they carry an extra `exit` state. |
| `src/components/motion/text-reveal.tsx` | `TextReveal` | The hero `h1` **only** (`sections/hero.tsx`). Word-by-word rise behind per-word clip masks. Inherits `hidden`/`show` from the hero's stagger container by default; `standalone` drives its own entrance. |
| `src/components/motion/magnetic-button.tsx` | `MagneticButton` | The hero "View projects" CTA **only** (`sections/hero.tsx`). Wraps rather than clones, so the anchor keeps its href, hover styles and focus ring. |
| `src/components/motion/tilt-card.tsx` | `TiltCard` | `/projects` cards (`components/projects/project-card.tsx`) — **the signature moment**. 3D tilt on a spring plus a raw-pointer mint spotlight. Used nowhere else, by design. |
| `src/components/motion/agent-flow.tsx` | `AgentFlow` | Homepage strip between `Hero` and `Stats` (`app/page.tsx`). AlphaDesk's five-stage pipeline with two signal dots riding the path. |
| `src/app/template.tsx` | default `Template` | Wraps every route. 0.3s fade-and-rise on the template remount Next.js performs per navigation — no state, no exit animation, nothing to fight that remount. |

## AgentFlow

**Location:** `src/components/motion/agent-flow.tsx`
**Placement:** Option A — a dedicated full-width strip on the homepage, directly
between `Hero` and `Stats`.

### Why there

The hero lede literally says the words *agent pipelines*. Putting the diagram
immediately beneath it makes it proof rather than decoration: the claim and its
illustration are both near the fold, and the five node labels (Scanner,
Research, Analyst, RiskManager, Execution) are AlphaDesk's real stages, not
invented ones.

It also composes with the page rhythm. Every homepage section is a
`border-b border-border` band, so hero → strip → stats reads as one continuous
sequence instead of an inserted widget.

Anywhere lower would have been worse. Sitting next to the projects ledger, a
looping diagram would compete with the ledger rows for attention and, on
`/projects`, with `TiltCard` — the one thing on the site allowed to be loud.

### How it's built

- **CSS `offset-path` + Framer `offsetDistance`.** Both dots are HTML divs
  pinned to the same cubic path string via `offsetPath: path(...)`, animated on
  `offsetDistance` from `0%` to `100%`. That keeps the whole loop on
  GPU-friendly transform compositing rather than per-frame layout.
- **Measured width, raw pixels, no viewBox.** `offset-path` resolves `path()`
  against the element's own coordinate space and ignores SVG viewBox scaling, so
  a `ResizeObserver` measures the container and the path is rebuilt in real
  pixels. The SVG `d` attribute and the dots' `offsetPath` consume the *same*
  string, which is the only way HTML dots and SVG stroke stay glued together at
  every breakpoint. The container height is fixed at 120px up front so measuring
  never causes layout shift.
- **The weave.** Each segment bows the opposite direction from its neighbour, so
  tangents stay continuous at every node and the chain reads as a soft weave
  rather than a row of disconnected arcs. Amplitude is 12px — small on purpose.
- **Second dot phasing.** The trailing dot uses a `times` array with a
  zero-duration jump at the halfway mark so it snaps end→start mid-cycle and
  both dots always travel forwards.
- **SMIL fallback, documented not used.** SVG `<animateMotion>` would attach dots
  to the path without any measuring at all, and it is the correct fallback if
  `offset-path` support ever becomes a problem. It was not chosen because SMIL
  animations are awkward to pause on scroll and can't be driven from the same
  Framer timeline as the rest of the kit.
- **Off-screen pause.** `useInView(containerRef, { amount: 0.3 })` gates the
  dots; scrolled out of view they unmount entirely rather than burning frames.
- **Reduced motion.** With `useSkipEntrance()` true the dots are never mounted
  and the path, nodes and labels render as-is. The still diagram *is* the final
  state — not a shortened animation.
- **Accessibility.** The diagram is `aria-hidden`; only the
  `AlphaDesk / agent pipeline` eyebrow is announced. The stage names already
  exist as prose in the AlphaDesk entry in `src/lib/projects.ts`, so nothing is
  lost.

### Color

`--agent-signal` in `globals.css` is defined as `var(--accent)` — the existing
mint `#6ee7b7`. It is an alias, not a new color: the site stays single-hue, and
the token exists only so the signal can diverge later if there's ever a reason.
Deliberately not a stock neon green picked to look technical.

## Restraint

- **`TiltCard` is the single signature moment.** It is the one animation on the
  site that asks to be noticed, and it lives only on the `/projects` cards.
- **`AgentFlow` is deliberately secondary.** The path is `#2a2a2a`, the node
  rects are surface-on-border, the labels are muted-foreground. The accent
  appears in exactly one place: the two 7px dots, with a static (never pulsing)
  glow. Nothing about it competes with the projects grid.
- **One `TextReveal`, one `MagneticButton`.** The hero headline and the hero CTA.
  Applying either twice turns a first impression into a mannerism.
- Everything else — `Reveal`, the stagger groups, the route transition — is
  quiet and functional by comparison, which is the point.

Adding something new? Check it against
`.claude/skills/motion-design/SKILL.md`, and update the table above with what it
is and where it's used.
