"use client";
import { useDevisForm } from "./store";
import {
  computeAbonnementQuote,
  computePackParticulierQuote,
  computeFormuleBienvenueQuote,
  PricingError,
  SUBSCRIPTION_PLANS,
  FORMULE_BIENVENUE,
} from "@/lib/pricing";
import { useMemo } from "react";
import { Receipt, AlertCircle } from "lucide-react";

export default function Recap() {
  const f = useDevisForm();

  const result = useMemo(() => {
    try {
      if (f.mode === "FORMULE_BIENVENUE") {
        const quote = computeFormuleBienvenueQuote();
        return { quote, error: null as string | null };
      }
      if (f.mode === "ABONNEMENT") {
        const quote = computeAbonnementQuote({
          planId: f.planId,
          billingCycle: f.billingCycle,
          useLaunchPrice: f.useLaunchPrice,
          options: f.options,
        });
        return { quote, error: null as string | null };
      }
      const quote = computePackParticulierQuote({
        nbVideos: f.nbVideos,
        nbPhotos: f.nbPhotos,
        options: f.options,
        banniere: f.banniere,
        villeDepart: f.villeDepart,
        distanceKm: f.distanceKm,
        delai: f.delai,
      });
      return { quote, error: null as string | null };
    } catch (e) {
      return {
        quote: null,
        error: e instanceof PricingError ? e.message : "Erreur de calcul",
      };
    }
  }, [
    f.mode,
    f.planId,
    f.billingCycle,
    f.useLaunchPrice,
    f.nbVideos,
    f.nbPhotos,
    f.options,
    f.banniere,
    f.villeDepart,
    f.distanceKm,
    f.delai,
  ]);

  const modeLabel =
    f.mode === "FORMULE_BIENVENUE"
      ? FORMULE_BIENVENUE.label
      : f.mode === "ABONNEMENT"
      ? `Abonnement ${SUBSCRIPTION_PLANS[f.planId].label}`
      : "Pack Particulier";

  return (
    <aside className="sticky top-24 space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-df-glauque to-[#0E0E22] p-6 text-white shadow-2xl shadow-black/40 ring-1 ring-white/[0.08]">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-df-gold" />
          <p className="font-display text-sm uppercase tracking-wider text-df-gold">
            Récapitulatif
          </p>
        </div>
        <h3 className="mt-1 font-display text-3xl uppercase tracking-tight">Votre devis</h3>
        <p className="mt-1 text-xs text-white/50">{modeLabel}</p>

        {result.error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-500/20 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            <p className="text-sm text-red-200">{result.error}</p>
          </div>
        )}

        {result.quote && (
          <>
            <ul className="mt-4 space-y-2 text-sm">
              {result.quote.lines.map((l, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 border-b border-white/10 pb-2"
                >
                  <span className="opacity-90">
                    {l.label}
                    {l.qty ? ` (×${l.qty})` : ""}
                  </span>
                  <span className="whitespace-nowrap font-bold">
                    {l.total} €
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-2xl bg-df-glauque-mid/30 p-4 backdrop-blur-sm ring-1 ring-df-glauque-500/20">
              <div className="flex justify-between text-xl">
                <span className="font-display uppercase tracking-wider">Total HT</span>
                <span className="font-bold text-df-glauque-300">
                  {result.quote.totalHT} €
                </span>
              </div>
              {f.mode === "PACK_PARTICULIER" && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm opacity-80">
                    <span>Acompte 30 %</span>
                    <span>{result.quote.acompte} €</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-80">
                    <span>Solde livraison</span>
                    <span>{result.quote.solde} €</span>
                  </div>
                </div>
              )}
              {f.mode === "ABONNEMENT" && (
                <p className="mt-2 text-xs text-white/50">
                  {f.billingCycle === "ANNUEL"
                    ? "Facturé annuellement"
                    : "Engagement 3 mois minimum"}
                </p>
              )}
              {f.mode === "FORMULE_BIENVENUE" && (
                <p className="mt-2 text-xs text-white/50">
                  Offre gratuite — sans engagement
                </p>
              )}
            </div>

            <p className="mt-4 text-xs opacity-60">
              TVA non applicable, art. 293 B du CGI.
            </p>
          </>
        )}
      </div>

      {/* Trust card */}
      <div className="rounded-2xl bg-white/[0.04] p-5 text-center">
        <p className="text-sm font-bold text-white">
          Devis gratuit · Sans engagement
        </p>
        <p className="mt-1 text-xs text-white/50">
          Nous vous recontactons sous 24h avec un devis détaillé personnalisé.
        </p>
      </div>
    </aside>
  );
}
