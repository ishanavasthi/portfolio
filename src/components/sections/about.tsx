"use client";

import { motion, type Variants } from "framer-motion";

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
  return (
    <section id="about" className="px-4 py-24 md:px-6 md:py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="mx-auto max-w-3xl"
      >
        <motion.p
          variants={item}
          className="text-muted-foreground font-mono text-xs tracking-widest uppercase"
        >
          About
        </motion.p>

        <motion.p
          variants={item}
          className="text-foreground/90 mt-6 text-lg leading-relaxed md:text-xl"
        >
          I&apos;m a CS undergrad at BITS Pilani working on AI engineering. 
          I build the layer between raw language models and working products: 
          pipelines that retrieve the right context, agents that take actions, 
          and tooling that makes the whole thing reliable. 
          I care about testing things properly, making systems easy to work with, 
          and shipping stuff that holds up in the real world.
        </motion.p>
      </motion.div>
    </section>
  );
}
