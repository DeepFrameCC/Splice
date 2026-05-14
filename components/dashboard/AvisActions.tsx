"use client";

import { useTransition } from "react";
import { approuverAvis, rejeterAvis, toggleFeaturedAvis } from "@/app/actions/admin-avis";
import { Check, X, Star } from "lucide-react";

export function ApprouverBtn({ avisId }: { avisId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => approuverAvis(avisId))}
      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:opacity-50"
    >
      <Check className="h-3 w-3" /> {pending ? "…" : "Approuver"}
    </button>
  );
}

export function FeaturedToggle({ avisId, featured }: { avisId: string; featured: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => toggleFeaturedAvis(avisId))}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
        featured
          ? "bg-df-gold/20 text-df-gold hover:bg-df-gold/30"
          : "bg-df-ink/5 text-df-ink/40 hover:bg-df-ink/10"
      }`}
      aria-label={featured ? "Retirer de la mise en avant" : "Mettre en avant"}
    >
      <Star className={`h-3 w-3 ${featured ? "fill-df-gold" : ""}`} />
      {pending ? "…" : featured ? "En avant" : "Mettre en avant"}
    </button>
  );
}

export function RejeterBtn({ avisId }: { avisId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("Supprimer cet avis définitivement ?")) {
          startTransition(() => rejeterAvis(avisId));
        }
      }}
      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
    >
      <X className="h-3 w-3" /> {pending ? "…" : "Supprimer"}
    </button>
  );
}
