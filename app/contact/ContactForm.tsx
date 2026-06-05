"use client";

import { useState, useTransition } from "react";
import { submitContact } from "@/app/actions/contact";
import { track } from "@/lib/analytics/track";

interface Props {
  members: { id: string; name: string }[];
}

const TYPES = ["Clip", "Photo", "Mariage", "Entreprise", "Documentaire", "Autre"];
const BUDGETS = ["< 1 000 €", "1 000 € – 3 000 €", "3 000 € – 8 000 €", "> 8 000 €", "À définir"];
const DELAIS = ["Flexible", "Sous 1 mois", "Sous 2 semaines", "Urgent"];

const inputClass =
  "rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-base font-normal text-white placeholder:text-white/30 focus:border-df-gold/50 focus:outline-none focus:ring-1 focus:ring-df-gold/20";
const labelClass = "flex flex-col gap-1 text-sm font-semibold text-df-gold";

export default function ContactForm({ members }: Props) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | { ok: true } | { ok: false; error: string }>(null);

  return (
    <form
      className="grid gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const memberRaw = (fd.get("member") as string) || "all";
        const payload = {
          nom: (fd.get("nom") as string) ?? "",
          email: (fd.get("email") as string) ?? "",
          tel: (fd.get("tel") as string) ?? "",
          type: (fd.get("type") as string) ?? "",
          budget: (fd.get("budget") as string) ?? "",
          delai: (fd.get("delai") as string) ?? "",
          brief: (fd.get("brief") as string) ?? "",
          member: memberRaw as "all" | "louisia" | "ty",
        };
        startTransition(async () => {
          const res = await submitContact(payload);
          if (res.success) {
            setStatus({ ok: true });
            form.reset();
            track("devis_envoye", { source: "contact" });
          } else {
            setStatus({ ok: false, error: res.error });
          }
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Votre nom
          <input name="nom" required minLength={2} autoComplete="name" className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Téléphone
          <input
            name="tel"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9 +().-]{6,}"
            placeholder="06 12 34 56 78"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Type de projet
          <select name="type" required defaultValue="" className={inputClass}>
            <option value="" disabled className="bg-[#0E0E22] text-white">Choisir…</option>
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#0E0E22] text-white">{t}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Budget envisagé
          <select name="budget" required defaultValue="" className={inputClass}>
            <option value="" disabled className="bg-[#0E0E22] text-white">Choisir…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-[#0E0E22] text-white">{b}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Délai souhaité
          <select name="delai" required defaultValue="" className={inputClass}>
            <option value="" disabled className="bg-[#0E0E22] text-white">Choisir…</option>
            {DELAIS.map((d) => (
              <option key={d} value={d} className="bg-[#0E0E22] text-white">{d}</option>
            ))}
          </select>
        </label>
      </div>

      {members.length > 0 && (
        <label className={labelClass}>
          Votre interlocuteur (optionnel)
          <select name="member" defaultValue="all" className={inputClass}>
            <option value="all" className="bg-[#0E0E22] text-white">Peu importe</option>
            {members.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0E0E22] text-white">{m.name}</option>
            ))}
          </select>
        </label>
      )}

      <label className={labelClass}>
        Votre projet en quelques lignes
        <textarea name="brief" required minLength={10} rows={6} className={inputClass} />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90 disabled:opacity-60"
        >
          {pending ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
        <p className="text-xs text-white/50">Réponse sous 24&nbsp;h · Sans engagement</p>
      </div>

      {status && status.ok && (
        <p role="status" className="text-sm font-semibold text-emerald-400">
          Demande envoyée. On revient vers vous sous 24&nbsp;h.
        </p>
      )}
      {status && !status.ok && (
        <p role="alert" className="text-sm font-semibold text-red-600">{status.error}</p>
      )}
    </form>
  );
}
