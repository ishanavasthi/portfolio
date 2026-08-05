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
| `src/components/motion/tilt-card.tsx` | `TiltCard` | `/projects` cards (`components/projects/project-card.tsx`) — **the `/projects` signature moment**. 3D tilt on a spring plus a raw-pointer mint spotlight. Used nowhere else, by design. |
| `src/components/motion/dot-lattice.tsx` | `DotLattice` | Behind the hero **only** (`sections/hero.tsx`) — **the homepage signature moment**. A canvas grid of faint dots that lean toward the cursor and warm to the signal color around it. |
| `src/components/motion/cursor-spotlight.tsx` | `CursorSpotlight` | Mounted once in `app/layout.tsx`. A whisper-alpha radial glow trailing the cursor on every page except `/projects`, where TiltCard is the only allowed light source. |
| `src/components/motion/count-up.tsx` | `CountUp` | The four numbers in the stats band (`sections/stats.tsx`). Rolls 0 → value on first reveal; server HTML always carries the real number. |
| `src/app/template.tsx` | default `Template` | Wraps every route. 0.3s fade-and-rise on the template remount Next.js performs per navigation — no state, no exit animation, nothing to fight that remount. |

Two micro-interactions are CSS-only and live outside the kit: the **trace
sweep** on ledger rows (`components/projects/project-ledger-row.tsx` + the
`trace-sweep` keyframes in `globals.css` — a signal blip crosses a row's top
border once per hover, like a span lighting up in a trace view) and the
**radar ping** on the hero status dot (`radar-ping` keyframes; one soft ring
every 3.2s). Both are disabled by `motion-reduce:`.

## The cursor layer

The site's "alive" feel comes from one cursor-aware layer per surface, not from
more entrance animation. (An earlier `AgentFlow` pipeline diagram lived between
Hero and Stats; it was removed in favor of this layer — see git history if it's
ever wanted back.)

### DotLattice — the homepage signature

**Location:** `src/components/motion/dot-lattice.tsx`, mounted behind the hero.

- **Canvas, not DOM.** ~900 dots on springs would drown React; here each frame
  is one clear and one pass of arcs, with the device-pixel-ratio capped at 2.
- **Interaction model.** Dots within 130px of the cursor lean up to 5px toward
  it and warm from `--border-strong` to `--agent-signal`; everything eases back
  by exponential smoothing, which settles like a critically damped spring. At
  rest the field is nearly invisible — the surface only feels live under the
  reader's own hand.
- **When it doesn't run.** The rAF loop is gated by an `IntersectionObserver`,
  the page-visibility API, and an idle-stop: once the pointer leaves and every
  dot settles, the loop cancels itself until the next pointermove. Touch devices
  and reduced motion get a single static draw of the resting grid — the final
  state, since with no cursor there is nothing to react to.
- **Edges.** A CSS radial mask fades the lattice out before it touches the
  section borders, so it reads as atmosphere rather than a panel of dots.

### CursorSpotlight — the connective tissue

**Location:** `src/components/motion/cursor-spotlight.tsx`, mounted in the root
layout.

A 600px radial glow at 4.5% alpha trailing the cursor on a soft spring
(deliberately looser than `springSettle` — light should trail attention, not
track it). It returns `null` on `/projects` so TiltCard stays that page's only
light source, renders nothing until the first fine-pointer move (which also
keeps it off touch devices), and never activates under reduced motion.

### Color

`--agent-signal` in `globals.css` is defined as `var(--accent)` — the existing
mint `#6ee7b7`. It is an alias, not a new color: the site stays single-hue, and
the token is the one knob for every signal-colored effect (lattice glow, trace
sweep, radar ping). Deliberately not a stock neon green picked to look
technical.

## Restraint

- **One signature per page.** `DotLattice` is the homepage's moment;
  `TiltCard` is `/projects`'. Neither page hosts both, and nothing else on
  either page is allowed to compete.
- **`CursorSpotlight` is atmosphere, not an effect.** 4.5% alpha; if a visitor
  consciously notices it, it's too strong.
- **Micro-interactions stay micro.** The trace sweep runs once per hover on a
  1px line; the count-up runs once per visit; the radar ping is one ring every
  3.2s on a 0.55em dot. None of them loop visibly enough to pull the eye.
- **One `TextReveal`, one `MagneticButton`.** The hero headline and the hero CTA.
  Applying either twice turns a first impression into a mannerism.
- Everything else — `Reveal`, the stagger groups, the route transition — is
  quiet and functional by comparison, which is the point.

Adding something new? Check it against
`.claude/skills/motion-design/SKILL.md`, and update the table above with what it
is and where it's used.
