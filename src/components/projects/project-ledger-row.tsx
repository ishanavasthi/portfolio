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
  // The row as a whole goes to the repo; the demo/live chip is its own target.
  // Falling back to `live` keeps rows for projects with no public repo clickable.
  const rowHref = project.github ?? project.live;
  if (!rowHref) return null;
  // Only worth its own link when it points somewhere the row doesn't already.
  const demoHref = project.live !== rowHref ? project.live : undefined;
  // Derived from `live`, not `demoHref`, so the label stays right in the
  // no-repo case where the row itself is already the demo target.
  const demoLabel = project.live?.includes("video") ? "demo" : "live";

  return (
    /*
      Stretched-link pattern, not a row-wide <a>. An anchor cannot nest inside
      another anchor — the parser hoists the inner one out — so the row is a
      plain div and the primary link projects an ::after overlay across it.
      That keeps both targets real anchors: middle-click, cmd-click, "copy link
      address", and tab order all behave, which a click handler wouldn't give us.
    */
    <div
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
          <Link
            href={rowHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} — ${project.github ? "source on GitHub" : demoLabel}`}
            className="rounded-[2px] outline-offset-4 after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-accent"
          >
            {project.name}
          </Link>
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
          {/* Not a link: this labels the row's own target, which the stretched
              overlay above already covers. */}
          {project.github && <span>code ↗</span>}
          {demoHref ? (
            // Lifted out of the overlay's stacking order so the click lands here
            // instead of falling through to the repo.
            <Link
              href={demoHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} ${demoLabel}`}
              className="relative z-10 rounded-[2px] outline-offset-4 transition-colors duration-[180ms] ease-out hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              {demoLabel} ↗
            </Link>
          ) : (
            project.live && <span>{demoLabel} ↗</span>
          )}
        </div>
      </div>
    </div>
  );
}
