"use server";

import { auth, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { DELETED_EMAIL_DOMAIN } from "@/lib/account";

async function requireAuth() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("NON_AUTHENTIFIE");
  return userId;
}

/** Purge every Auth.js / NextAuth cookie. Never throws. */
async function purgeAuthCookies() {
  try {
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";
    for (const cookie of cookieStore.getAll()) {
      if (cookie.name.includes("authjs") || cookie.name.includes("next-auth")) {
        cookieStore.set(cookie.name, "", {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
          secure: isProd,
          httpOnly: true,
          sameSite: "lax",
        });
      }
    }
  } catch (err) {
    console.error("[rgpd] cookie purge failed", err);
  }
}

/**
 * Anonymise a user that owns legally-retained accounting documents (factures
 * are kept 10 years — Art. L123-22 Code de commerce + obligations fiscales).
 * We scrub every PII field and make login impossible, while the User row and
 * its factures/contrats/devis survive for the legal retention period.
 *
 * Sequential writes on purpose: on Cloudflare Workers + Neon HTTP the connection
 * is recycled between statements, so interactive `$transaction` would throw
 * "Transaction not found".
 */
async function anonymiseUser(userId: string) {
  const anonId = userId.slice(-12);
  // Remove the personal-data satellites first.
  await db.profile.deleteMany({ where: { userId } });
  await db.like.deleteMany({ where: { userId } });
  await db.notification.deleteMany({ where: { userId } });
  await db.review.deleteMany({ where: { userId } });
  await db.session.deleteMany({ where: { userId } });
  await db.consentLog.updateMany({ where: { userId }, data: { userId: null } });
  // Scrub the account itself. The random pbkdf2-shaped hash can never match a
  // real password, and the sentinel email lets the auth guard evict any token
  // still cached on another device.
  await db.user.update({
    where: { id: userId },
    data: {
      email: `deleted-${anonId}@${DELETED_EMAIL_DOMAIN}`,
      pseudo: `deleted_${anonId}`,
      passwordHash: `pbkdf2$100000$${randomBytes(16).toString("hex")}$${randomBytes(32).toString("hex")}`,
      emailVerified: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      stripeCustomerId: null,
    },
  });
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
  try {
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
        service: "Splice Studio",
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
  } catch (err: any) {
    console.error("[rgpd] Data export error:", err);
    return {
      success: false,
      error: "Erreur lors de l'export des données. Veuillez réessayer ou nous contacter.",
    };
  }
}

/**
 * RGPD Article 17 — Right to erasure. Performs the deletion immediately:
 *  1. Verifies the password.
 *  2. Hard-deletes the account when it carries no legally-retained accounting
 *     document (FK cascade/set-null cleans the related rows at DB level), or
 *     anonymises it when factures/contrats/abonnements exist (10-year legal
 *     retention).
 *  3. Invalidates the JWT session and purges the auth cookies.
 *
 * The caller (RGPDSection) hard-navigates away on success, so the user is
 * logged out and bounced off the protected area in a single clean transition.
 */
export async function deleteMyAccount(
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await requireAuth();

    const rl = await checkRateLimit(authLimiter);
    if (!rl.success) return { success: false, error: rl.error };

    if (!password || password.length < 1) {
      return { success: false, error: "Mot de passe requis pour confirmer" };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        passwordHash: true,
        email: true,
        _count: { select: { factures: true, contrats: true, abonnements: true } },
      },
    });

    if (!user?.passwordHash) {
      return { success: false, error: "Compte introuvable" };
    }

    // Verify password before any destructive action.
    const { verifyPassword } = await import("@/lib/crypto/password");
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Mot de passe incorrect" };
    }

    const hasLegalDocs =
      user._count.factures > 0 ||
      user._count.contrats > 0 ||
      user._count.abonnements > 0;

    if (hasLegalDocs) {
      await anonymiseUser(userId);
      await audit({
        action: "ADMIN_ACTION",
        target: userId,
        metadata: { type: "rgpd_account_anonymised", reason: "legal_retention" },
      });
    } else {
      // No accounting documents → full row deletion. Postgres FK rules cascade
      // (profile, sessions, likes, notifications, reviews) and set-null (devis,
      // auditLogs, consents, media.monteur, blogPosts) automatically.
      await db.user.delete({ where: { id: userId } });
      await audit({
        action: "ADMIN_ACTION",
        target: userId,
        metadata: { type: "rgpd_account_deleted", email: user.email },
      });
    }

    // Log the user out immediately: invalidate the session + drop the cookies.
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.error("[rgpd] signOut after deletion failed, manual purge", err);
    }
    await purgeAuthCookies();

    return { success: true };
  } catch (err: any) {
    console.error("[rgpd] Account deletion error:", err);
    return {
      success: false,
      error: "Erreur lors de la suppression. Veuillez réessayer ou nous contacter.",
    };
  }
}
