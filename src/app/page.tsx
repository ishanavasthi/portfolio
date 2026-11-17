import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { graph, ids, pageMetadata, personNode } from "@/lib/seo";
import { site } from "@/lib/site";
import { ACTIVITY_SYNCED_AT } from "@/lib/project-activity";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { GitHubActivity } from "@/components/sections/github-activity";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} - ${site.title}`,
  description: site.metaDescription,
  path: "/",
});

/** Identity for search and AI crawlers; the long-form context lives in /llms-full.txt. */
const homeJsonLd = graph(
  {
    "@type": "WebSite",
    "@id": ids.website,
    url: `${site.url}/`,
    name: site.name,
    inLanguage: "en",
    publisher: { "@id": ids.person },
  },
  {
    "@type": "ProfilePage",
    "@id": ids.profile,
    url: `${site.url}/`,
    name: `${site.name} - ${site.title}`,
    isPartOf: { "@id": ids.website },
    mainEntity: { "@id": ids.person },
    dateModified: ACTIVITY_SYNCED_AT.slice(0, 10),
  },
  personNode,
);

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <Hero />
      <Stats />
      <About activity={<GitHubActivity />} />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
