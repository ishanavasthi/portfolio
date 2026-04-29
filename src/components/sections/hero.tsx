"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export function Hero() {
  return (
    <section className="px-4 py-24 md:px-6 md:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl"
      >
        <motion.h1
          variants={item}
          className="text-foreground text-5xl font-semibold tracking-tight md:text-7xl"
        >
          {site.name}
        </motion.h1>

        <motion.p
          variants={item}
          className="text-muted-foreground mt-6 font-mono text-sm md:text-base"
        >
          <span>{site.title}</span>
          <span
            aria-hidden
            className="bg-[--accent] ml-1 inline-block h-[1em] w-[0.55ch] translate-y-[0.12em] align-baseline"
            style={{ animation: "caret-blink 1.1s steps(1, end) infinite" }}
          />
        </motion.p>

        <motion.p
          variants={item}
          className="text-foreground/85 mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
        >
          {site.description}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "border-border text-foreground hover:bg-transparent hover:text-[--accent] border transition-transform hover:scale-[1.01]",
            )}
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "text-muted-foreground hover:bg-transparent hover:text-[--accent] transition-transform hover:scale-[1.01]",
            )}
          >
            Read Blog
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
