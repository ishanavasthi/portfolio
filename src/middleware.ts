import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves the Markdown version of a page (src/app/md) when the client asks for
 * it, either at `<page>.md` (`/index.md` for home) or with an Accept header
 * that prefers `text/markdown` over `text/html`. Everything else passes
 * through untouched, so browsers keep getting the cached HTML.
 */
const MARKDOWN_PAGES = /^\/(?:|projects|blog|blog\/[^/.]+)$/;

/** q-value of a media type in an Accept header, 0 if absent. */
function quality(accept: string, type: string): number {
  for (const part of accept.split(",")) {
    const [media, ...params] = part.trim().split(";");
    if (media.trim().toLowerCase() !== type) continue;
    const q = params.find((p) => p.trim().startsWith("q="));
    return q ? Number(q.trim().slice(2)) || 0 : 1;
  }
  return 0;
}

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const md = quality(accept, "text/markdown");
  return md > 0 && md >= quality(accept, "text/html");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let page: string | null = null;
  if (pathname.endsWith(".md")) {
    const stem = pathname.slice(0, -3);
    page = stem === "/index" ? "/" : stem;
  } else if (wantsMarkdown(request.headers.get("accept"))) {
    page = pathname;
  }

  if (page === null || !MARKDOWN_PAGES.test(page)) {
    const response = NextResponse.next();
    if (MARKDOWN_PAGES.test(pathname)) response.headers.set("Vary", "Accept");
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/md${page === "/" ? "" : page}`;
  return NextResponse.rewrite(url);
}

export const config = {
  runtime: "nodejs",
  matcher: ["/", "/index.md", "/projects", "/projects.md", "/blog", "/blog.md", "/blog/:slug"],
};
