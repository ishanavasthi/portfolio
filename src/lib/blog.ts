import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogFrontmatter = {
  title: string;
  date: string;
  summary: string;
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  readingTime: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

const WORDS_PER_MINUTE = 220;

function calcReadingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~\[\]\(\)!-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function assertFrontmatter(
  data: Record<string, unknown>,
  slug: string,
): BlogFrontmatter {
  const { title, date, summary } = data;
  if (typeof title !== "string" || typeof date !== "string" || typeof summary !== "string") {
    throw new Error(
      `Blog post "${slug}" is missing required frontmatter (title, date, summary).`,
    );
  }
  return { title, date, summary };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = assertFrontmatter(data, slug);
  return {
    ...fm,
    slug,
    content,
    readingTime: calcReadingTime(content),
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const post = getPost(slug);
      if (!post) return null;
      const { content: _content, ...meta } = post;
      void _content;
      return meta;
    })
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatPostDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
