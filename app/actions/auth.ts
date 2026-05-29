"use server";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/crypto/password";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authLimiter, checkRateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

const pseudoRegex = /^[a-z0-9._]+$/;
const formatPseudo = (raw: string) =>
  raw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9._]/g, ".").replace(/\.+/g, ".").replace(/^\.|\.$/g, "");

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Min 8 caractères"),
  prenom: z.string().optional(),
  nom: z.string().optional(),
  nomEntreprise: z.string().optional(),
  pseudo: z.string().min(3),
  adresse: z.string().min(3, "Adresse requise"),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  tel: z.string().min(6, "Téléphone requis"),
  age: z.coerce.number().int().min(16, "Âge minimum 16 ans").max(120),
  "cf-turnstile-response": z.string().min(1, "Captcha requis"),
}).refine((d) => d.nomEntreprise || (d.prenom && d.nom), { message: "Nom/prénom OU nom d'entreprise requis", path: ["nom"] });
async function verifyTurnstile(token: string): Promise<{ success: boolean; errorCodes?: string[] }> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.error("[auth] TURNSTILE_SECRET_KEY missing in production — registration refused");
      return { success: false, errorCodes: ["missing-secret-key-env"] };
    }
    return { success: true };
  }
  const params = new URLSearchParams();
  params.append("secret", process.env.TURNSTILE_SECRET_KEY);
  params.append("response", token);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    return { success: data.success === true, errorCodes: data["error-codes"] };
  } catch (err: any) {
    return { success: false, errorCodes: ["fetch-failed", err?.message ?? String(err)] };
  }
}

export async function registerAction(_prev: unknown, formData: FormData) {
  try {
    const rl = await checkRateLimit(authLimiter);
    if (!rl.success) return { ok: false, error: rl.error };

    const parsed = registerSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
    const d = parsed.data;

    const turnstileRes = await verifyTurnstile(d["cf-turnstile-response"]);
    if (!turnstileRes.success) {
      const errDetail = turnstileRes.errorCodes?.join(", ") ?? "code inconnu";
      return { ok: false, error: `Captcha invalide (${errDetail})` };
    }

    const pseudo = formatPseudo(d.pseudo);
    if (!pseudoRegex.test(pseudo)) return { ok: false, error: "Pseudo : minuscules, chiffres, points uniquement" };

    const exists = await db.user.findFirst({ where: { OR: [{ email: d.email }, { pseudo }] } });
    if (exists) return { ok: false, error: "Email ou pseudo déjà utilisé" };

    const passwordHash = await hashPassword(d.password);

    // 1. Écriture séquentielle 1 : Créer l'utilisateur (évite la transaction automatique de Prisma)
    const newUser = await db.user.create({
      data: {
        email: d.email,
        passwordHash,
        pseudo,
      },
    });

    // 2. Écriture séquentielle 2 : Créer le profil associé
    await db.profile.create({
      data: {
        userId: newUser.id,
        prenom: d.prenom ?? null,
        nom: d.nom ?? null,
        nomEntreprise: d.nomEntreprise ?? null,
        adresse: d.adresse,
        codePostal: d.codePostal ?? null,
        ville: d.ville ?? null,
        tel: d.tel,
        age: d.age,
      },
    });

    // Send verification email (fire-and-forget)
    const verifyToken = randomBytes(32).toString("hex");
    await db.emailVerification.create({
      data: { email: d.email, token: verifyToken, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
    });
    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;
    
    try {
      await sendMail({
        to: d.email,
        subject: "Splice — Vérifiez votre adresse email",
        html: `
          <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
            <h2 style="color:#F36B1F">Bienvenue sur Splice !</h2>
            <p>Cliquez ci-dessous pour vérifier votre email (valable 24h) :</p>
            <p style="margin-top:20px">
              <a href="${verifyLink}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Vérifier mon email</a>
            </p>
            <p style="font-size:12px;color:#777;margin-top:30px">Splice · contact.splicestudio@gmail.com</p>
          </div>`,
      });
    } catch (emailErr) {
      console.error("[auth] Verification email failed:", emailErr);
    }

    await audit({ action: "LOGIN", target: d.email, metadata: { type: "register" } });

    try {
      await signIn("credentials", { email: d.email, password: d.password, redirectTo: "/profil" });
    } catch (signInErr: any) {
      // If it's a redirect, we must rethrow it so Next.js handles the navigation
      if (signInErr && typeof signInErr === "object" && "digest" in signInErr) {
        const digest = (signInErr as { digest?: string }).digest;
        if (digest?.includes?.("NEXT_REDIRECT")) throw signInErr;
      }
      console.error("[auth] Auto-signin failed after registration:", signInErr);
      return { ok: false, error: "Compte créé avec succès ! Connectez-vous sur la page de connexion." };
    }

    return { ok: true };
  } catch (err: any) {
    // If it's a redirect, let Next.js handle it
    if (err && typeof err === "object" && "digest" in err) {
      const digest = (err as { digest?: string }).digest;
      if (digest?.includes?.("NEXT_REDIRECT")) throw err;
    }
    console.error("[auth] Registration error:", err);
    return { ok: false, error: `Erreur d'inscription : ${err?.message ?? String(err)}` };
  }
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) return { ok: false, error: rl.error };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const totpCode = formData.get("totpCode") as string | null;

  if (!email || !password) return { ok: false, error: "Email et mot de passe requis" };

  // Phase 1: If no TOTP code yet, check if 2FA is needed
  if (!totpCode) {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, twoFactorEnabled: true },
    });
    // Constant-time: always run PBKDF2 even when user not found (prevents timing oracle)
    const dummyHash = "pbkdf2$100000$00000000000000000000000000000000$0000000000000000000000000000000000000000000000000000000000000000";
    let pwOk = false;
    try { pwOk = await verifyPassword(password, user?.passwordHash ?? dummyHash); } catch { /* dummy hash rejection */ }
    if (!user || !pwOk) {
      // Fall through to signIn() which will reject with generic error
    } else if (user.twoFactorEnabled) {
      return { ok: false, requires2FA: true };
    }
  }

  // Phase 2: Sign in with all credentials (including TOTP if provided)
  try {
    await signIn("credentials", {
      email,
      password,
      totpCode: totpCode ?? undefined,
      redirectTo: "/profil",
    });
    await audit({ action: "LOGIN", target: email });
    return { ok: true };
  } catch (e: unknown) {
    if (e && typeof e === "object" && "digest" in e) {
      const digest = (e as { digest?: string }).digest;
      if (digest?.includes?.("NEXT_REDIRECT")) throw e;
    }
    await audit({ action: "LOGIN_FAILED", target: email });
    const errorMsg = totpCode ? "Code 2FA invalide" : "Identifiants invalides";
    return { ok: false, error: errorMsg };
  }
}

