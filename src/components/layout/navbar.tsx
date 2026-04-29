"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Socials } from "@/components/layout/socials";
import { navLinks, site } from "@/lib/site";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background"
    >
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 md:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <Link
            href="/"
            className="text-foreground hover:text-[--accent] text-sm font-medium tracking-tight transition-colors"
          >
            {site.name}
          </Link>
        </motion.div>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.href}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={i + 1}
            >
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-[--accent] text-sm transition-colors"
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={navLinks.length + 1}
          className="hidden items-center md:flex"
        >
          <span aria-hidden className="bg-border mr-2 h-4 w-px" />
          <Socials />
        </motion.div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="md:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-border bg-background">
            <SheetHeader>
              <SheetTitle className="text-left text-sm font-medium tracking-tight">
                {site.name}
              </SheetTitle>
            </SheetHeader>
            <ul className="mt-6 flex flex-col gap-4 px-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-foreground hover:text-[--accent] text-base transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 px-4">
              <Socials />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
}
