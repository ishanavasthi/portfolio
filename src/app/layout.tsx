import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorSpotlight } from "@/components/motion/cursor-spotlight";
import { site } from "@/lib/site";
import { rssAlternate } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.title}`,
    template: `%s - ${site.name}`,
  },
  description: site.metaDescription,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  // Defaults for routes without their own metadata (e.g. the 404). No
  // canonical or og:url here: those are per page, via pageMetadata.
  alternates: { types: rssAlternate },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: `${site.name} - ${site.title}`,
    description: site.metaDescription,
  },
  twitter: { card: "summary_large_image" },
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
