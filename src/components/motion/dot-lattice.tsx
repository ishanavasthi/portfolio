"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { useSkipEntrance } from "./use-skip-entrance";

/** Grid pitch. Loose enough to read as texture, not a pattern demo. */
const SPACING = 26;
/** How far from the cursor a dot still reacts. */
const RADIUS = 130;
/** Maximum pixels a dot leans toward the cursor at the center of the field. */
const PULL = 5;
/** Resting dot radius; hot dots grow slightly past this. */
const DOT_R = 1;
/** Per-frame exponential smoothing — settles like a critically damped spring. */
const SMOOTH = 0.16;
const MAX_DPR = 2;

type Dot = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  heat: number;
};

type RGB = [number, number, number];

function parseHex(value: string, fallback: RGB): RGB {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return fallback;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readToken(name: string, fallback: RGB): RGB {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseHex(value, fallback);
}

/**
 * The homepage's signature moment: a faint, precise lattice of dots behind the
 * hero that leans toward the cursor and warms to the signal color around it,
 * relaxing back the instant attention moves on. At rest it is almost
 * invisible — the point is that the surface only feels alive under the reader's
 * own hand, which is as "agentic" as a background is allowed to get without
 * pretending to be a diagram of something.
 *
 * Canvas rather than DOM because ~900 dots re-rendered on a spring would drown
 * React; here each frame is one clear and one pass of arcs. The loop runs only
 * while the section is on screen, the tab is visible, and there is energy left
 * in the field — a settled lattice costs nothing. Touch devices and reduced
 * motion get a single static draw of the resting grid: the final state, with
 * no pointer there is nothing to react to.
 */
export function DotLattice({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipEntrance = useSkipEntrance();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const context2d = canvas?.getContext("2d");
    if (!wrapper || !canvas || !context2d) return;
    // Narrowed consts: closures below capture these, and TypeScript keeps
    // their non-null types where it would forget the guard on the originals.
    const root = wrapper;
    const surface = canvas;
    const ctx = context2d;

    const rest = readToken("--border-strong", [42, 42, 42]);
    const signal = readToken("--agent-signal", [110, 231, 183]);
    const interactive =
      !skipEntrance &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = false;
    let onScreen = false;
    const pointer = { x: 0, y: 0, active: false };

    function rebuild() {
      const bounds = root.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      surface.width = Math.round(width * dpr);
      surface.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.max(2, Math.floor(width / SPACING));
      const rows = Math.max(2, Math.floor(height / SPACING));
      const startX = (width - (cols - 1) * SPACING) / 2;
      const startY = (height - (rows - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = startX + c * SPACING;
          const y = startY + r * SPACING;
          dots.push({ ox: x, oy: y, x, y, heat: 0 });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const heat = dot.heat;
        if (heat > 0.01) {
          // A wide, faint halo under hot dots stands in for a blur — an actual
          // shadowBlur per arc would wreck the frame budget.
          ctx.fillStyle = `rgba(${signal[0]}, ${signal[1]}, ${signal[2]}, ${0.1 * heat})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_R + 5 * heat, 0, Math.PI * 2);
          ctx.fill();
        }
        const r = Math.round(rest[0] + (signal[0] - rest[0]) * heat);
        const g = Math.round(rest[1] + (signal[1] - rest[1]) * heat);
        const b = Math.round(rest[2] + (signal[2] - rest[2]) * heat);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.9 + 0.1 * heat})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_R + 0.7 * heat, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      frame = 0;
      let energy = 0;
      for (const dot of dots) {
        let targetX = dot.ox;
        let targetY = dot.oy;
        let targetHeat = 0;
        if (pointer.active) {
          const dx = pointer.x - dot.ox;
          const dy = pointer.y - dot.oy;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.001) {
            const falloff = (1 - dist / RADIUS) ** 2;
            targetX = dot.ox + (dx / dist) * PULL * falloff;
            targetY = dot.oy + (dy / dist) * PULL * falloff;
            targetHeat = falloff;
          }
        }
        dot.x += (targetX - dot.x) * SMOOTH;
        dot.y += (targetY - dot.y) * SMOOTH;
        dot.heat += (targetHeat - dot.heat) * SMOOTH;
        energy = Math.max(
          energy,
          Math.abs(targetX - dot.x),
          Math.abs(targetY - dot.y),
          Math.abs(targetHeat - dot.heat) * PULL,
        );
      }
      draw();

      // Idle-stop: once the pointer is gone and every dot has settled, stop
      // burning frames. The next pointermove wakes the loop back up.
      if (onScreen && (pointer.active || energy > 0.05)) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
      }
    }

    function wake() {
      if (!running && onScreen && !document.hidden) {
        running = true;
        frame = requestAnimationFrame(step);
      }
    }

    function sleep() {
      cancelAnimationFrame(frame);
      running = false;
    }

    const resizeObserver = new ResizeObserver(() => {
      rebuild();
      draw();
    });
    resizeObserver.observe(root);
    rebuild();
    draw();

    if (!interactive) return () => resizeObserver.disconnect();

    const onPointerMove = (event: PointerEvent) => {
      const bounds = surface.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
      wake();
    };
    const onPointerGone = () => {
      pointer.active = false;
      wake();
    };
    const onVisibility = () => {
      if (document.hidden) sleep();
      else wake();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) wake();
      else sleep();
    });

    intersection.observe(root);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerGone);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      sleep();
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerGone);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [skipEntrance]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        maskImage:
          "radial-gradient(120% 95% at 50% 40%, black 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(120% 95% at 50% 40%, black 55%, transparent 100%)",
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
