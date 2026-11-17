import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { ACTIVITY_SYNCED_AT } from "@/lib/project-activity";

/**
 * HTML pages only (the llms files are found through robots and /llms.txt), and
 * each date is when that page's content last changed: the GitHub sync for the
 * project pages, the newest post for the blog.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const projectsUpdated = ACTIVITY_SYNCED_AT.slice(0, 10);
  const latestPost = posts[0]?.date;

  return [
    { url: `${site.url}/`, lastModified: projectsUpdated },
    { url: `${site.url}/projects`, lastModified: projectsUpdated },
    { url: `${site.url}/blog`, lastModified: latestPost },
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.date,
    })),
  ];
}
