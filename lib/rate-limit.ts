import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Creates an Upstash Redis-backed rate limiter lazily.
 * Returns a getter function instead of the instance directly,
 * so that process.env is read at request time (Workers-safe).
 */
function createLazyRateLimiter(
  requests: number,
  window: `${number} ${"s" | "m" | "h" | "d"}`
): () => Ratelimit | null {
  let cached: Ratelimit | null | undefined;

  return () => {
    if (cached !== undefined) return cached;

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      if (process.env.NODE_ENV === "production") {
        console.error(
          "[rate-limit] CRITICAL: Redis not configured in production. Rate limiting is DISABLED. " +
          "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
        );
      }
      cached = null;
      return null;
    }

    cached = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(requests, window),
      analytics: true,
      prefix: "splice:rl",
    });
    return cached;
  };
}

// ── Pre-configured lazy limiters ─────────────────────────────

const _authLimiter = createLazyRateLimiter(5, "60 s");
const _contactLimiter = createLazyRateLimiter(3, "60 s");
const _apiLimiter = createLazyRateLimiter(30, "60 s");
const _devisLimiter = createLazyRateLimiter(3, "5 m");

/** Auth actions: 5 requests per 60 seconds per IP */
export const authLimiter = { get: _authLimiter };

/** Contact form: 3 requests per 60 seconds per IP */
export const contactLimiter = { get: _contactLimiter };

/** API general: 30 requests per 60 seconds per IP */
export const apiLimiter = { get: _apiLimiter };

/** Devis submission: 3 requests per 5 minutes per IP */
export const devisLimiter = { get: _devisLimiter };

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
  limiter: { get: () => Ratelimit | null } | Ratelimit | null,
  identifier?: string
): Promise<{ success: boolean; error?: string }> {
  const resolved = limiter && "get" in limiter ? limiter.get() : limiter;

  if (!resolved) {
    // Fail-closed in production: block all requests when Redis is missing
    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "Service temporairement indisponible." };
    }
    return { success: true };
  }

  const ip = identifier ?? (await getClientIP());
  const result = await resolved.limit(ip);

  if (!result.success) {
    return {
      success: false,
      error: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
    };
  }

  return { success: true };
}
