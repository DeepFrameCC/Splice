"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { apiLimiter, checkRateLimit } from "@/lib/rate-limit";

// Only consent types managed by the public cookie banner are accepted here.
// Other ConsentType values (NEWSLETTER, DONNEES_PERSONNELLES, ...) must go
// through their own authenticated server actions.
const BANNER_CONSENT_TYPES = ["COOKIES_ESSENTIELS", "COOKIES_ANALYTICS"] as const;

const consentSchema = z.object({
  consents: z
    .array(
      z.object({
        type: z.enum(BANNER_CONSENT_TYPES),
        granted: z.boolean(),
      }),
    )
    .min(1)
    .max(BANNER_CONSENT_TYPES.length),
});

export async function saveConsent(
  consents: { type: (typeof BANNER_CONSENT_TYPES)[number]; granted: boolean }[],
): Promise<{ ok: boolean; error?: string }> {
  // Rate-limit unauthenticated form submissions (fail-open for cookie consent).
  try {
    const rl = await checkRateLimit(apiLimiter);
    if (!rl.success) {
      console.warn("[consent] Rate limit hit or blocked:", rl.error);
    }
  } catch (rlErr) {
    console.error("[consent] Rate limiter error:", rlErr);
  }

  const parsed = consentSchema.safeParse({ consents });
  if (!parsed.success) {
    return { ok: false, error: "Données de consentement invalides" };
  }

  // De-duplicate by type (keep last) to defend against repeated entries.
  const deduped = new Map<string, { type: (typeof BANNER_CONSENT_TYPES)[number]; granted: boolean }>();
  for (const c of parsed.data.consents) deduped.set(c.type, c);

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  try {
    for (const c of deduped.values()) {
      await db.consentLog.create({
        data: {
          userId,
          consentType: c.type,
          granted: c.granted,
          ipAddress: ip,
        },
      });
    }
  } catch (err) {
    console.error("[consent] Failed to persist consent log:", err);
    // Consent was already saved client-side (localStorage).
    // Don't break the UX if the server-side audit log fails.
    return { ok: true };
  }

  return { ok: true };
}
