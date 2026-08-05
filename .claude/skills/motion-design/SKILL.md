---
name: motion-design
description: Motion and animation conventions for ishanavasthi.in (Next.js 15, shadcn/ui new-york, Framer Motion, MDX). Use whenever adding, reviewing, or extending any animation, transition, hover effect, scroll interaction, or "make it feel more alive" request on this portfolio.
---

# Motion design conventions — ishanavasthi.in

## Stack

Next.js 15 (App Router), shadcn/ui (new-york style), Framer Motion, MDX for content. All motion primitives already live under:

```
src/lib/motion/variants.ts                    shared easing curve + variants
src/components/motion/use-skip-entrance.ts    reduced-motion / static-capture gate
src/components/motion/reveal.tsx              scroll-triggered reveal
src/components/motion/stagger.tsx             StaggerGroup / StaggerItem
src/components/motion/tilt-card.tsx           3D tilt + cursor glow — the /projects signature
src/components/motion/dot-lattice.tsx         cursor-reactive hero field — the homepage signature
src/components/motion/cursor-spotlight.tsx    page-level cursor glow (returns null on /projects)
src/components/motion/count-up.tsx            stats roll-up on first reveal
src/components/motion/magnetic-button.tsx     hero CTA magnetic pull
src/components/motion/text-reveal.tsx         word-by-word hero headline
src/app/template.tsx                          page transition on route change

```

Read these files before adding anything new — reuse `EASE_SIGNATURE` from `src/lib/motion/variants.ts` rather than inventing a new curve, and reuse `Reveal`/`StaggerGroup` rather than writing a fresh `whileInView` block inline.

## The one rule that matters most: restraint

This site gets **one signature moment per page**. On the homepage that's `DotLattice` — the cursor-reactive field behind the hero; on `/projects` it's `TiltCard` — 3D tilt + cursor spotlight on the cards. Neither page hosts both. Every other animation (`Reveal`, `StaggerGroup`, `TextReveal`, `MagneticButton`, `CursorSpotlight`, `CountUp`, the page transition, the CSS micro-interactions) is quiet and functional by comparison.

Before adding a new animated element, ask: **does this compete with the signature moment, or support it?** If a new idea is exciting enough to be its own showpiece, either make it the new signature and demote `TiltCard` to something plainer, or cut it back until it's clearly secondary. Never let two "look at me" animations coexist on the same page — that reads as generated rather than designed.

## Non-negotiables for any new animation

1. **Respect** `prefers-reduced-motion`**.** Every existing component routes this through `useSkipEntrance()` from `src/components/motion/use-skip-entrance.ts` — it layers `NEXT_PUBLIC_STATIC_CAPTURE` support on top of Framer's `useReducedMotion()` so screenshot builds render statically too. Call that hook, not `useReducedMotion()` directly, and render a static fallback. Never skip this to save time.
2. **Justify the transition type.** A spring (`springSettle` in `src/lib/motion/variants.ts`) is for anything that responds to user input (drag, hover, magnetic pull). A duration + `EASE_SIGNATURE` easing is for anything that plays on a schedule (page load, scroll reveal). Don't mix them arbitrarily.
3. **Ground it in real content.** This portfolio's subject is Ishan's actual agent architectures (AlphaDesk's Scanner → Research → Analyst → RiskManager → Execution pipeline, AgentGrid, RecruitEnv, Swiggy Agent). A decorative circuit-board or particle effect with no connection to that content is the generic "AI portfolio" look — prefer visuals that literally represent something true about the work over ones that just look technical. See the caution below. The one sanctioned exception is the cursor layer (`DotLattice`, `CursorSpotlight`): deliberately abstract by the owner's call — agentic in temperament, reactive only to the reader's own cursor, and never labeled as any real system. Don't extend that exception to new ambient or looping visuals without asking.
4. **Don't let effects run forever off-screen.** Anything continuous (loops, traveling dots, ambient glows) should pause when scrolled out of view — wrap in `useInView` or check `viewport.once` semantics already used in `Reveal`/`StaggerGroup`. Continuous animation the user can't see is wasted CPU/battery.
5. **One CTA gets** `MagneticButton`**, one headline gets** `TextReveal`**.** Don't apply either to more than one element — they lose their weight if repeated.

## Caution: the near-black + neon-accent cliché

A dark background with a single bright green or acid accent color is one of the most common "this was AI-generated" tells in web design right now — it shows up regardless of subject matter. It's tempting for an AI-engineer portfolio specifically because "dark mode, neon, circuit lines" reads as *technical*. That doesn't make it distinctive.

If a request asks for something in this direction (glowing dots, circuit traces, data-flow visuals, terminal aesthetics), the way to earn it is specificity: real node labels from real projects, a path shape that means something (an actual pipeline, not a random lattice), a color pulled from a deliberate small palette rather than a stock neon green. Flag this tension back to the user if a request seems to be reaching for the generic version, and propose the grounded alternative instead of silently building the cliché.

## Checklist before calling an animation task done

- [ ] Reduced motion respected via `useSkipEntrance()` (static fallback, not just a shorter animation)
- [ ] Reuses `EASE_SIGNATURE`/`springSettle` or has an explicit reason not to
- [ ] Doesn't introduce a second competing signature moment
- [ ] Pauses/doesn't run when off-screen, if continuous
- [ ] Content (labels, paths, copy) is specific to this portfolio, not generic placeholder text
- [ ] `MOTION-README.md` at the repo root updated with what was added and where it's used

