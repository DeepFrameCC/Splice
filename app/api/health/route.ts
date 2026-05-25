import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint for monitoring and deployment orchestration.
 * GET /api/health
 *
 * Returns:
 * - 200 with status "healthy" when the database is reachable.
 * - 503 with status "degraded" when the database is unreachable.
 *
 * Optional dependencies (Stripe / Resend / Upstash) are reported as
 * "configured" / "missing" only — we don't open external connections from a
 * health probe because that would be both slow and abuse-prone if exposed.
 */
export async function GET() {
  const checks: Record<string, "ok" | "error" | "configured" | "missing"> = {};
  let healthy = true;

  // Database — hard dependency.
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
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
    { status: code }
  );
}
