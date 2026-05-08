"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const schema = z.object({
  auteurNom: z.string().min(2, "Nom trop court"),
  contenu: z.string().min(10, "Avis trop court (min 10 caractères)"),
  note: z.number().int().min(1).max(5)
});

export async function submitAvis(payload: z.infer<typeof schema>) {
  const data = schema.parse(payload);
  await db.avis.create({
    data: {
      auteurNom: data.auteurNom,
      contenu: data.contenu,
      note: data.note,
      approuve: false
    }
  });
  revalidatePath("/avis");
}
