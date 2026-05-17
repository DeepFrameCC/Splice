"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Non autorisé");
  return session.user;
}

const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export async function upsertSetting(formData: FormData) {
  const admin = await requireAdmin();
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;

  const parsed = settingsSchema.safeParse({ key, value });
  if (!parsed.success) {
    return { error: "Données invalides" };
  }

  // Using metadata JSON on AuditLog as a simple settings store
  // In production, this would be a dedicated Settings model
  await db.auditLog.create({
    data: {
      userId: admin.id,
      action: "SETTINGS_UPDATED",
      target: parsed.data.key,
      metadata: { value: parsed.data.value },
    },
  });

  revalidatePath("/admin/parametres");
  return { success: true };
}
