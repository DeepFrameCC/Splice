"use client";

import { useState, useTransition } from "react";
import { submitContact } from "@/app/actions/contact";

interface Props {
  members: { id: string; name: string }[];
}

const TYPES = ["Clip", "Photo", "Mariage", "Entreprise", "Documentaire", "Autre"];
const BUDGETS = ["< 1 000 €", "1 000 € – 3 000 €", "3 000 € – 8 000 €", "> 8 000 €", "À définir"];

export default function ContactForm({ members }: Props) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | { ok: true } | { ok: false; error: string }>(null);

  return (
    <form
      className="grid gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const memberRaw = (fd.get("member") as string) || "all";
        const payload = {
          nom: (fd.get("nom") as string) ?? "",
          email: (fd.get("email") as string) ?? "",
          type: (fd.get("type") as string) ?? "",
          budget: (fd.get("budget") as string) ?? "",
          brief: (fd.get("brief") as string) ?? "",
          member: memberRaw as "all" | "louisia" | "ty",
        };
        startTransition(async () => {
          const res = await submitContact(payload);
          if (res.success) setStatus({ ok: true });
          else setStatus({ ok: false, error: res.error });
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-df-gold">
          Votre nom
          <input
            name="nom"
            required
            minLength={2}
            className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-base font-normal text-white placeholder:text-white/30 focus:border-df-gold/50 focus:outline-none focus:ring-1 focus:ring-df-gold/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-df-gold">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-base font-normal text-white placeholder:text-white/30 focus:border-df-gold/50 focus:outline-none focus:ring-1 focus:ring-df-gold/20"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-df-gold">
          Type de projet
          <select
            name="type"
            required
            className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-base font-normal text-white placeholder:text-white/30 focus:border-df-gold/50 focus:outline-none focus:ring-1 focus:ring-df-gold/20"
          >
            <option value="" className="bg-[#0E0E22] text-white">Choisir…</option>
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#0E0E22] text-white">
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-df-gold">
          Budget envisagé
          <select
            name="budget"
            required
            className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-base font-normal text-white placeholder:text-white/30 focus:border-df-gold/50 focus:outline-none focus:ring-1 focus:ring-df-gold/20"
          >
            <option value="" className="bg-[#0E0E22] text-white">Choisir…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-[#0E0E22] text-white">
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-semibold text-df-gold">
        Votre message
        <textarea
          name="brief"
          required
          minLength={10}
          rows={6}
          className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-base font-normal text-white placeholder:text-white/30 focus:border-df-gold/50 focus:outline-none focus:ring-1 focus:ring-df-gold/20"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90 disabled:opacity-60"
      >
        {pending ? "Envoi en cours…" : "Envoyer le message"}
      </button>

      {status && status.ok && (
        <p className="text-sm font-semibold text-emerald-400">
          Message envoyé ! Nous revenons vers vous sous 48h.
        </p>
      )}
      {status && !status.ok && (
        <p className="text-sm font-semibold text-red-600">{status.error}</p>
      )}
    </form>
  );
}