export async function logoutAction() {
  await audit({ action: "LOGOUT" });

  // Auth.js signOut() doesn't reliably clear __Secure- prefixed cookies
  // on Cloudflare Workers. Manually delete all known session cookies.
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (
      cookie.name.includes("authjs") ||
      cookie.name.includes("next-auth")
    ) {
      cookieStore.delete(cookie.name);
    }
  }

  redirect("/");
}

export async function forgotPasswordAction(_prev: unknown, formData: FormData) {
  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) return { ok: false, error: rl.error };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { ok: false, error: "Email requis" };
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    await db.passwordReset.create({
      data: { email, token, expiresAt: new Date(Date.now() + 1000 * 60 * 60) }
    });
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendMail({
      to: email,
      subject: "Réinitialisation de votre mot de passe Splice",
      html: `<p>Cliquez sur ce lien (valable 1h) :</p><p><a href="${link}" style="background:#F36B1F;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none">Réinitialiser</a></p>`
    });
  }
  return { ok: true, message: "Si un compte existe, un email a été envoyé." };
}

export async function resetPasswordAction(_prev: unknown, formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  if (!token || !password || password.length < 8) return { ok: false, error: "Données invalides" };

  const t = await db.passwordReset.findUnique({ where: { token } });
  if (!t || t.expiresAt < new Date()) return { ok: false, error: "Lien expiré ou invalide" };

  const passwordHash = await hashPassword(password);
  const user = await db.$transaction(async (tx) => {
    const updated = await tx.user.update({ where: { email: t.email }, data: { passwordHash } });
    await tx.passwordReset.delete({ where: { token } });
    return updated;
  });
  await audit({ action: "PASSWORD_RESET", userId: user.id, target: t.email });
  redirect("/login?reset=1");
}
