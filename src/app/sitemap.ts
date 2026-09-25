import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { ACTIVITY_SYNCED_AT } from "@/lib/project-activity";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0]?.date;

  return [
    { url: site.url, lastModified: ACTIVITY_SYNCED_AT, priority: 1 },
    { url: `${site.url}/projects`, lastModified: ACTIVITY_SYNCED_AT, priority: 0.9 },
    { url: `${site.url}/blog`, lastModified: latestPost, priority: 0.7 },
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.date,
      priority: 0.6,
    })),
    { url: `${site.url}/llms.txt`, lastModified: ACTIVITY_SYNCED_AT, priority: 0.5 },
    { url: `${site.url}/llms-full.txt`, lastModified: ACTIVITY_SYNCED_AT, priority: 0.5 },
  ];
}
