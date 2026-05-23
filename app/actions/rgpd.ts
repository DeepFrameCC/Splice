"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";

async function requireAuth() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("NON_AUTHENTIFIE");
  return userId;
}

/**
 * RGPD Article 15 + 20 — Right of access & data portability.
 * Returns a JSON object containing all personal data associated with the user.
 */
export async function exportMyData(): Promise<{
  success: boolean;
  data?: string;
  error?: string;
}> {
  const userId = await requireAuth();

  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) return { success: false, error: rl.error };

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      devis: {
        select: {
          numero: true,
          pack: true,
          status: true,
          totalHT: true,
          nomEntreprise: true,
          nomContact: true,
          emailContact: true,
          telContact: true,
          lieuTournage: true,
          dateTournage: true,
          remarques: true,
          createdAt: true,
        },
      },
      factures: {
        select: {
          numero: true,
          status: true,
          createdAt: true,
        },
      },
      contrats: {
        select: {
          numero: true,
          status: true,
          dateDebut: true,
          dateFin: true,
          createdAt: true,
        },
      },
      likes: {
        select: {
          mediaId: true,
          createdAt: true,
        },
      },
      notifications: {
        select: {
          type: true,
          title: true,
          message: true,
          createdAt: true,
        },
      },
      consents: {
        select: {
          consentType: true,
          granted: true,
          createdAt: true,
        },
      },
      auditLogs: {
        select: {
          action: true,
          target: true,
          ipAddress: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });

  if (!user) return { success: false, error: "Utilisateur introuvable" };

  const exportData = {
    _meta: {
      exportDate: new Date().toISOString(),
      format: "RGPD Article 15/20 — Données personnelles",
      service: "Splice",
    },
    compte: {
      email: user.email,
      pseudo: user.pseudo,
      role: user.role,
      emailVerifie: !!user.emailVerified,
      doubleAuthentification: user.twoFactorEnabled,
      dateCreation: user.createdAt.toISOString(),
    },
    profil: user.profile
      ? {
          prenom: user.profile.prenom,
          nom: user.profile.nom,
          nomEntreprise: user.profile.nomEntreprise,
          adresse: user.profile.adresse,
          codePostal: user.profile.codePostal,
          ville: user.profile.ville,
          pays: user.profile.pays,
          tel: user.profile.tel,
          age: user.profile.age,
          bio: user.profile.bio,
        }
      : null,
    devis: user.devis.map((d) => ({
      ...d,
      dateTournage: d.dateTournage?.toISOString() ?? null,
      createdAt: d.createdAt.toISOString(),
    })),
    factures: user.factures.map((f) => ({
      ...f,
      createdAt: f.createdAt.toISOString(),
    })),
    contrats: user.contrats.map((c) => ({
      ...c,
      dateDebut: c.dateDebut?.toISOString() ?? null,
      dateFin: c.dateFin?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
    })),
    likes: user.likes.map((l) => ({
      mediaId: l.mediaId,
      createdAt: l.createdAt.toISOString(),
    })),
    notifications: user.notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
    consentements: user.consents.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
    journalActivite: user.auditLogs.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  await audit({
    action: "ADMIN_ACTION",
    userId,
    target: userId,
    metadata: { type: "rgpd_data_export" },
  });

  return { success: true, data: JSON.stringify(exportData, null, 2) };
}

/**
 * RGPD Article 17 — Right to erasure.
 * Submits a deletion request. The actual deletion is performed by admin
 * via the existing anonymisation flow (preserving legally-required documents).
 */
export async function requestAccountDeletion(
  password: string
): Promise<{ success: boolean; error?: string }> {
  const userId = await requireAuth();

  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) return { success: false, error: rl.error };

  if (!password || password.length < 1) {
    return { success: false, error: "Mot de passe requis pour confirmer" };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true, email: true },
  });

  if (!user?.passwordHash) {
    return { success: false, error: "Compte introuvable" };
  }

  // Verify password
  const { verify } = await import("@node-rs/argon2");
  const valid = await verify(user.passwordHash, password);
  if (!valid) {
    return { success: false, error: "Mot de passe incorrect" };
  }

  // Log the deletion request (admin will process it within 30 days per RGPD)
  await audit({
    action: "ADMIN_ACTION",
    userId,
    target: userId,
    metadata: {
      type: "rgpd_deletion_request",
      email: user.email,
      requestedAt: new Date().toISOString(),
    },
  });

  // Create a notification for admins
  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  await db.notification.createMany({
    data: admins.map((a) => ({
      userId: a.id,
      type: "SYSTEM" as const,
      title: "Demande de suppression RGPD",
      message: `L'utilisateur ${user.email} a demandé la suppression de son compte. Délai légal : 30 jours.`,
      href: "/admin/utilisateurs",
    })),
  });

  return { success: true };
}
