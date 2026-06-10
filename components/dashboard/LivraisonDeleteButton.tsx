"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteLivraison } from "@/app/actions/livraisons";

export default function LivraisonDeleteButton({ id, titre }: { id: string; titre: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Supprimer la livraison ${titre}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-rose-500/15 hover:text-rose-300"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => { void deleteLivraison(id); })}
        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/90 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />}
        Supprimer
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-2 py-1.5 text-xs font-bold text-white/60 transition hover:text-white"
      >
        Annuler
      </button>
    </div>
  );
}
