import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */


const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// Stricter headers for authenticated areas where embedding/cross-origin
// resource access is never legitimate. COEP is intentionally kept off the
// public site to avoid breaking 3rd-party embeds (Instagram, YouTube).
const sensitiveAreaHeaders = [
  { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
];

const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: sensitiveAreaHeaders,
      },
      {
        source: "/profil/:path*",
        headers: sensitiveAreaHeaders,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "cdn.splicestudio.fr" },
    ],
  },
  outputFileTracingExcludes: {
    "*": [
      "./node_modules/@node-rs/argon2/**/*",
      "./node_modules/@node-rs/argon2-win32-x64-msvc/**/*",
      "./node_modules/@node-rs/argon2-darwin-arm64/**/*",
      "./node_modules/@node-rs/argon2-darwin-x64/**/*",
      "./node_modules/@node-rs/argon2-linux-arm64-gnu/**/*",
      "./node_modules/@node-rs/argon2-linux-x64-gnu/**/*",
      "./node_modules/@node-rs/argon2-linux-x64-musl/**/*",
      "./node_modules/pdfkit/**/*",
      "./node_modules/fontkit/**/*",
      "./node_modules/linebreak/**/*",
      "./node_modules/png-js/**/*"
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
    optimizePackageImports: [
      "lucide-react",
      "react-hot-toast",
      "zod",
      "zustand",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias["@node-rs/argon2"] = path.resolve(__dirname, "./lib/mocks/argon2.ts");
    }
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: false,
  tunnelRoute: "/monitoring",
});
