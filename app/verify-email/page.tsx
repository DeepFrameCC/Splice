import { db } from "@/lib/db";
import { hashToken } from "@/lib/crypto/token";
import { confirmEmailVerification } from "@/app/actions/email-verification";
import Link from "next/link";
import { CheckCircle, XCircle, MailCheck } from "lucide-react";
import VerifyEmailForm from "./VerifyEmailForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vérification de l'email",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  const status = typeof sp.status === "string" ? sp.status : "";

  // Status pages after the POST confirmation step
  if (status === "ok") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-df-surface p-8 text-center shadow-lg ring-1 ring-white/[0.08]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">Email vérifié !</h1>
          <p className="mt-2 text-sm text-white/50">
            Votre adresse email a bien été vérifiée. Votre compte est maintenant pleinement actif.
          </p>
          <Link
            href="/profil"
            className="mt-6 inline-flex rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90"
          >
            Accéder à mon profil
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    const reason =
      typeof sp.reason === "string" ? decodeURIComponent(sp.reason) : "Lien invalide ou expiré.";
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-df-surface p-8 text-center shadow-lg ring-1 ring-white/[0.08]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">Vérification échouée</h1>
          <p className="mt-2 text-sm text-white/50">{reason}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/profil/parametres"
              className="inline-flex rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90"
            >
              Renvoyer un email
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/5"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No token provided
  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-df-surface p-8 text-center shadow-lg ring-1 ring-white/[0.08]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">Lien invalide</h1>
          <p className="mt-2 text-sm text-white/50">Aucun token fourni.</p>
        </div>
      </div>
    );
  }

  // Lightweight existence check (does NOT consume the token).
  // Wrapped in try/catch so a DB outage falls back to "show the button anyway".
  let tokenExists = true;
  let tokenExpired = false;
  try {
    const record = await db.emailVerification.findUnique({
      where: { token: await hashToken(token) },
      select: { expiresAt: true },
    });
    if (!record) tokenExists = false;
    else if (record.expiresAt < new Date()) tokenExpired = true;
  } catch {
    // DB unreachable — let the user click and surface the error from the server action.
  }

  if (!tokenExists) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-df-surface p-8 text-center shadow-lg ring-1 ring-white/[0.08]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">Lien invalide</h1>
          <p className="mt-2 text-sm text-white/50">
            Ce lien de vérification est introuvable ou a déjà été utilisé.
          </p>
          <Link
            href="/profil/parametres"
            className="mt-6 inline-flex rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90"
          >
            Renvoyer un email
          </Link>
        </div>
      </div>
    );
  }

  if (tokenExpired) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-df-surface p-8 text-center shadow-lg ring-1 ring-white/[0.08]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-white">Lien expiré</h1>
          <p className="mt-2 text-sm text-white/50">
            Ce lien de vérification a expiré. Demandez un nouvel envoi depuis votre profil.
          </p>
          <Link
            href="/profil/parametres"
            className="mt-6 inline-flex rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90"
          >
            Renvoyer un email
          </Link>
        </div>
      </div>
    );
  }

  // Token looks valid: show an explicit confirmation button (POST-only).
  // Prevents email scanners / prefetchers from consuming the token.
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-df-surface p-8 text-center shadow-lg ring-1 ring-white/[0.08]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-df-blue/10">
          <MailCheck className="h-8 w-8 text-df-blue" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-white">Confirmer votre email</h1>
        <p className="mt-2 text-sm text-white/50">
          Cliquez sur le bouton ci-dessous pour confirmer la vérification de votre adresse email.
        </p>
        <VerifyEmailForm token={token} action={confirmEmailVerification} />
      </div>
    </div>
  );
}
