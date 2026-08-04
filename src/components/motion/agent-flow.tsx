"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion, useInView } from "framer-motion";

import { useSkipEntrance } from "@/components/motion/use-skip-entrance";
import { cn } from "@/lib/utils";

const STAGES = ["Scanner", "Research", "Analyst", "RiskManager", "Execution"];

/** Horizontal inset of the first and last node centers. */
const PAD = 18;
/** Baseline the pipeline weaves around. */
const TRACK_Y = 52;
/** Fixed container height — reserved up front so measuring never causes CLS. */
const TRACK_H = 120;
/** How far each segment bows off the baseline. Small on purpose: this is ambience. */
const UNDULATION = 12;
/** One full traversal of the pipeline, in seconds. */
const TRAVEL_S = 4;
const DOT_SIZE = 7;

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function nodeX(index: number, width: number) {
  return PAD + (index * (width - PAD * 2)) / (STAGES.length - 1);
}

/**
 * Builds the cubic chain that threads all five node centers. Each segment bows
 * the opposite way from its neighbour, which keeps the tangents continuous at
 * every node and reads as a soft weave rather than a row of arcs. The returned
 * string is shared verbatim by the SVG `d` and the dots' `offsetPath`, so the
 * two coordinate systems must stay unscaled — hence raw pixels and no viewBox.
 */
function buildPath(width: number) {
  const segment = (width - PAD * 2) / (STAGES.length - 1);
  let d = `M ${round(nodeX(0, width))} ${TRACK_Y}`;

  for (let i = 0; i < STAGES.length - 1; i += 1) {
    const start = nodeX(i, width);
    const end = nodeX(i + 1, width);
    const bow = i % 2 === 0 ? -UNDULATION : UNDULATION;
    d += ` C ${round(start + segment / 3)} ${TRACK_Y + bow}, ${round(end - segment / 3)} ${TRACK_Y + bow}, ${round(end)} ${TRACK_Y}`;
  }

  return d;
}

/**
 * Tracks the container's rendered width so the diagram can be drawn in real
 * pixels. CSS `offset-path` resolves `path()` against the element's own
 * coordinate space and ignores SVG viewBox scaling, so measuring is the only
 * way to keep the dots glued to the stroke at every breakpoint.
 */
function useMeasuredWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });

    observer.observe(element);
    setWidth(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [ref]);

  return width;
}

/**
 * AlphaDesk's five-stage agent pipeline — Scanner, Research, Analyst,
 * RiskManager, Execution — drawn as a live signal diagram, with two mint dots
 * riding the connecting path to suggest requests moving through the system.
 * It sits on the homepage between the Hero and the Stats band as a quiet piece
 * of texture; the motion is deliberately low-contrast so it never competes
 * with the TiltCard on /projects, which is the site's one signature moment.
 *
 * The diagram itself is aria-hidden because it carries no information a
 * screen reader would miss: the stage names are real prose in the AlphaDesk
 * entry in `src/lib/projects.ts`. Only the eyebrow above it is read out.
 *
 * With reduced motion (or during static capture) the dots are never mounted
 * and the path, nodes and labels render as-is — the still diagram is the
 * final state, not a shortened animation.
 */
export function AgentFlow({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useMeasuredWidth(containerRef);
  const skipEntrance = useSkipEntrance();
  const inView = useInView(containerRef, { amount: 0.3 });

  const d = useMemo(() => (width > 0 ? buildPath(width) : ""), [width]);
  const labelSize = width < 480 ? 11 : 12;
  const showDots = width > 0 && inView && !skipEntrance;

  const dotStyle = {
    offsetPath: `path("${d}")`,
    offsetRotate: "0deg",
    // Anchors the dot's centre — not its top-left corner — to the stroke.
    offsetAnchor: "center",
    background: "var(--agent-signal)",
    // Static, never animated: an animated glow would pull focus.
    boxShadow: "0 0 10px 3px rgba(110, 231, 183, 0.4)",
  } as const;

  return (
    <section className={cn("border-b border-border", className)}>
      <div className="mx-auto max-w-[1080px] px-6 py-10">
        <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          AlphaDesk / agent pipeline
        </p>

        <div
          ref={containerRef}
          aria-hidden
          className="relative"
          style={{ height: TRACK_H }}
        >
          {width > 0 ? (
            <>
              <svg
                width={width}
                height={TRACK_H}
                className="absolute inset-0"
                role="presentation"
              >
                <path
                  d={d}
                  fill="none"
                  stroke="var(--border-strong)"
                  strokeWidth={1.25}
                />

                {STAGES.map((stage, i) => {
                  const x = nodeX(i, width);
                  const isFirst = i === 0;
                  const isLast = i === STAGES.length - 1;

                  return (
                    <g key={stage}>
                      <rect
                        x={round(x - 7)}
                        y={45}
                        width={14}
                        height={14}
                        rx={4}
                        fill="var(--surface)"
                        stroke="var(--border)"
                      />
                      <text
                        // The end labels anchor to the container edges instead
                        // of their node centre, which sits only 18px in — a
                        // centred "Scanner" would be clipped by the SVG.
                        x={isFirst ? 0 : isLast ? round(width) : round(x)}
                        y={i % 2 === 0 ? 32 : 80}
                        textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
                        fontSize={labelSize}
                        fontFamily="var(--font-geist-mono), monospace"
                        fill="var(--muted-foreground)"
                      >
                        {stage}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {showDots ? (
                <>
                  <motion.div
                    className="absolute top-0 left-0 rounded-full"
                    style={{ width: DOT_SIZE, height: DOT_SIZE, ...dotStyle }}
                    animate={{ offsetDistance: ["0%", "100%"] }}
                    transition={{
                      duration: TRAVEL_S,
                      ease: "linear",
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                  {/* Half a phase behind: it snaps from the end back to the
                      start mid-cycle so both dots always travel forwards. */}
                  <motion.div
                    className="absolute top-0 left-0 rounded-full"
                    style={{ width: DOT_SIZE, height: DOT_SIZE, ...dotStyle }}
                    animate={{
                      offsetDistance: ["50%", "100%", "100%", "0%", "50%"],
                    }}
                    transition={{
                      duration: TRAVEL_S,
                      ease: "linear",
                      times: [0, 0.5, 0.5, 0.5, 1],
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
