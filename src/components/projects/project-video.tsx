"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSkipEntrance } from "@/components/motion/use-skip-entrance";
import { EASE_SIGNATURE } from "@/lib/motion/variants";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

/**
 * Only one card loop plays at a time. Whoever starts playing stops the
 * previous owner, so on touch two half-visible cards never run together.
 */
let currentStop: (() => void) | null = null;

function claimPlayback(stop: () => void) {
  if (currentStop && currentStop !== stop) currentStop();
  currentStop = stop;
}

function releasePlayback(stop: () => void) {
  if (currentStop === stop) currentStop = null;
}

const FINE_HOVER = "(hover: hover) and (pointer: fine)";

/**
 * A short silent loop in the card's 16/10 image slot. The poster is the
 * resting state and the whole reduced-motion experience; the video only
 * exists after mount, and only when entrance animation isn't skipped, so
 * reduced-motion and static-capture visitors never request the file. (Mounting
 * after hydration also keeps the server tree identical to the first client
 * render, the same constraint TiltCard works around.)
 *
 * Desktop (fine pointer that can hover) plays while the card is hovered or
 * has focus within it, then pauses, fades back to the poster and rewinds.
 * Touch plays while at least 60% of the slot is on screen. Either way playback
 * stops when the tab is hidden, and the video fades in over the poster only
 * once it is actually producing frames. Only opacity animates here; the slot's
 * hover scale matches the screenshot treatment and is a CSS transform.
 *
 * Listeners go on the card element (`[data-project-card]`) with
 * addEventListener, so TiltCard's React pointer handlers are untouched.
 */
export function ProjectVideo({
  video,
  className,
}: {
  video: NonNullable<Project["video"]>;
  className?: string;
}) {
  const skipEntrance = useSkipEntrance();
  const slotRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mounted, setMounted] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [docVisible, setDocVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const enabled = mounted && !skipEntrance;
  const wantPlay = enabled && engaged && docVisible;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Engagement: hover/focus-within on desktop, ≥60% visible on touch.
  useEffect(() => {
    if (!enabled) return;
    const slot = slotRef.current;
    if (!slot) return;

    if (window.matchMedia(FINE_HOVER).matches) {
      const card = slot.closest<HTMLElement>("[data-project-card]") ?? slot;
      let hovered = false;
      let focused = false;
      const sync = () => setEngaged(hovered || focused);
      const onEnter = () => {
        hovered = true;
        sync();
      };
      const onLeave = () => {
        hovered = false;
        sync();
      };
      const onFocusIn = () => {
        focused = true;
        sync();
      };
      const onFocusOut = (event: FocusEvent) => {
        if (card.contains(event.relatedTarget as Node | null)) return;
        focused = false;
        sync();
      };
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      card.addEventListener("focusin", onFocusIn);
      card.addEventListener("focusout", onFocusOut);
      return () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
        card.removeEventListener("focusin", onFocusIn);
        card.removeEventListener("focusout", onFocusOut);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => setEngaged(entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    );
    observer.observe(slot);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const onVisibility = () => setDocVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (!wantPlay) {
      el.pause();
      setShowVideo(false);
      // Rewind once the 200ms fade has handed the slot back to the poster, so
      // the jump to frame 0 is never visible.
      const rewind = window.setTimeout(() => {
        if (el.paused) el.currentTime = 0;
      }, 220);
      return () => window.clearTimeout(rewind);
    }

    // Losing the registry hands the slot back to the poster; engagement has to
    // be renewed (re-hover, or scroll back to 60%) before this one plays again.
    const stop = () => setEngaged(false);
    claimPlayback(stop);
    el.muted = true;
    el.play().catch(() => {
      // Autoplay refused (e.g. data saver): the poster simply stays.
    });
    return () => releasePlayback(stop);
  }, [wantPlay]);

  return (
    <span
      ref={slotRef}
      className={cn(
        "relative block overflow-hidden rounded-[4px] border border-border",
        className,
      )}
    >
      <span className="relative block aspect-[16/10] w-full transition-transform duration-[300ms] ease-out group-hover:scale-[1.015]">
        <Image
          src={video.poster}
          alt={video.alt}
          width={1280}
          height={800}
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-top"
        />
        {enabled ? (
          <motion.video
            ref={videoRef}
            aria-hidden
            tabIndex={-1}
            muted
            playsInline
            loop
            preload="none"
            poster={video.poster}
            disablePictureInPicture
            onPlaying={() => setShowVideo(true)}
            initial={false}
            animate={{ opacity: showVideo ? 1 : 0 }}
            transition={{ duration: 0.2, ease: EASE_SIGNATURE }}
            className="pointer-events-none absolute inset-0 size-full object-cover object-top"
          >
            {video.webm ? <source src={video.webm} type="video/webm" /> : null}
            <source src={video.mp4} type="video/mp4" />
          </motion.video>
        ) : null}
      </span>
    </span>
  );
}
