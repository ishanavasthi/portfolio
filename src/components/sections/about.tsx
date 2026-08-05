"use client";

import { motion } from "framer-motion";
import { SectionHead } from "@/components/layout/section-head";
import {
  fadeUpItem,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motion/variants";
import { Reveal } from "@/components/motion/reveal";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

export function About() {
  const skipEntrance = useSkipEntrance();
  return (
    <section
      id="about"
      className="border-b border-border py-[88px]"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal direction="up">
          <SectionHead index="01" title="About" />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial={skipEntrance ? "show" : "hidden"}
          whileInView={skipEntrance ? undefined : "show"}
          animate={skipEntrance ? "show" : undefined}
          viewport={VIEWPORT_ONCE}
        >
          <motion.p
            variants={fadeUpItem}
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
