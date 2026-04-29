import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import {
  formatPostDate,
  getAllPostSlugs,
  getPost,
} from "@/lib/blog";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-[--accent] inline-flex items-center gap-1.5 font-mono text-xs tracking-tight transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          back to blog
        </Link>

        <header className="mt-10">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            {post.title}
          </h1>
          <div className="text-muted-foreground mt-4 flex items-center gap-3 font-mono text-xs">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden className="bg-border h-3 w-px" />
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        <div
          className="prose prose-invert prose-neutral mt-12 max-w-none
            prose-headings:tracking-tight prose-headings:font-semibold
            prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg
            prose-p:leading-relaxed prose-p:text-foreground/85
            prose-a:text-[--accent] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-code:text-[--accent] prose-code:font-mono prose-code:text-[0.9em]
            prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[--surface] prose-pre:border prose-pre:border-border
            prose-pre:rounded-lg prose-pre:text-sm
            prose-blockquote:border-l-[--accent]/50 prose-blockquote:text-muted-foreground
            prose-blockquote:not-italic prose-blockquote:font-normal
            prose-hr:border-border
            prose-li:text-foreground/85
            prose-img:rounded-lg prose-img:border prose-img:border-border"
        >
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
