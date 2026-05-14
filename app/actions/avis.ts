"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { contactLimiter, checkRateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";
import { auth } from "@/lib/auth";

const schema = z.object({
  auteurNom: z.string().min(2, "Nom trop court").max(100),
  contenu: z.string().min(10, "Avis trop court (min 10 caractères)").max(1000, "Avis trop long (max 1000 caractères)"),
  note: z.number().int().min(1).max(5),
});

export async function submitAvis(payload: z.infer<typeof schema>) {
  const rl = await checkRateLimit(contactLimiter);
  if (!rl.success) throw new Error(rl.error ?? "Trop de tentatives");

  const data = schema.parse(payload);

  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  await db.avis.create({
    data: {
      auteurNom: data.auteurNom,
      contenu: data.contenu,
      note: data.note,
      approuve: false,
    },
  });

  await audit({ action: "ADMIN_ACTION", userId, metadata: { type: "avis_submitted", auteur: data.auteurNom } });
  revalidatePath("/avis");
}
