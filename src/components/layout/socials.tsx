import Link from "next/link";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { socials } from "@/lib/site";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand";

const items = [
  { href: socials.github, label: "GitHub", icon: GithubIcon, external: true },
  {
    href: socials.linkedin,
    label: "LinkedIn",
    icon: LinkedinIcon,
    external: true,
  },
  { href: socials.email, label: "Email", icon: Mail, external: false },
] as const;

export function Socials({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {items.map(({ href, label, icon: Icon, external }) => (
        <li key={label}>
          <Link
            href={href}
            aria-label={label}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-muted-foreground hover:text-[--accent] inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <Icon className="h-4 w-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
