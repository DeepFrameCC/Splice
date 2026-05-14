"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { ConsentType } from "@prisma/client";

export async function saveConsent(consents: { type: ConsentType; granted: boolean }[]) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  await db.consentLog.createMany({
    data: consents.map((c) => ({
      userId: userId ?? null,
      consentType: c.type,
      granted: c.granted,
      ipAddress: ip,
    })),
  });
}
