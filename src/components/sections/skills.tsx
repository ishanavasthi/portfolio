"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHead } from "@/components/layout/section-head";
import { SKILLS } from "@/lib/skills";
import {
  fadeUpItem,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motion/variants";
import { Reveal } from "@/components/motion/reveal";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";

export function Skills() {
  const skipEntrance = useSkipEntrance();
  return (
    <section id="skills" className="border-b border-border py-[88px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal direction="up">
          <SectionHead index="02" title="Skills — with receipts" />
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial={skipEntrance ? "show" : "hidden"}
          whileInView={skipEntrance ? undefined : "show"}
          animate={skipEntrance ? "show" : undefined}
          viewport={VIEWPORT_ONCE}
        >
          {SKILLS.map((category, i) => {
            const proof = category.proof();
            return (
              <motion.div
                key={category.name}
                variants={fadeUpItem}
                className={cn(
                  "grid grid-cols-1 gap-3 border-t border-border py-6 md:grid-cols-[200px_1fr_140px] md:gap-6",
                  i === SKILLS.length - 1 && "border-b",
                )}
              >
                <div className="font-mono text-[13px] font-medium text-foreground">
                  {category.name}
                  {category.sub && (
                    <em className="mt-1 block text-[11px] font-normal text-muted-foreground not-italic">
                      {category.sub}
                    </em>
                  )}
                </div>

                <div className="flex flex-wrap content-start gap-2">
                  {category.chips.map((chip) => (
                    <span
                      key={chip.label}
                      className={cn(
                        "rounded-[4px] border border-border px-[10px] py-1 font-mono text-xs text-[var(--text-dim)] transition-colors duration-[180ms] ease-out hover:border-accent hover:text-accent",
                        chip.hot &&
                          "border-[rgba(110,231,183,0.35)] text-accent",
                      )}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>

                <div className="text-left font-mono text-xs leading-[1.5] text-muted-foreground md:text-right">
                  <b className="font-medium text-accent">{proof.value}</b>{" "}
                  {proof.unit}
                  {proof.secondaryValue && (
                    <>
                      {" · "}
                      <b className="font-medium text-accent">
                        {proof.secondaryValue}
                      </b>{" "}
                      {proof.secondaryUnit}
                    </>
                  )}
                  {proof.note && (
                    <>
                      <br />
                      {proof.note}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
