import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint for monitoring and deployment orchestration.
 * GET /api/health
 *
 * Returns:
 * - 200 with status "healthy" when the database is reachable within 5s.
 * - 503 with status "degraded" when the database is unreachable or too slow.
 *
 * Includes `dbLatencyMs` to help diagnose slow DB responses before they
 * escalate into 504 timeouts on production.
 *
 * Optional dependencies (Stripe / Resend / Upstash) are reported as
 * "configured" / "missing" only — we don't open external connections from a
 * health probe because that would be both slow and abuse-prone if exposed.
 */
export async function GET() {
  const checks: Record<string, string | number> = {};
  let healthy = true;

  // Database — hard dependency with explicit 5s timeout.
  const dbStart = Date.now();
  try {
    await Promise.race([
      db.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB health check timeout (5s)")), 5000),
      ),
    ]);
    checks.database = "ok";
    checks.dbLatencyMs = Date.now() - dbStart;
  } catch (e) {
    checks.database = "error";
    checks.dbLatencyMs = Date.now() - dbStart;
    checks.dbError = e instanceof Error ? e.message : String(e);
    healthy = false;
  }

  // Optional dependencies: presence-only checks.
  checks.stripe = process.env.STRIPE_SECRET_KEY ? "configured" : "missing";
  checks.resend = process.env.RESEND_API_KEY ? "configured" : "missing";
  checks.upstash = process.env.UPSTASH_REDIS_REST_URL ? "configured" : "missing";

  const status = healthy ? "healthy" : "degraded";
  const code = healthy ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: code },
  );
}
