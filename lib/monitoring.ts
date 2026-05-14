/**
 * Lightweight error capture utility.
 * In production, this forwards errors to Sentry.
 * In development, it logs to console.
 *
 * To enable Sentry:
 * 1. npm install @sentry/nextjs
 * 2. Run npx @sentry/wizard@latest -i nextjs
 * 3. Set SENTRY_DSN in .env
 * 4. Replace the captureException/captureMessage below with Sentry calls
 */

interface ErrorContext {
  userId?: string;
  route?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Capture an error for monitoring.
 * Safe to call anywhere — never throws.
 */
export function captureException(error: unknown, context?: ErrorContext): void {
  try {
    // When Sentry is installed, replace with:
    // Sentry.captureException(error, { extra: context });

    if (process.env.NODE_ENV === "production") {
      console.error("[monitoring:error]", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...context,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error("[monitoring:error]", error, context);
    }
  } catch {
    // Monitoring should never crash the app
  }
}

/**
 * Capture a message/event for monitoring.
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: ErrorContext
): void {
  try {
    // When Sentry is installed, replace with:
    // Sentry.captureMessage(message, { level, extra: context });

    const logFn = level === "error" ? console.error : level === "warning" ? console.warn : console.info;
    logFn(`[monitoring:${level}]`, message, context ?? "");
  } catch {
    // Monitoring should never crash the app
  }
}
