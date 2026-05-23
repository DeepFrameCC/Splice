import * as Sentry from "@sentry/nextjs";

interface ErrorContext {
  [key: string]: unknown;
  userId?: string;
  route?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Capture an error for monitoring.
 * Uses Sentry when configured, falls back to structured console logging.
 * Safe to call anywhere — never throws.
 */
export function captureException(error: unknown, context?: ErrorContext): void {
  try {
    if (Sentry.isInitialized()) {
      Sentry.captureException(error, { extra: context });
    } else if (process.env.NODE_ENV === "production") {
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
    if (Sentry.isInitialized()) {
      Sentry.captureMessage(message, {
        level: level === "warning" ? "warning" : level,
        extra: context,
      });
    } else {
      const logFn = level === "error" ? console.error : level === "warning" ? console.warn : console.info;
      logFn(`[monitoring:${level}]`, message, context ?? "");
    }
  } catch {
    // Monitoring should never crash the app
  }
}
