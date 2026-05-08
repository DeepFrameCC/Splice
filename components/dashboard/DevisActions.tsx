"use client";
import { useTransition } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { validerDevis, refuserDevis } from "@/app/actions/admin";
import toast from "react-hot-toast";

export function ValiderBtn({ devisId }: { devisId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await validerDevis(devisId); toast.success("Devis validé"); })}
      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-200 disabled:opacity-50"
    >
      <CheckCircle className="h-3.5 w-3.5" /> {pending ? "…" : "Valider"}
    </button>
  );
}

export function RefuserBtn({ devisId }: { devisId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await refuserDevis(devisId); toast.success("Devis refusé"); })}
      className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-800 transition hover:bg-rose-200 disabled:opacity-50"
    >
      <XCircle className="h-3.5 w-3.5" /> {pending ? "…" : "Refuser"}
    </button>
  );
}
