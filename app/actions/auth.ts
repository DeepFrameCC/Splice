"use server";
import { z } from "zod";
import { hash, verify } from "@node-rs/argon2";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { randomBytes } from "crypto";
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
  recaptcha: z.string().min(1, "Captcha requis")
}).refine((d) => d.nomEntreprise || (d.prenom && d.nom), { message: "Nom/prénom OU nom d'entreprise requis", path: ["nom"] });

async function verifyRecaptcha(token: string) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    // Fail-closed in production so a missing secret cannot silently disable
    // bot protection. Dev / preview environments still bypass for ergonomics.
    if (process.env.NODE_ENV === "production") {
      console.error("[auth] RECAPTCHA_SECRET_KEY missing in production — registration refused");
      return false;
    }
    return true;
  }
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = await res.json();
  return data.success === true && (data.score ?? 1) >= 0.5;
}

export async function registerAction(_prev: unknown, formData: FormData) {
  const rl = await checkRateLimit(authLimiter);
  if (!rl.success) return { ok: false, error: rl.error };

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  if (!(await verifyRecaptcha(d.recaptcha))) return { ok: false, error: "Captcha invalide" };

  const pseudo = formatPseudo(d.pseudo);
  if (!pseudoRegex.test(pseudo)) return { ok: false, error: "Pseudo : minuscules, chiffres, points uniquement" };

  const exists = await db.user.findFirst({ where: { OR: [{ email: d.email }, { pseudo }] } });
  if (exists) return { ok: false, error: "Email ou pseudo déjà utilisé" };

  const passwordHash = await hash(d.password);
  await db.user.create({
    data: {
      email: d.email, passwordHash, pseudo,
      profile: {
        create: {
          prenom: d.prenom ?? null, nom: d.nom ?? null, nomEntreprise: d.nomEntreprise ?? null,
          adresse: d.adresse, codePostal: d.codePostal ?? null, ville: d.ville ?? null,
          tel: d.tel, age: d.age
        }
      }
    }
  });

  // Send verification email (fire-and-forget)
  const verifyToken = randomBytes(32).toString("hex");
  await db.emailVerification.create({
    data: { email: d.email, token: verifyToken, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;
  sendMail({
    to: d.email,
    subject: "Splice — Vérifiez votre adresse email",
    html: `
      <div style="font-family:system-ui;color:#0E0E22;max-width:600px">
        <h2 style="color:#F36B1F">Bienvenue sur Splice !</h2>
        <p>Cliquez ci-dessous pour vérifier votre email (valable 24h) :</p>
        <p style="margin-top:20px">
          <a href="${verifyLink}" style="background:#F36B1F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Vérifier mon email</a>
        </p>
        <p style="font-size:12px;color:#777;margin-top:30px">Splice · contact@splice.cc</p>
      </div>`,
  }).catch(() => {}); // fire-and-forget

  await audit({ action: "LOGIN", target: d.email, metadata: { type: "register" } });
  await signIn("credentials", { email: d.email, password: d.password, redirectTo: "/profil" });
  return { ok: true };
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
    // Constant-time: always run Argon2 even when user not found (prevents timing oracle)
    const dummyHash = "$argon2id$v=19$m=65536,t=3,p=4$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    let pwOk = false;
    try { pwOk = await verify(user?.passwordHash ?? dummyHash, password); } catch { /* dummy hash rejection */ }
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
  await signOut({ redirectTo: "/" });
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

  const passwordHash = await hash(password);
  const user = await db.$transaction(async (tx) => {
    const updated = await tx.user.update({ where: { email: t.email }, data: { passwordHash } });
    await tx.passwordReset.delete({ where: { token } });
    return updated;
  });
  await audit({ action: "PASSWORD_RESET", userId: user.id, target: t.email });
  redirect("/login?reset=1");
}
