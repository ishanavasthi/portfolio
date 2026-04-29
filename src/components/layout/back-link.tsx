import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackLink({
  href = "/",
  label = "back to home",
  className,
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-muted-foreground hover:text-[--accent] group inline-flex items-center gap-1.5 font-mono text-xs tracking-tight transition-colors",
        className,
      )}
    >
      <ArrowLeft
        className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
        aria-hidden
      />
      {label}
    </Link>
  );
}
