import Link from "next/link";
import { site, socials } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="mx-auto mt-16 max-w-[1080px] px-6">
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 pb-12 font-mono text-xs text-muted-foreground">
        <span>
          © {year} {site.name}
        </span>
        <div className="flex gap-5">
          <Link
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub
          </Link>
          <Link
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </Link>
          <Link href={socials.email} className="transition-colors hover:text-accent">
            Email
          </Link>
        </div>
      </footer>
    </div>
  );
}
