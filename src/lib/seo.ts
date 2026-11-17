import type { Metadata } from "next";
import { site, socials } from "@/lib/site";

/** Stable node IDs so JSON-LD blocks on different pages describe one graph. */
export const ids = {
  person: `${site.url}/#person`,
  website: `${site.url}/#website`,
  profile: `${site.url}/#profile`,
} as const;

/** The generated 1200×630 card in `app/opengraph-image.tsx`. */
export const shareImageUrl = `${site.url}/opengraph-image`;

/**
 * Next only attaches the file-based card to pages that don't set their own
 * `openGraph`/`twitter`, so pages that do name it explicitly.
 */
const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${site.name}, ${site.title}`,
};

export const rssAlternate = {
  "application/rss+xml": [{ url: "/rss.xml", title: `${site.name} - Blog` }],
};

/**
 * Per-page canonical and Open Graph fields. Next replaces (not merges) the
 * `openGraph` object from the layout when a page sets one, so every page goes
 * through here to keep `siteName`, `locale` and `type` on each.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: {
  /** The full title as it should read in a share card. */
  title: string;
  description: string;
  /** Path with a leading slash, resolved against `metadataBase`. */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  return {
    description,
    // Setting `alternates` replaces the layout's, so the feed link is repeated.
    alternates: { canonical: path, types: rssAlternate },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_US",
      url: path,
      title,
      description,
      images: [shareImage],
      ...(type === "article"
        ? { publishedTime, authors: [site.url] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export const personNode = {
  "@type": "Person",
  "@id": ids.person,
  name: site.name,
  jobTitle: site.title,
  description:
    "AI engineer and CS undergraduate at BITS Pilani, India, building LLM agents, RAG systems and agent evals.",
  url: `${site.url}/`,
  image: shareImageUrl,
  email: socials.email,
  homeLocation: { "@type": "Country", name: "India" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "BITS Pilani" },
  sameAs: [socials.github, socials.linkedin],
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

export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
