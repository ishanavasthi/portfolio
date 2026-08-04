"use client";

import { motion, type Variants } from "framer-motion";
import { SectionHead } from "@/components/layout/section-head";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function About() {
  const skipEntrance = useSkipEntrance();
  return (
    <section
      id="about"
      className="border-b border-border py-[88px]"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <SectionHead index="01" title="About" />

        <motion.div
          variants={container}
          initial={skipEntrance ? "show" : "hidden"}
          whileInView={skipEntrance ? undefined : "show"}
          animate={skipEntrance ? "show" : undefined}
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          <motion.p
            variants={item}
            className="max-w-[680px] text-[19px] leading-[1.7] text-[var(--text-dim)]"
          >
            I&apos;m a CS undergrad at BITS Pilani working on AI engineering.
            I build{" "}
            <strong className="font-medium text-foreground">
              pipelines that retrieve the right context
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              agents that take actions
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              tooling that makes the whole thing reliable
            </strong>
            . I care about testing things properly, making systems easy to
            work with, and shipping stuff that holds up in the real world.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
