import { htmlUrl, markdownFor, markdownPaths } from "@/lib/markdown-pages";

/**
 * Internal target for src/middleware.ts, which rewrites `<page>.md` and
 * `Accept: text/markdown` requests here. Prerendered at build time.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return markdownPaths().map((p) => ({ path: p ? p.split("/") : [] }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const path = (await params).path?.join("/") ?? "";
  const body = markdownFor(path);
  if (body === null) return new Response("Not found\n", { status: 404 });

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      // Same content as the HTML page: point search engines there.
      Link: `<${htmlUrl(path)}>; rel="canonical"`,
      Vary: "Accept",
    },
  });
}
