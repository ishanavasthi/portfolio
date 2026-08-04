"use client";

import { motion, type Variants } from "framer-motion";
import { SectionHead } from "@/components/layout/section-head";
import { socials } from "@/lib/site";
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

const email = socials.email.replace(/^mailto:/, "");

export function Contact() {
  const skipEntrance = useSkipEntrance();
  return (
    <section id="contact" className="py-[88px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <SectionHead index="04" title="Contact" />

        <motion.div
          variants={container}
          initial={skipEntrance ? "show" : "hidden"}
          whileInView={skipEntrance ? undefined : "show"}
          animate={skipEntrance ? "show" : undefined}
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          <motion.p
            variants={item}
            className="max-w-[720px] text-[clamp(28px,4.5vw,44px)] leading-[1.25] font-semibold tracking-[-0.02em] text-foreground"
          >
            Building something with agents?
            <br />
            Let&apos;s talk —{" "}
            <a
              href={socials.email}
              className="border-b-2 border-[rgba(110,231,183,0.3)] text-accent transition-colors duration-[180ms] ease-out hover:border-accent"
            >
              {email}
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
