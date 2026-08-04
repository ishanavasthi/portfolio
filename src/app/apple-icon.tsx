import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Glyph only, no tile: iOS applies its own rounded-corner mask and renders any
// transparency as black, so the background is painted full-bleed below instead.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <g fill="#6ee7b7">
    <rect x="5" y="8" width="9" height="3.2"/>
    <rect x="7.9" y="8" width="3.2" height="16"/>
    <rect x="5" y="20.8" width="9" height="3.2"/>
  </g>
  <g stroke="#6ee7b7" stroke-width="3.2" fill="none" stroke-linejoin="round" stroke-linecap="butt">
    <path d="M18 24 L22.5 9.6 L27 24"/>
    <path d="M19.2 19.5 L25.8 19.5"/>
  </g>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <img
          width={160}
          height={160}
          alt="IA"
          src={`data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`}
        />
      </div>
    ),
    size,
  );
}
