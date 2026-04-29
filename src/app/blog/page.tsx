import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { BackLink } from "@/components/layout/back-link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on AI engineering, LLM apps, and developer tooling.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section className="px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-3xl">
        <BackLink />
        <p className="text-muted-foreground mt-10 font-mono text-xs tracking-widest uppercase">
          Blog
        </p>
        <h1 className="text-foreground mt-3 text-3xl font-semibold tracking-[-0.01em] md:text-4xl">
          Writing
        </h1>

        {posts.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-sm">
            No posts yet — check back soon.
          </p>
        ) : (
          <ul className="border-border/60 mt-12 divide-y divide-[--border]">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-6 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <h2 className="text-foreground group-hover:text-[--accent] text-lg font-medium tracking-[-0.01em] transition-colors">
                      {post.title}
                    </h2>
                    <time
                      dateTime={post.date}
                      className="text-muted-foreground shrink-0 font-mono text-xs"
                    >
                      {formatPostDate(post.date)}
                    </time>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {post.summary}
                  </p>
                  <p className="text-muted-foreground/70 mt-2 font-mono text-[11px] tracking-tight">
                    {post.readingTime} min read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
