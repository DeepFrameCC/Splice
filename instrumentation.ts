import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      sendDefaultPii: true,
      tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
      includeLocalVariables: true,
      enableLogs: true,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      sendDefaultPii: true,
      tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
      enableLogs: true,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
