"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { staticCapture } from "@/components/motion/use-skip-entrance";
import { cn } from "@/lib/utils";

type Phase = "visible" | "waiting" | "shown";

/**
 * next/image that fades in over 250ms once a lazy image actually arrives,
 * instead of popping in mid-scroll. Server HTML renders the image fully
 * opaque, so nothing is hidden without JS. On mount it only hides an image
 * that hasn't loaded yet; a cached one is already complete and stays put
 * with no fade, so it never flashes. Static capture never fades. Kept under
 * reduced motion: opacity only, nothing moves.
 *
 * The transition also carries `scale` (the property Tailwind 4's `scale-*`
 * sets), so callers can keep a hover scale on the image without their own
 * transition class fighting this one.
 */
export function FadeInImage({
  alt,
  className,
  onLoad,
  style,
  ...props
}: ImageProps) {
  const ref = React.useRef<HTMLImageElement>(null);
  const [phase, setPhase] = React.useState<Phase>("visible");

  React.useEffect(() => {
    const img = ref.current;
    if (staticCapture || !img || img.complete) return;
    setPhase("waiting");
  }, []);

  return (
    <Image
      ref={ref}
      alt={alt}
      {...props}
      onLoad={(e) => {
        setPhase((p) => (p === "waiting" ? "shown" : p));
        onLoad?.(e);
      }}
      className={cn(phase === "waiting" && "opacity-0", className)}
      style={{
        transition:
          "opacity 250ms cubic-bezier(0.22, 1, 0.36, 1), scale 300ms ease-out",
        ...style,
      }}
    />
  );
}
