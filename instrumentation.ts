import * as Sentry from "@sentry/nextjs";

/**
 * Server-side instrumentation hook.
 *
 * Server-side Sentry is enabled on Cloudflare Workers thanks to the
 * `nodejs_compat` flag + `compatibility_date >= 2025-08-16` set in wrangler.jsonc,
 * which provide the Node APIs the SDK requires. Client-side init lives in
 * instrumentation-client.ts.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures errors from Server Components, route handlers, and middleware.
// Requires @sentry/nextjs >= 8.28.0. Silences the build-time onRequestError warning.
export const onRequestError = Sentry.captureRequestError;
