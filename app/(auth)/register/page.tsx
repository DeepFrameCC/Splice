"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null as { ok: boolean; error?: string } | null);
  const [recaptchaToken, setRecaptchaToken] = useState("dev-skip");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!SITE_KEY) return;
    e.preventDefault();
    // @ts-ignore
    const token: string = await window.grecaptcha.execute(SITE_KEY, { action: "register" });
    setRecaptchaToken(token);
    const fd = new FormData(e.currentTarget);
    fd.set("recaptcha", token);
    e.currentTarget.requestSubmit();
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      {SITE_KEY && <Script src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`} />}
      <h1 className="text-center font-display text-4xl italic text-df-blue">Créer mon compte</h1>
      <p className="mt-2 text-center text-df-blue/70">Renseignez vos infos pour profiter des fonctionnalités client.</p>

      <form action={action} onSubmit={SITE_KEY ? onSubmit : undefined} className="mt-8 grid gap-4 md:grid-cols-2">
        <input name="prenom" placeholder="Prénom" className="input" />
        <input name="nom" placeholder="Nom" className="input" />
        <input name="nomEntreprise" placeholder="Nom de l'entreprise (optionnel)" className="input md:col-span-2" />
        <input name="pseudo" required placeholder="Pseudo (prénom.nom ou marque)" className="input md:col-span-2" />
        <input name="email" type="email" required placeholder="Email pro ou perso" className="input md:col-span-2" />
        <input name="password" type="password" required minLength={8} placeholder="Mot de passe (min 8)" className="input md:col-span-2" />
        <input name="adresse" required placeholder="Adresse postale" className="input md:col-span-2" />
        <input name="codePostal" placeholder="Code postal" className="input" />
        <input name="ville" placeholder="Ville" className="input" />
        <input name="tel" required placeholder="Téléphone" className="input" />
        <input name="age" type="number" min={16} required placeholder="Âge" className="input" />
        <input type="hidden" name="recaptcha" value={recaptchaToken} />

        {state?.error && <p className="md:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

        <button type="submit" disabled={pending} className="btn-primary md:col-span-2 disabled:opacity-50">
          {pending ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-df-blue/70">
        Déjà un compte ? <Link href="/login" className="font-bold text-df-gold">Se connecter</Link>
      </p>

      <style jsx>{`.input { width: 100%; border: 2px solid rgba(25,1,173,.2); border-radius: 12px; padding: 12px 16px; outline: none; }
        .input:focus { border-color: #1901AD; }`}</style>
    </section>
  );
}
