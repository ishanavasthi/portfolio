import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

export const alt = `${site.name}, ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0a0a";
const ACCENT = "#6ee7b7";
const DIM = "#a3a3a3";
const BORDER = "#262626";

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

/** The site-wide link-preview card. Rendered once at build time. */
export default async function OpengraphImage() {
  const [sans, sansBold, mono] = await Promise.all([
    readFile(path.join(fontDir, "geist-sans/Geist-Regular.ttf")),
    readFile(path.join(fontDir, "geist-sans/Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "geist-mono/GeistMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: BG,
          color: "#ededed",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: DIM,
          }}
        >
          <span style={{ color: ACCENT }}>●</span>
          {site.status}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div style={{ fontSize: 44, color: ACCENT, fontWeight: 600 }}>
            {site.title}
          </div>
          <div style={{ fontSize: 30, color: DIM, maxWidth: 1040, lineHeight: 1.4 }}>
            {site.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 28,
            fontFamily: "Geist Mono",
            fontSize: 22,
            color: DIM,
          }}
        >
          <span>{site.url.replace("https://", "")}</span>
          <span>
            {projects.length} projects · {site.location}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, weight: 400, style: "normal" },
        { name: "Geist", data: sansBold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
