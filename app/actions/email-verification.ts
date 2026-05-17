"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { audit } from "@/lib/audit";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";

/** Send a verification email to the current user */
export async function sendVerificationEmail() {
  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) return { ok: false, error: rl.error };

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Non authentifié" };

  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true, emailVerified: true } });
  if (!user) return { ok: false, error: "Utilisateur introuvable" };
  if (user.emailVerified) return { ok: false, error: "Email déjà vérifié" };

  // Clean up old tokens for this email
  await db.emailVerification.deleteMany({ where: { email: user.email } });

  const token = randomBytes(32).toString("hex");
  await db.emailVerification.create({
    data: {
      email: user.email,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await sendMail({
    to: user.email,
    subject: "Deepframe — Vérifiez votre adresse email",
    html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Vérification de votre email</h2>
        <p>Bonjour,</p>
        <p>Cliquez sur le bouton ci-dessous pour vérifier votre adresse email (valable 24h) :</p>
        <p style="margin-top:20px">
          <a href="${link}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Vérifier mon email</a>
        </p>
        <p style="font-size:12px;color:#777;margin-top:30px">Si vous n'avez pas demandé cette vérification, ignorez cet email.</p>
        <p style="font-size:12px;color:#777">Deepframe · contact@deepframe.cc</p>
      </div>`,
  });

  return { ok: true, message: "Email de vérification envoyé" };
}

/** Verify email with token. Used internally by confirmEmailVerification. */
export async function verifyEmailToken(token: string) {
  if (!token) return { ok: false, error: "Token manquant" };

  const record = await db.emailVerification.findUnique({ where: { token } });
  if (!record) return { ok: false, error: "Lien invalide ou expiré" };
  if (record.expiresAt < new Date()) {
    await db.emailVerification.delete({ where: { token } });
    return { ok: false, error: "Lien expiré. Demandez un nouvel envoi depuis votre profil." };
  }

  const user = await db.user.findUnique({ where: { email: record.email } });
  if (!user) return { ok: false, error: "Utilisateur introuvable" };

  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  await db.emailVerification.delete({ where: { token } });
  await audit({ action: "EMAIL_VERIFIED", userId: user.id, target: record.email });

  return { ok: true, message: "Email vérifié avec succès" };
}

/**
 * Confirm an email verification from a POST/Server Action (user click).
 * NEVER called on GET — this prevents email scanners (SafeLinks, Mimecast),
 * browser prefetchers, or proxies from auto-consuming the token before the
 * user actually clicks the confirmation button.
 * Rate-limited per IP to prevent token brute-force.
 */
export async function confirmEmailVerification(token: string): Promise<void> {
  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) {
    redirect(`/verify-email?status=error&reason=${encodeURIComponent(rl.error ?? "Trop de tentatives")}`);
  }

  const result = await verifyEmailToken(token);
  if (result.ok) {
    redirect("/verify-email?status=ok");
  } else {
    redirect(`/verify-email?status=error&reason=${encodeURIComponent(result.error ?? "Erreur inconnue")}`);
  }
}
