"use client";
import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null as { ok: boolean; error?: string; message?: string } | null);

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-4xl italic text-df-blue">Mot de passe oublié</h1>
      <p className="mt-2 text-df-blue/70">Saisis ton email, on t&apos;envoie un lien pour réinitialiser.</p>

      <form action={action} className="mt-8 space-y-4">
        <input name="email" type="email" required placeholder="Email"
          className="w-full rounded-xl border-2 border-df-blue/20 px-4 py-3 outline-none focus:border-df-blue" />
        {state?.message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{state.message}</p>}
        {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
          {pending ? "Envoi…" : "Envoyer le lien"}
        </button>
      </form>

      <Link href="/login" className="mt-6 block text-center text-sm text-df-blue/70">Retour à la connexion</Link>
    </section>
  );
}
