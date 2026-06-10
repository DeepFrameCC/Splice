"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteObject } from "@/lib/r2/client";
import { audit } from "@/lib/audit";
import { z } from "zod";
import { revalidatePath } from "next/cache";

async function requireStaff() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "TEAM")) {
    throw new Error("Non autorisé");
  }
  return session.user;
}

const registerSchema = z.object({
  userId: z.string().min(1),
  devisId: z.string().min(1).optional().nullable(),
  titre: z.string().min(1, "Titre requis").max(160),
  description: z.string().max(2000).optional().nullable(),
  r2Key: z.string().min(1).max(512),
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1).max(127),
  taille: z.number().int().nonnegative(),
});

/**
 * Enregistre une livraison après l'upload du binaire dans R2 via /api/upload.
 * Le fichier vit déjà dans le bucket SPLICE_DELIVERIES ; ici on persiste les
 * métadonnées, on trace l'action et on notifie le client.
 */
type ActionResult = { error?: string; success?: boolean; id?: string };

export async function registerLivraison(
  input: z.infer<typeof registerSchema>,
): Promise<ActionResult> {
  const staff = await requireStaff();

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }
  const data = parsed.data;

  // La clé R2 doit être préfixée par {userId}/ : c'est ce préfixe qui autorise
  // le client à télécharger via /api/deliveries (ownership check anti-IDOR).
  if (!data.r2Key.startsWith(`${data.userId}/`)) {
    return { error: "Clé de fichier incohérente avec le client destinataire." };
  }

  const client = await db.user.findUnique({ where: { id: data.userId }, select: { id: true } });
  if (!client) return { error: "Client introuvable." };

  // Si un devis est fourni, il doit appartenir au client (cohérence + anti-IDOR).
  if (data.devisId) {
    const devis = await db.devis.findUnique({ where: { id: data.devisId }, select: { userId: true } });
    if (!devis || devis.userId !== data.userId) {
      return { error: "Ce devis n'appartient pas à ce client." };
    }
  }

  const livraison = await db.livraison.create({
    data: {
      userId: data.userId,
      devisId: data.devisId ?? null,
      titre: data.titre,
      description: data.description ?? null,
      r2Key: data.r2Key,
      fileName: data.fileName,
      contentType: data.contentType,
      taille: data.taille,
      uploadedBy: staff.id,
    },
  });

  await db.notification.create({
    data: {
      userId: data.userId,
      type: "LIVRAISON_PRETE",
      title: "Un fichier vous attend",
      message: `« ${data.titre} » est disponible dans votre espace.`,
      href: "/profil/livraisons",
    },
  });

  await audit({
    action: "LIVRAISON_UPLOADED",
    userId: staff.id,
    target: livraison.id,
    metadata: { titre: data.titre, fileName: data.fileName, taille: data.taille, client: data.userId },
  });

  revalidatePath("/admin/livraisons");
  revalidatePath("/profil/livraisons");
  return { success: true, id: livraison.id };
}

export async function deleteLivraison(id: string): Promise<ActionResult> {
  const staff = await requireStaff();

  const livraison = await db.livraison.findUnique({ where: { id } });
  if (!livraison) return { error: "Livraison introuvable." };

  // Supprime d'abord le binaire R2, puis la ligne. Si R2 échoue on stoppe
  // (mieux vaut une ligne orpheline qu'un fichier fantôme non traçable).
  try {
    await deleteObject("SPLICE_DELIVERIES", livraison.r2Key);
  } catch (e) {
    console.error("[livraisons:delete] R2 delete failed:", e);
    return { error: "Suppression du fichier impossible. Réessayez." };
  }

  await db.livraison.delete({ where: { id } });

  await audit({
    action: "LIVRAISON_DELETED",
    userId: staff.id,
    target: id,
    metadata: { titre: livraison.titre, fileName: livraison.fileName },
  });

  revalidatePath("/admin/livraisons");
  revalidatePath("/profil/livraisons");
  return { success: true };
}
