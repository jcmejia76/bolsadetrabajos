import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  // 'self' (not 'none') — the app embeds its own /api/files/* PDFs in an
  // inline <iframe> preview (see candidato/cv/[id]/page.tsx); still blocks
  // third-party clickjacking, which is what this header actually defends against.
  "frame-ancestors 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // 'unsafe-eval' only outside production — Turbopack/React dev tooling relies on
  // eval() for HMR and cross-environment stack reconstruction; React itself
  // guarantees it never uses eval() in a production build.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.basemaps.cartocdn.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.basemaps.cartocdn.com",
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // SAMEORIGIN (not DENY) for the same reason as frame-ancestors above.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
