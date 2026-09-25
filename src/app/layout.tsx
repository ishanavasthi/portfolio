import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorSpotlight } from "@/components/motion/cursor-spotlight";
import { site, socials } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.title}`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
};

/** Identity for search and AI crawlers; the long-form context lives in /llms-full.txt. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  description: site.description,
  url: site.url,
  email: socials.email,
  sameAs: [socials.github, socials.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: "BITS Pilani" },
  knowsAbout: [
    "AI engineering",
    "LLM agents",
    "Multi-agent systems",
    "Model Context Protocol",
    "Retrieval-augmented generation",
    "Agent evals",
    "Voice AI",
    "Python",
    "TypeScript",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Navbar />
        <main className="pt-14">{children}</main>
        <Footer />
        <CursorSpotlight />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
