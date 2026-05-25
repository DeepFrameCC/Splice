/**
 * Server-side instrumentation hook.
 *
 * Sentry server-side init is disabled on Cloudflare Workers because
 * Next.js loads this file via dynamic require() which is not supported
 * in the ESM Worker runtime. Client-side Sentry remains active via
 * instrumentation-client.ts.
 */
export async function register() {
  // no-op on Workers — Sentry client-side only
}
