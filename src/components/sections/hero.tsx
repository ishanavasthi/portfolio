"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { site, socials } from "@/lib/site";
import { staggerContainer, fadeUpItem } from "@/lib/motion/variants";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";
import { DotLattice } from "@/components/motion/dot-lattice";
import { TextReveal } from "@/components/motion/text-reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";

const btnBase =
  "inline-flex items-center gap-2 rounded-[6px] border border-border px-5 py-[11px] font-mono text-[13px] text-foreground transition-colors duration-[0.18s] ease-out hover:border-accent hover:text-accent";

export function Hero() {
  const skipEntrance = useSkipEntrance();
  return (
    <section className="relative isolate border-b border-border pt-[120px] pb-24">
      <DotLattice />
      <motion.div
        variants={staggerContainer}
        initial={skipEntrance ? "show" : "hidden"}
        animate="show"
        className="mx-auto max-w-[1080px] px-6"
      >
        <motion.div
          variants={fadeUpItem}
          className="mb-8 flex flex-wrap gap-6 font-mono text-xs text-muted-foreground"
        >
          <span>{site.location}</span>
          <span className="relative inline-flex items-center justify-center text-accent">
            <span
              aria-hidden
              className="absolute size-[0.55em] rounded-full border border-accent animate-[radar-ping_3.2s_ease-out_infinite] motion-reduce:hidden"
            />
            ●
          </span>
          <span>{site.status}</span>
        </motion.div>

        <TextReveal
          as="h1"
          text={site.name}
          className="text-[clamp(44px,7vw,76px)] font-semibold tracking-[-0.025em] text-foreground [line-height:1.05]"
        />

        <motion.p
          variants={fadeUpItem}
          className="mt-5 font-mono text-[15px] text-accent"
        >
          <span>{site.title}</span>
          <span
            aria-hidden
            className="ml-1 inline-block h-[1em] w-[0.55ch] translate-y-[0.12em] bg-accent align-baseline"
            style={{ animation: "caret-blink 1.1s steps(1, end) infinite" }}
          />
        </motion.p>

        <motion.p
          variants={fadeUpItem}
          className="mt-7 max-w-[620px] text-[19px] leading-[1.6] text-[var(--text-dim)]"
        >
          I build the layer between raw language models and working
          products - <strong className="font-medium text-foreground">agent pipelines</strong>,{" "}
          <strong className="font-medium text-foreground">RAG systems</strong>, and the{" "}
          <strong className="font-medium text-foreground">
            observability and evals
          </strong>{" "}
          that make them reliable enough to ship.
        </motion.p>

        <motion.div variants={fadeUpItem} className="mt-10 flex flex-wrap gap-3">
          <MagneticButton>
            <a
              href="#projects"
              className={cn(
                btnBase,
                "border-accent bg-accent font-medium text-[#0a0a0a] hover:bg-[#8ceec7] hover:text-[#0a0a0a]",
              )}
            >
              View projects
            </a>
          </MagneticButton>
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className={btnBase}
          >
            GitHub ↗
          </a>
          <a href={socials.email} className={btnBase}>
            {socials.email.replace(/^mailto:/, "")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
