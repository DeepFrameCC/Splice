"use server";

import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  return (session?.user as { id?: string } | undefined)?.id;
}

/**
 * Anonymise un utilisateur (RGPD droit à l'oubli).
 * - Remplace les données personnelles par "[supprimé]"
 * - Conserve les factures (obligation légale 10 ans)
 * - Conserve les devis/contrats avec données anonymisées
 */
export async function anonymiserUtilisateur(userId: string) {
  const adminId = await requireAdmin();
  if (userId === adminId) throw new Error("Impossible de vous anonymiser vous-même");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, pseudo: true, role: true },
  });
  if (!user) throw new Error("Utilisateur introuvable");

  const timestamp = Date.now();
  const anonEmail = `supprime_${timestamp}@anonyme.local`;
  const anonPseudo = `supprime_${timestamp}`;

  await db.$transaction(async (tx) => {
    // Anonymiser le profil
    await tx.profile.updateMany({
      where: { userId },
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

    // Anonymiser l'utilisateur
    await tx.user.update({
      where: { id: userId },
      data: {
        email: anonEmail,
        pseudo: anonPseudo,
        passwordHash: "ANONYMIZED",
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    // Anonymiser les devis (conserver le document, anonymiser les données perso)
    await tx.devis.updateMany({
      where: { userId },
      data: {
        nomContact: "[supprimé]",
        nomEntreprise: "[supprimé]",
        emailContact: anonEmail,
        telContact: "[supprimé]",
        lieuTournage: "[supprimé]",
        remarques: null,
      },
    });

    // Supprimer les sessions
    await tx.session.deleteMany({ where: { userId } });

    // Supprimer les likes
    await tx.like.deleteMany({ where: { userId } });

    // Supprimer les notifications
    await tx.notification.deleteMany({ where: { userId } });

    // Supprimer les consentements
    await tx.consentLog.deleteMany({ where: { userId } });
  });

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
}
