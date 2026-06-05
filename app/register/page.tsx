"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null as { ok: boolean; error?: string } | null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Initialize Turnstile widget explicitly
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileContainerRef.current) return;

    const turnstile = (window as any).turnstile;
    if (!turnstile) {
      return;
    }

    if (widgetIdRef.current) return;

    try {
      const widgetId = turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "dark",
        callback: (token: string) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          setTurnstileToken("");
        },
        "error-callback": () => {
          setTurnstileToken("");
        },
      });
      widgetIdRef.current = widgetId;
    } catch (err) {
      console.error("Error rendering Turnstile:", err);
    }

    return () => {
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [isScriptLoaded]);

  // Reset Turnstile widget on server validation error
  useEffect(() => {
    if (state?.error && widgetIdRef.current && (window as any).turnstile) {
      try {
        (window as any).turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      } catch (err) {
        console.error("Error resetting Turnstile:", err);
      }
    }
  }, [state]);

  return (
    <div className="flex min-h-screen">
      {/* ── Panneau gauche : branding ─────────────────────────────── */}
      <div
        className="hidden w-1/2 flex-col justify-between p-10 lg:flex"
        style={{ background: "linear-gradient(160deg, #0E0E22 0%, #F36B1F 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display text-lg font-bold tracking-wide text-white">SPLICE STUDIO</span>
        </Link>

        <div className="max-w-md">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-df-gold">
            Rejoignez-nous
          </p>
          <h1 className="font-display text-4xl font-black leading-tight text-white">
            Créez votre espace,
            <br />
            <em className="italic text-df-gold">lancez votre projet</em>.
          </h1>
          <p className="mt-5 leading-relaxed text-white/60">
            Un compte suffit pour demander un devis, suivre vos projets et
            accéder à tous vos documents.
          </p>
        </div>

        <p className="text-xs text-white/30">© 2026 Splice Studio · Tous droits réservés</p>
      </div>

      {/* ── Panneau droit : formulaire ────────────────────────────── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-lg">
          {TURNSTILE_SITE_KEY && (
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              async
              defer
              onLoad={() => setIsScriptLoaded(true)}
            />
          )}

          {/* Logo mobile */}
          <div className="mb-8 flex justify-center lg:hidden">
            <span className="font-display text-2xl font-bold tracking-wide text-white">SPLICE STUDIO</span>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-1 rounded-xl bg-df-surface p-1">
            <Link
              href="/login"
              className="flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-bold text-df-blue/60 transition hover:text-df-blue"
            >
              Connexion
            </Link>
            <div className="flex-1 rounded-lg bg-df-blue px-4 py-2.5 text-center text-sm font-bold text-white">
              Créer un compte
            </div>
          </div>

          <h2 className="font-display text-2xl font-black text-white">Créer mon compte</h2>
          <p className="mt-1 text-sm text-white/40">Renseignez vos infos pour profiter des fonctionnalités client.</p>

          <form action={action} className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" name="prenom" placeholder="Prénom" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" name="nom" placeholder="Nom" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="nomEntreprise">Entreprise (optionnel)</Label>
              <Input id="nomEntreprise" name="nomEntreprise" placeholder="Nom de l'entreprise" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="pseudo">Pseudo</Label>
              <Input id="pseudo" name="pseudo" required placeholder="prenom.nom ou marque" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="Email pro ou perso" autoComplete="email" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" required minLength={8} placeholder="Min 8 caractères" autoComplete="new-password" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="adresse">Adresse postale</Label>
              <Input id="adresse" name="adresse" required placeholder="Adresse postale" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="codePostal">Code postal</Label>
              <Input id="codePostal" name="codePostal" placeholder="Code postal" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ville">Ville</Label>
              <Input id="ville" name="ville" placeholder="Ville" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tel">Téléphone</Label>
              <Input id="tel" name="tel" required placeholder="Téléphone" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age">Âge</Label>
              <Input id="age" name="age" type="number" min={16} required placeholder="Âge" />
            </div>
            {TURNSTILE_SITE_KEY && (
              <div className="md:col-span-2 flex justify-center">
                <div ref={turnstileContainerRef} />
                <input
                  type="hidden"
                  name="cf-turnstile-response"
                  value={turnstileToken}
                />
              </div>
            )}

            {state?.error && (
              <Card className="border-red-500/20 bg-red-500/10 shadow-none ring-0 md:col-span-2">
                <CardContent className="p-3 text-sm font-semibold text-red-400">
                  {state.error}
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              disabled={pending || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
              variant="gold"
              size="lg"
              className="w-full md:col-span-2"
            >
              {pending ? "Création…" : "Créer mon compte →"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-bold text-df-blue hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
