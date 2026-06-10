import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Cron keep-alive endpoint.
 * Called every 4 minutes by a Cloudflare Cron Trigger to prevent
 * Neon PostgreSQL compute from suspending due to inactivity.
 *
 * Protected by a bearer token to prevent abuse from external callers.
 * GET /api/cron/keep-alive
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Auth principale : Bearer CRON_SECRET. Le header `cf-worker` n'est PAS une
  // garantie d'origine infalsifiable, donc il ne sert de fallback que tant
  // qu'aucun secret n'est configuré (évite de casser le keep-alive avant la
  // mise en place du secret). Dès que CRON_SECRET est défini, seul le Bearer
  // valide est accepté.
  const isValidBearer = !!cronSecret && authHeader === `Bearer ${cronSecret}`;
  const allowHeaderFallback = !cronSecret && request.headers.get("cf-worker") !== null;

  if (!isValidBearer && !allowHeaderFallback) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const start = Date.now();

  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "alive",
      dbLatencyMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[keep-alive] DB ping failed:", error);
    return NextResponse.json(
      { status: "error", dbLatencyMs: Date.now() - start },
      { status: 503 },
    );
  }
}
