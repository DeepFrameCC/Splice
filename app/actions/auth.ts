"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

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
  if (!process.env.RECAPTCHA_SECRET_KEY) return true;
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  const data = await res.json();
  return data.success === true && (data.score ?? 1) >= 0.5;
}

export async function registerAction(_prev: any, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  if (!(await verifyRecaptcha(d.recaptcha))) return { ok: false, error: "Captcha invalide" };

  const pseudo = formatPseudo(d.pseudo);
  if (!pseudoRegex.test(pseudo)) return { ok: false, error: "Pseudo : minuscules, chiffres, points uniquement" };

  const exists = await db.user.findFirst({ where: { OR: [{ email: d.email }, { pseudo }] } });
  if (exists) return { ok: false, error: "Email ou pseudo déjà utilisé" };

  const passwordHash = await bcrypt.hash(d.password, 10);
  await db.user.create({
    data: {
      email: d.email, passwordHash, pseudo,
      prenom: d.prenom ?? null, nom: d.nom ?? null, nomEntreprise: d.nomEntreprise ?? null,
      adresse: d.adresse, codePostal: d.codePostal ?? null, ville: d.ville ?? null,
      tel: d.tel, age: d.age
    }
  });

  await signIn("credentials", { email: d.email, password: d.password, redirectTo: "/profil" });
  return { ok: true };
}

export async function loginAction(_prev: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    await signIn("credentials", { email, password, redirectTo: "/profil" });
    return { ok: true };
  } catch (e: any) {
    if (e?.digest?.includes?.("NEXT_REDIRECT")) throw e;
    return { ok: false, error: "Identifiants invalides" };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function forgotPasswordAction(_prev: any, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { ok: false, error: "Email requis" };
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    await db.passwordResetToken.create({
      data: { email, token, expires: new Date(Date.now() + 1000 * 60 * 60) }
    });
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendMail({
      to: email,
      subject: "Réinitialisation de votre mot de passe Deepframe",
      html: `<p>Cliquez sur ce lien (valable 1h) :</p><p><a href="${link}" style="background:#1901AD;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none">Réinitialiser</a></p>`
    });
  }
  return { ok: true, message: "Si un compte existe, un email a été envoyé." };
}

export async function resetPasswordAction(_prev: any, formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  if (!token || !password || password.length < 8) return { ok: false, error: "Données invalides" };

  const t = await db.passwordResetToken.findUnique({ where: { token } });
  if (!t || t.expires < new Date()) return { ok: false, error: "Lien expiré ou invalide" };

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.update({ where: { email: t.email }, data: { passwordHash } });
  await db.passwordResetToken.delete({ where: { token } });
  redirect("/login?reset=1");
}
