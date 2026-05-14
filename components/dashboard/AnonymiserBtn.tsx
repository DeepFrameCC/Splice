"use client";

import { useTransition, useState } from "react";
import { anonymiserUtilisateur } from "@/app/actions/admin-clients";
import { UserX } from "lucide-react";

export default function AnonymiserBtn({ userId, pseudo }: { userId: string; pseudo: string }) {
  const [pending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-red-600">
          Anonymiser @{pseudo} ? Irréversible.
        </span>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await anonymiserUtilisateur(userId);
              setShowConfirm(false);
            });
          }}
          className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
        >
          {pending ? "…" : "Confirmer"}
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="rounded-full bg-df-cream px-3 py-1 text-xs font-bold text-df-ink/60 transition hover:bg-df-ink/10"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
      aria-label={`Anonymiser ${pseudo}`}
    >
      <UserX className="h-3 w-3" /> RGPD
    </button>
  );
}
