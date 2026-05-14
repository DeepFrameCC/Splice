import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Health check endpoint for monitoring and deployment orchestration.
 * GET /api/health
 *
 * Returns:
 * - 200 with status "healthy" when all systems operational
 * - 503 with status "degraded" when database is unreachable
 */
export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};
  let healthy = true;

  // Database check
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
    healthy = false;
  }

  const status = healthy ? "healthy" : "degraded";
  const code = healthy ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.1.0",
      checks,
    },
    { status: code }
  );
}
