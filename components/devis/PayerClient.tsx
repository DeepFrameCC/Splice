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
  devisType: string;
  billingCycle: string | null;
};

export default function PayerClient({ devisId, numero, nomContact, nomEntreprise, totalHT, acompteRate, acompteAmount, pack, devisType, billingCycle }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isAbo = devisType === "ABONNEMENT";
  const cycleLabel = billingCycle === "ANNUEL" ? "an" : "mois";

  const onPay = () => {
    setError(null);
    start(async () => {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ devisId })
        });
        const data = (await res.json()) as { error?: string; url?: string };
        if (!res.ok) { setError(data.error ?? "Erreur"); return; }
        if (data.url) {
          try {
            const targetUrl = new URL(data.url);
            if (targetUrl.protocol === "https:" && (targetUrl.hostname === "stripe.com" || targetUrl.hostname.endsWith(".stripe.com"))) {
              window.location.href = data.url;
            } else {
              console.error("[SECURITY] Redirection suspecte bloquée:", targetUrl.hostname);
              setError("Erreur de sécurité : Redirection suspecte détectée.");
            }
          } catch {
            setError("L'URL de paiement générée est invalide.");
          }
        }
      } catch (e: any) {
        toast.error("Erreur de connexion");
        setError("Impossible de contacter le serveur de paiement.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <Link href={`/profil/devis/${devisId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-df-gold">
        <ArrowLeft className="h-4 w-4" /> Retour au devis
      </Link>

      <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-df-ink to-df-surface p-8 text-white shadow-2xl shadow-black/60">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-df-gold/10">
            <ShieldCheck className="h-6 w-6 text-df-gold" />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold uppercase tracking-wider text-df-gold/80">{isAbo ? "Abonnement sécurisé" : "Paiement sécurisé"}</p>
            <h1 className="font-display text-2xl uppercase tracking-tight text-white">Devis n°{numero}</h1>
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-2xl border border-white/[0.05] bg-white/[0.03] p-6">
          <Row label="Client" value={nomEntreprise || nomContact} />
          {isAbo ? (
            <>
              <Row label="Formule" value={pack} />
              <Row label="Facturation" value={billingCycle === "ANNUEL" ? "Annuelle" : "Mensuelle"} />
              <div className="border-t border-white/[0.08] pt-3">
                <Row label={`Montant / ${cycleLabel}`} value={`${totalHT} €`} bold />
              </div>
            </>
          ) : (
            <>
              <Row label="Pack" value={pack} />
              <Row label="Total HT" value={`${totalHT} €`} />
              <div className="border-t border-white/[0.08] pt-3">
                <Row label={`Acompte (${acompteRate}%)`} value={`${acompteAmount} €`} bold />
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" /> {error}
          </div>
        )}

        <button
          onClick={onPay}
          disabled={pending}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-df-gold px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-df-gold/25 transition-all duration-300 hover:scale-[1.02] hover:bg-df-gold/90 hover:shadow-df-gold/45 active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? (
            <span className="animate-pulse">Redirection vers Stripe…</span>
          ) : isAbo ? (
            <>
              <CreditCard className="h-5 w-5" /> S&apos;abonner · {totalHT} €/{cycleLabel}
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" /> Payer {acompteAmount} € par carte
            </>
          )}
        </button>

        <p className="mt-5 text-center text-[10px] leading-relaxed text-white/30">
          Paiement 100% sécurisé géré par notre prestataire de paiement agréé Stripe.<br />
          TVA non applicable, art. 293 B du CGI.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/50">{label}</span>
      <span className={`text-sm ${bold ? "font-display text-xl font-bold text-df-gold" : "font-semibold text-white"}`}>{value}</span>
    </div>
  );
}
