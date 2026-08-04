---

## name: motion-design description: Motion and animation conventions for [ishanavasthi.in](http://ishanavasthi.in) (Next.js 15, shadcn/ui new-york, Framer Motion, MDX). Use whenever adding, reviewing, or extending any animation, transition, hover effect, scroll interaction, or "make it feel more alive" request on this portfolio.

# Motion design conventions — [ishanavasthi.in](http://ishanavasthi.in)

## Stack

Next.js 15 (App Router), shadcn/ui (new-york style), Framer Motion, MDX for content. All motion primitives already live under:

```
lib/motion/variants.ts          shared easing curve + variants
components/motion/reveal.tsx        scroll-triggered reveal
components/motion/stagger.tsx       StaggerGroup / StaggerItem
components/motion/tilt-card.tsx     3D tilt + cursor glow — the signature piece
components/motion/magnetic-button.tsx
components/motion/text-reveal.tsx   word-by-word hero headline
app/template.tsx                page transition on route change

```

Read these files before adding anything new — reuse `EASE_SIGNATURE` from `lib/motion/variants.ts` rather than inventing a new curve, and reuse `Reveal`/`StaggerGroup` rather than writing a fresh `whileInView` block inline.

## The one rule that matters most: restraint

This site gets **one signature moment**. Right now that's `TiltCard` on the project grid — a 3D tilt + cursor spotlight, used nowhere else. Every other animation on the page (`Reveal`, `StaggerGroup`, `TextReveal`, `MagneticButton`, the page transition) is quiet and functional by comparison.

Before adding a new animated element, ask: **does this compete with the signature moment, or support it?** If a new idea is exciting enough to be its own showpiece, either make it the new signature and demote `TiltCard` to something plainer, or cut it back until it's clearly secondary. Never let two "look at me" animations coexist on the same page — that reads as generated rather than designed.

## Non-negotiables for any new animation

1. **Respect** `prefers-reduced-motion`**.** Every existing component checks `useReducedMotion()` from Framer Motion and renders a static fallback. Do the same for anything new — never skip this to save time.
2. **Justify the transition type.** A spring (`springSettle` in `variants.ts`) is for anything that responds to user input (drag, hover, magnetic pull). A duration + `EASE_SIGNATURE` easing is for anything that plays on a schedule (page load, scroll reveal). Don't mix them arbitrarily.
3. **Ground it in real content.** This portfolio's subject is Ishan's actual agent architectures (AlphaDesk's Scanner → Research → Analyst → RiskManager → Execution pipeline, AgentGrid, RecruitEnv, Swiggy Agent). A decorative circuit-board or particle effect with no connection to that content is the generic "AI portfolio" look — prefer visuals that literally represent something true about the work over ones that just look technical. See the caution below.
4. **Don't let effects run forever off-screen.** Anything continuous (loops, traveling dots, ambient glows) should pause when scrolled out of view — wrap in `useInView` or check `viewport.once` semantics already used in `Reveal`/`StaggerGroup`. Continuous animation the user can't see is wasted CPU/battery.
5. **One CTA gets** `MagneticButton`**, one headline gets** `TextReveal`**.** Don't apply either to more than one element — they lose their weight if repeated.

## Caution: the near-black + neon-accent cliché

A dark background with a single bright green or acid accent color is one of the most common "this was AI-generated" tells in web design right now — it shows up regardless of subject matter. It's tempting for an AI-engineer portfolio specifically because "dark mode, neon, circuit lines" reads as *technical*. That doesn't make it distinctive.

If a request asks for something in this direction (glowing dots, circuit traces, data-flow visuals, terminal aesthetics), the way to earn it is specificity: real node labels from real projects, a path shape that means something (an actual pipeline, not a random lattice), a color pulled from a deliberate small palette rather than a stock neon green. Flag this tension back to the user if a request seems to be reaching for the generic version, and propose the grounded alternative instead of silently building the cliché.

## Checklist before calling an animation task done

- [ ] Reduced motion respected (static fallback, not just a shorter animation)
- [ ] Reuses `EASE_SIGNATURE`/`springSettle` or has an explicit reason not to
- [ ] Doesn't introduce a second competing signature moment
- [ ] Pauses/doesn't run when off-screen, if continuous
- [ ] Content (labels, paths, copy) is specific to this portfolio, not generic placeholder text
- [ ] [`MOTION-README.md`](http://MOTION-README.md) at the repo root updated with what was added and where it's used

