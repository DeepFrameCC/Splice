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
    // Détail loggé côté serveur uniquement — jamais exposé dans la réponse
    // publique (fuite d'internals DB).
    console.error("[health] DB check failed:", e);
    checks.database = "error";
    checks.dbLatencyMs = Date.now() - dbStart;
    healthy = false;
  }

  const status = healthy ? "healthy" : "degraded";
  const code = healthy ? 200 : 503;

  // Réponse publique minimale : statut + latence DB. La configuration des
  // intégrations (Stripe/Resend/Upstash) n'est pas divulguée sans authentification.
  return NextResponse.json(
    { status, timestamp: new Date().toISOString(), dbLatencyMs: checks.dbLatencyMs },
    { status: code },
  );
}
