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

  // Allow Cloudflare Workers cron (no auth header) OR valid bearer token
  const isCloudfareCron = request.headers.get("cf-worker") !== null;
  const isValidBearer = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isCloudfareCron && !isValidBearer) {
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
      {
        status: "error",
        dbLatencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 503 },
    );
  }
}
