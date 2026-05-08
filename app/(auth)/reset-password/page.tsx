"use client";
import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetForm() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPasswordAction, null as { ok: boolean; error?: string } | null);

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-4xl italic text-df-blue">Nouveau mot de passe</h1>
      <form action={action} className="mt-8 space-y-4">
        <input type="hidden" name="token" value={token} />
        <input name="password" type="password" required minLength={8} placeholder="Nouveau mot de passe (min 8)"
          className="w-full rounded-xl border-2 border-df-blue/20 px-4 py-3 outline-none focus:border-df-blue" />
        {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
          {pending ? "…" : "Mettre à jour"}
        </button>
      </form>
    </section>
  );
}

export default function Page() {
  return <Suspense><ResetForm /></Suspense>;
}
