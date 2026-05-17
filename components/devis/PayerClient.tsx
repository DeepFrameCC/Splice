"use client";
import { useState, useTransition } from "react";
import { CreditCard, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Props = {
  devisId: string;
  numero: string;
  nomContact: string;
  nomEntreprise: string;
  totalHT: number;
  acompteRate: number;
  acompteAmount: number;
  pack: string;
};

export default function PayerClient({ devisId, numero, nomContact, nomEntreprise, totalHT, acompteRate, acompteAmount, pack }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onPay = () => {
    setError(null);
    start(async () => {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ devisId })
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Erreur"); return; }
        if (data.url) { window.location.href = data.url; }
      } catch (e: any) {
        toast.error("Erreur de connexion");
        setError("Impossible de contacter le serveur de paiement.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <Link href={`/profil/devis/${devisId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-df-blue/70 hover:text-df-blue">
        <ArrowLeft className="h-4 w-4" /> Retour au devis
      </Link>

      <div className="rounded-3xl bg-gradient-to-br from-df-blue to-df-blue-dark p-8 text-white shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-df-gold" />
          <div>
            <p className="font-display text-sm italic text-df-gold">Paiement sécurisé</p>
            <h1 className="font-display text-3xl italic">Devis n°{numero}</h1>
          </div>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-white/10 p-5 backdrop-blur">
          <Row label="Client" value={nomEntreprise || nomContact} />
          <Row label="Pack" value={pack} />
          <Row label="Total HT" value={`${totalHT} €`} />
          <div className="border-t border-white/20 pt-3">
            <Row label={`Acompte (${acompteRate}%)`} value={`${acompteAmount} €`} bold />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/30 p-3 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <button
          onClick={onPay}
          disabled={pending}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-df-gold px-8 py-4 font-bold text-df-blue transition hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-60"
        >
          {pending ? (
            <span className="animate-pulse">Redirection vers Stripe…</span>
          ) : (
            <>
              <CreditCard className="h-5 w-5" /> Payer {acompteAmount} € par carte
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs opacity-70">
          Paiement sécurisé via Stripe. TVA non applicable, art. 293 B du CGI.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm opacity-80">{label}</span>
      <span className={`text-sm ${bold ? "font-bold text-df-gold text-lg" : ""}`}>{value}</span>
    </div>
  );
}
