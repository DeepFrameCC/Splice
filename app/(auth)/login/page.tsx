"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(
    loginAction,
    null as { ok: boolean; error?: string } | null
  );

  return (
    <div className="flex min-h-screen">
      {/* ── Panneau gauche : branding ─────────────────────────────── */}
      <div
        className="hidden w-1/2 flex-col justify-between p-10 lg:flex"
        style={{ background: "linear-gradient(160deg, #0A0A23 0%, #1901AD 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt=""
            width={26}
            height={34}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="text-sm font-bold tracking-[0.18em] text-white">
            DEEPFRAME
          </span>
        </Link>

        <div className="max-w-md">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#FFBD59" }}
          >
            Espace client
          </p>
          <h1
            className="text-4xl font-black leading-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Suivez vos devis,
            <br />
            <em className="italic" style={{ color: "#FFBD59" }}>
              du brief au signé
            </em>
            .
          </h1>
          <p className="mt-5 leading-relaxed text-white/60">
            Connectez-vous pour accéder à vos devis, factures, contrats et
            suivre l&apos;avancement de vos projets.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/50">
            {["Suivi devis en temps réel", "Export PDF en un clic", "Factures & contrats centralisés"].map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
                  style={{ background: "rgba(255,189,89,.15)", color: "#FFBD59" }}
                >
                  ✓
                </span>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/30">© 2026 DeepFrame · Tous droits réservés</p>
      </div>

      {/* ── Panneau droit : formulaire ────────────────────────────── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image src="/logo.svg" alt="Deepframe" width={60} height={80} />
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-1 rounded-xl bg-df-cream p-1">
            <div className="flex-1 rounded-lg bg-df-blue px-4 py-2.5 text-center text-sm font-bold text-white">
              Connexion
            </div>
            <Link
              href="/register"
              className="flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-bold text-df-blue/60 transition hover:text-df-blue"
            >
              Créer un compte
            </Link>
          </div>

          <h2
            className="text-2xl font-black text-df-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bon retour parmi nous.
          </h2>
          <p className="mt-1 text-sm text-df-ink/50">Identifiants DeepFrame.</p>

          <form action={action} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-df-blue/60">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="prenom@email.com"
                autoComplete="email"
                className="w-full rounded-xl border-2 border-df-blue/10 bg-white px-4 py-3 text-df-ink outline-none transition focus:border-df-blue"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-df-blue/60">
                Mot de passe
              </span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border-2 border-df-blue/10 bg-white px-4 py-3 text-df-ink outline-none transition focus:border-df-blue"
              />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-df-blue/60">
                <input type="checkbox" defaultChecked className="rounded border-df-blue/20" />
                Rester connecté
              </label>
              <Link href="/forgot-password" className="text-df-blue underline-offset-4 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {state?.error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl py-3.5 text-center font-bold text-df-blue transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
              style={{ background: "#FFBD59" }}
            >
              {pending ? "Connexion…" : "Se connecter →"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-df-ink/40">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-bold text-df-blue hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
