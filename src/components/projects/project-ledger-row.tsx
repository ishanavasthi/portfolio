import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

export function ProjectLedgerRow({
  project,
  index,
  isLast,
}: {
  project: Project;
  index: number;
  isLast?: boolean;
}) {
  const href = project.github ?? project.live;
  if (!href) return null;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative grid grid-cols-[40px_1fr] items-baseline gap-5 overflow-hidden border-t border-border py-7 transition-colors duration-[180ms] ease-out hover:bg-white/[0.015] md:grid-cols-[56px_1fr_auto]",
        isLast && "border-b",
      )}
    >
      {/* Trace sweep: a signal blip crossing the row's top border on hover.
          The gradient lives only in the tail of a row-width strip, so the
          -100% → 100% keyframe translate carries it edge to edge; when the
          animation ends the resting -translate-x-full hides it again. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px -translate-x-full bg-[linear-gradient(90deg,transparent_0%,transparent_62%,var(--agent-signal)_86%,transparent_100%)] opacity-70 group-hover:animate-[trace-sweep_0.8s_linear_1] motion-reduce:group-hover:animate-none"
      />
      <span className="self-start pt-1 font-mono text-xs text-muted-foreground">
        {String(index).padStart(3, "0")}
      </span>

      <div>
        <div className="text-xl font-semibold tracking-[-0.01em] text-foreground transition-colors duration-[180ms] ease-out group-hover:text-accent">
          {project.name}
        </div>
        <p className="mt-1.5 max-w-[560px] text-[15px] text-[var(--text-dim)]">
          {project.headline}
        </p>
        <div className="mt-3 flex flex-wrap font-mono text-[11px] text-muted-foreground">
          {project.tech.map((t, i) => (
            <span key={t}>
              {t}
              {i < project.tech.length - 1 && (
                <span className="mr-1.5 ml-1.5 text-border" aria-hidden>
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="col-start-2 flex flex-row items-center gap-3 font-mono text-xs text-muted-foreground md:col-start-auto md:flex-col md:items-end md:gap-2.5">
        <span>{project.year}</span>
        <div className="flex gap-3.5">
          {project.github && <span>code ↗</span>}
          {project.live && (
            <span>{project.live.includes("video") ? "demo" : "live"} ↗</span>
          )}
        </div>
      </div>
    </Link>
  );
}
