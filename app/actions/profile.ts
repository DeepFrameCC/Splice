"use server";

import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/crypto/password";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";
import { generateTOTPSecret, verifyTOTP, generateQRCodeDataURL, encryptTotpSecret } from "@/lib/totp";

async function requireAuth() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("NON_AUTHENTIFIE");
  return userId;
}

// --- Profile Update ---

const profileSchema = z.object({
  prenom: z.string().max(100).optional(),
  nom: z.string().max(100).optional(),
  nomEntreprise: z.string().max(200).optional(),
  adresse: z.string().max(300).optional(),
  codePostal: z.string().max(10).optional(),
  ville: z.string().max(100).optional(),
  tel: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
});

export async function updateProfileAction(_prev: unknown, formData: FormData) {
  const userId = await requireAuth();

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const d = parsed.data;

  await db.profile.upsert({
    where: { userId },
    update: {
      prenom: d.prenom ?? null,
      nom: d.nom ?? null,
      nomEntreprise: d.nomEntreprise ?? null,
      adresse: d.adresse ?? null,
      codePostal: d.codePostal ?? null,
      ville: d.ville ?? null,
      tel: d.tel ?? null,
      bio: d.bio ?? null,
    },
    create: {
      userId,
      prenom: d.prenom ?? null,
      nom: d.nom ?? null,
      nomEntreprise: d.nomEntreprise ?? null,
      adresse: d.adresse ?? null,
      codePostal: d.codePostal ?? null,
      ville: d.ville ?? null,
      tel: d.tel ?? null,
      bio: d.bio ?? null,
    },
  });

  await audit({ action: "SETTINGS_UPDATED", userId, target: userId, metadata: { type: "profile" } });
  revalidatePath("/profil");
  return { ok: true, message: "Profil mis à jour" };
}

// --- Password Change ---

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Minimum 8 caractères"),
  confirmPassword: z.string().min(1, "Confirmation requise"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export async function changePasswordAction(_prev: unknown, formData: FormData) {
  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) return { ok: false, error: rl.error };

  const userId = await requireAuth();

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await db.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user?.passwordHash) return { ok: false, error: "Compte sans mot de passe" };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { ok: false, error: "Mot de passe actuel incorrect" };

  const newHash = await hashPassword(newPassword);
  await db.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

  await audit({ action: "PASSWORD_CHANGE", userId, target: userId });
  return { ok: true, message: "Mot de passe modifié" };
}

// --- 2FA Setup ---

export async function generate2FASetup() {
  const userId = await requireAuth();
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true, twoFactorEnabled: true } });
  if (!user) throw new Error("Utilisateur introuvable");
  if (user.twoFactorEnabled) return { error: "2FA déjà activé" };

  const { secret, uri } = generateTOTPSecret(user.email);
  const qrDataUrl = await generateQRCodeDataURL(uri);

  // Store secret encrypted at rest. The plaintext is returned to the client only
  // so the user can paste it as a fallback to the QR code during setup.
  await db.user.update({
    where: { id: userId },
    data: { twoFactorSecret: encryptTotpSecret(secret) },
  });

  return { secret, uri, qrDataUrl };
}

export async function enable2FAAction(_prev: unknown, formData: FormData) {
  const userId = await requireAuth();
  const code = (formData.get("code") as string)?.trim();

  if (!code || code.length !== 6) return { ok: false, error: "Code à 6 chiffres requis" };

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorSecret) return { ok: false, error: "Aucun secret 2FA trouvé. Recommencez la configuration." };
  if (user.twoFactorEnabled) return { ok: false, error: "2FA déjà activé" };

  const valid = verifyTOTP(code, user.twoFactorSecret);
  if (!valid) return { ok: false, error: "Code invalide. Vérifiez votre application." };

  await db.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

  await audit({ action: "SETTINGS_UPDATED", userId, target: userId, metadata: { type: "2fa_enabled" } });
  revalidatePath("/profil/parametres");
  return { ok: true, message: "Double authentification activée" };
}

export async function disable2FAAction(_prev: unknown, formData: FormData) {
  const userId = await requireAuth();
  const password = (formData.get("password") as string)?.trim();

  if (!password) return { ok: false, error: "Mot de passe requis" };

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorEnabled) return { ok: false, error: "2FA n'est pas activé" };
  if (!user.passwordHash) return { ok: false, error: "Compte sans mot de passe" };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Mot de passe incorrect" };

  await db.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  await audit({ action: "SETTINGS_UPDATED", userId, target: userId, metadata: { type: "2fa_disabled" } });
  revalidatePath("/profil/parametres");
  return { ok: true, message: "Double authentification désactivée" };
}
