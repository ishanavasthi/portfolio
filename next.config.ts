import type { NextConfig } from "next";

/**
 * Baseline security headers for every route. No CSP yet: Vercel Analytics,
 * Speed Insights and Next's inline bootstrap scripts would need nonces first.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The old Hashnode blog is retired; its posts weren't carried over, so
        // every URL on that host lands on the current blog index.
        source: "/:path*",
        has: [{ type: "host", value: "blog.ishanavasthi.in" }],
        destination: "https://ishanavasthi.in/blog",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
