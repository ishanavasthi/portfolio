import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { BackLink } from "@/components/layout/back-link";
import { SectionHead } from "@/components/layout/section-head";

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

        <div className="mt-10">
          <SectionHead index="01" title="Blog" />
        </div>
        <h1 className="text-foreground -mt-6 text-3xl font-semibold tracking-[-0.01em] md:text-4xl">
          Writing
        </h1>

        {posts.length === 0 ? (
          <p className="text-muted-foreground mt-12 text-sm">
            No posts yet - check back soon.
          </p>
        ) : (
          <ul className="mt-12 border-b border-border">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block border-t border-border py-7 transition-colors duration-[180ms] ease-out"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <h2 className="text-foreground group-hover:text-accent text-lg font-medium tracking-[-0.01em] transition-colors duration-[180ms] ease-out">
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
                  <p className="text-muted-foreground/70 mt-3 font-mono text-[11px] tracking-widest uppercase">
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
