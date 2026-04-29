import { Socials } from "@/components/layout/socials";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border/60 mt-24 border-t">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-4 md:px-6">
        <span className="text-foreground text-sm font-medium tracking-tight">
          {site.name}
        </span>
        <Socials />
        <span className="text-muted-foreground text-xs">
          © {year} {site.name}
        </span>
      </div>
    </footer>
  );
}
