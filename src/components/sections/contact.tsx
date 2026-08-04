"use client";

import { motion } from "framer-motion";
import { SectionHead } from "@/components/layout/section-head";
import { socials } from "@/lib/site";
import {
  fadeUpItem,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motion/variants";
import { Reveal } from "@/components/motion/reveal";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

const email = socials.email.replace(/^mailto:/, "");

export function Contact() {
  const skipEntrance = useSkipEntrance();
  return (
    <section id="contact" className="py-[88px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal direction="up">
          <SectionHead index="04" title="Contact" />
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
