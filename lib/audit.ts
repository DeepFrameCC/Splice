import { Prisma } from "@prisma/client";
import { db } from "./db";
import { headers } from "next/headers";
import type { AuditAction } from "@prisma/client";

interface AuditEntry {
  action: AuditAction;
  userId?: string | null;
  target?: string;
  metadata?: Prisma.InputJsonValue;
}

async function getRequestInfo() {
  try {
    const h = await headers();
    return {
      ipAddress:
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        h.get("x-real-ip") ??
        null,
      userAgent: h.get("user-agent") ?? null,
    };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

/**
 * Log an auditable action. Fire-and-forget — never throws.
 * Safe to call from any server context (actions, API routes).
 */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const { ipAddress, userAgent } = await getRequestInfo();

    await db.auditLog.create({
      data: {
        action: entry.action,
        userId: entry.userId ?? null,
        target: entry.target ?? null,
        metadata: entry.metadata ?? undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    console.error("[audit] Failed to write audit log:", err);
  }
}
