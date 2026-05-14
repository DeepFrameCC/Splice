"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [state, action, pending] = useActionState(
    loginAction,
    null as { ok: boolean; error?: string; requires2FA?: boolean } | null
  );
  const [show2FA, setShow2FA] = useState(false);

  useEffect(() => {
    if (state?.requires2FA) setShow2FA(true);
  }, [state]);

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
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-df-gold">
            Espace client
          </p>
          <h1 className="font-display text-4xl font-black leading-tight text-white">
            Suivez vos devis,
            <br />
            <em className="italic text-df-gold">du brief au signé</em>.
          </h1>
          <p className="mt-5 leading-relaxed text-white/60">
            Connectez-vous pour accéder à vos devis, factures, contrats et
            suivre l&apos;avancement de vos projets.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/50">
            {["Suivi devis en temps réel", "Export PDF en un clic", "Factures & contrats centralisés"].map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-df-gold/15 text-xs text-df-gold">
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

          <h2 className="font-display text-2xl font-black text-df-ink">
            Bon retour parmi nous.
          </h2>
          <p className="mt-1 text-sm text-df-ink/50">Identifiants DeepFrame.</p>

          <form action={action} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="prenom@email.com"
                autoComplete="email"
                className="h-12"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-12"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-df-blue/60">
                <input type="checkbox" defaultChecked className="rounded border-df-blue/20" />
                Rester connecté
              </label>
              <Link href="/forgot-password" className="text-df-blue underline-offset-4 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {show2FA && (
              <div className="space-y-1.5 rounded-lg border border-df-blue/20 bg-df-cream/50 p-4">
                <Label htmlFor="totpCode" className="text-df-blue font-semibold">
                  Code d&apos;authentification 2FA
                </Label>
                <p className="text-xs text-df-ink/50">
                  Entrez le code à 6 chiffres de votre application d&apos;authentification.
                </p>
                <Input
                  id="totpCode"
                  name="totpCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  className="h-12 text-center text-2xl tracking-[0.5em] font-mono"
                  autoFocus
                />
              </div>
            )}

            {state?.error && (
              <Card className="border-red-200 bg-red-50 shadow-none ring-0">
                <CardContent className="p-3 text-sm font-semibold text-red-700">
                  {state.error}
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              disabled={pending}
              variant="gold"
              size="lg"
              className="w-full"
            >
              {pending ? "Connexion…" : "Se connecter →"}
            </Button>
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
