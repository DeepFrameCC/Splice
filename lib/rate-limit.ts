import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Creates an Upstash Redis-backed rate limiter.
 * Falls back to no-op when UPSTASH_REDIS_REST_URL is not configured (dev mode).
 */
function createRateLimiter(
  requests: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`
) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[rate-limit] CRITICAL: Redis not configured in production. Rate limiting is DISABLED. " +
        "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
      );
    }
    return null;
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "splice:rl",
  });
}

// ── Pre-configured limiters ─────────────────────────────────

/** Auth actions: 5 requests per 60 seconds per IP */
export const authLimiter = createRateLimiter(5, "60 s");

/** Contact form: 3 requests per 60 seconds per IP */
export const contactLimiter = createRateLimiter(3, "60 s");

/** API general: 30 requests per 60 seconds per IP */
export const apiLimiter = createRateLimiter(30, "60 s");

/** Devis submission: 3 requests per 5 minutes per IP */
export const devisLimiter = createRateLimiter(3, "5 m");

// ── Helper ──────────────────────────────────────────────────

/** Get client IP from request headers */
export async function getClientIP(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Check rate limit. Returns { success: true } if allowed,
 * or { success: false, error: string } if blocked.
 * When Redis is not configured (dev), always allows.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier?: string
): Promise<{ success: boolean; error?: string }> {
  if (!limiter) {
    // Temporarily disabled fail-closed in production for Vercel tests without Redis
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] WARNING: Redis is not configured. Rate limiting is temporarily bypassed."
      );
    }
    return { success: true };
  }

  const ip = identifier ?? (await getClientIP());
  const result = await limiter.limit(ip);

  if (!result.success) {
    return {
      success: false,
      error: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
    };
  }

  return { success: true };
}
