"use server";

import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  return session?.user?.id;
}

/**
 * Anonymise un utilisateur (RGPD droit à l'oubli).
 * - Remplace les données personnelles par "[supprimé]"
 * - Conserve les factures (obligation légale 10 ans)
 * - Conserve les devis/contrats avec données anonymisées
 */
export async function anonymiserUtilisateur(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = await requireAdmin();
    if (userId === adminId) return { success: false, error: "Impossible de vous anonymiser vous-même" };

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, pseudo: true, role: true },
    });
    if (!user) return { success: false, error: "Utilisateur introuvable" };

    const timestamp = Date.now();
    const anonEmail = `supprime_${timestamp}@anonyme.local`;
    const anonPseudo = `supprime_${timestamp}`;

    // ─── Écritures Séquentielles Sans Transaction (pour compatibilité Neon HTTP) ───

    // 1. Anonymiser le profil (findUnique + update car updateMany utilise des transactions implicites)
    const profile = await db.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (profile) {
      await db.profile.update({
        where: { id: profile.id },
        data: {
          prenom: "[supprimé]",
          nom: "[supprimé]",
          nomEntreprise: null,
          adresse: null,
          codePostal: null,
          ville: null,
          tel: null,
          bio: null,
          avatarUrl: null,
        },
      });
    }

    // 2. Anonymiser l'utilisateur
    await db.user.update({
      where: { id: userId },
      data: {
        email: anonEmail,
        pseudo: anonPseudo,
        passwordHash: "ANONYMIZED",
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    // 3. Anonymiser les devis (récupération + boucle d'écritures séquentielles car updateMany utilise des transactions implicites)
    const devisList = await db.devis.findMany({
      where: { userId },
      select: { id: true },
    });
    for (const d of devisList) {
      await db.devis.update({
        where: { id: d.id },
        data: {
          nomContact: "[supprimé]",
          nomEntreprise: "[supprimé]",
          emailContact: anonEmail,
          telContact: "[supprimé]",
          lieuTournage: "[supprimé]",
          remarques: null,
        },
      });
    }

    // 4. Supprimer les sessions
    await db.session.deleteMany({ where: { userId } });

    // 5. Supprimer les likes
    await db.like.deleteMany({ where: { userId } });

    // 6. Supprimer les notifications
    await db.notification.deleteMany({ where: { userId } });

    // 7. Supprimer les consentements
    await db.consentLog.deleteMany({ where: { userId } });

    await audit({
      action: "ADMIN_ACTION",
      userId: adminId,
      target: userId,
      metadata: {
        type: "user_anonymized",
        originalEmail: user.email.slice(0, 3) + "***",
        originalPseudo: user.pseudo,
      },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath(`/admin/utilisateurs/${userId}`);

    return { success: true };
  } catch (err: any) {
    console.error("[admin-clients] Anonymisation request error:", err);
    return {
      success: false,
      error: `Erreur lors de l'anonymisation : ${err?.message ?? String(err)}`,
    };
  }
}
