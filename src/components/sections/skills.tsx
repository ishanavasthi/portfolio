"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHead } from "@/components/layout/section-head";
import { SKILLS } from "@/lib/skills";

const ease = [0.22, 1, 0.36, 1] as const;
const staticCapture = process.env.NEXT_PUBLIC_STATIC_CAPTURE === "1";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function Skills() {
  return (
    <section id="skills" className="border-b border-border py-[88px]">
      <div className="mx-auto max-w-[1080px] px-6">
        <SectionHead index="02" title="Skills — with receipts" />

        <motion.div
          variants={container}
          initial={staticCapture ? "show" : "hidden"}
          whileInView={staticCapture ? undefined : "show"}
          animate={staticCapture ? "show" : undefined}
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          {SKILLS.map((category, i) => {
            const proof = category.proof();
            return (
              <motion.div
                key={category.name}
                variants={item}
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
