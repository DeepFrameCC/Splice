import * as Sentry from "@sentry/nextjs";

// Server-side Sentry init.
// Re-enabled on Cloudflare Workers: wrangler.jsonc sets `nodejs_compat` and
// `compatibility_date: 2025-09-01` (>= 2025-08-16), which provide the Node APIs
// (incl. https.request) the SDK needs. Previously a no-op when those flags were absent.
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  enableLogs: true,
});
