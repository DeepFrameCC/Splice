"use client";
import { useDevisForm } from "./store";
import { computeQuote, PricingError, type QuoteInput } from "@/lib/pricing";
import { useMemo } from "react";
import { Receipt, AlertCircle } from "lucide-react";

export default function Recap() {
  const f = useDevisForm();

  const pack = f.pack;
  const duree = f.duree;
  const usage = f.usage;
  const delai = f.delai;
  const villeDepart = f.villeDepart;
  const distanceKm = f.distanceKm;
  const videosSupp = f.videosSupp;
  const videos3D = f.videos3D;
  const motionDesign = f.motionDesign;
  const montageExpress = f.montageExpress;
  const introAnimeeSec = f.introAnimeeSec;

  const result = useMemo(() => {
    const input: QuoteInput = {
      pack, duree, usage, delai, villeDepart, distanceKm,
      videosSupp, videos3D, motionDesign, montageExpress, introAnimeeSec,
    };
    try {
      return { quote: computeQuote(input), error: null as string | null };
    } catch (e) {
      return { quote: null, error: e instanceof PricingError ? e.message : "Erreur de calcul" };
    }
  }, [pack, duree, usage, delai, villeDepart, distanceKm, videosSupp, videos3D, motionDesign, montageExpress, introAnimeeSec]);

  return (
    <aside className="sticky top-24 space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-df-blue to-[#0E0E22] p-6 text-white shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-df-gold" />
          <p className="font-display text-sm italic text-df-gold">Récapitulatif</p>
        </div>
        <h3 className="mt-1 font-display text-3xl italic">Votre devis</h3>

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
                <li key={i} className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                  <span className="opacity-90">{l.label}{l.qty ? ` (×${l.qty})` : ""}</span>
                  <span className="font-bold whitespace-nowrap">{l.total} €</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex justify-between text-xl">
                <span className="font-display italic">Total HT</span>
                <span className="font-bold text-df-gold">{result.quote.totalHT} €</span>
              </div>
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
            </div>

            <p className="mt-4 text-xs opacity-60">TVA non applicable, art. 293 B du CGI.</p>
          </>
        )}
      </div>

      {/* Trust card */}
      <div className="rounded-2xl bg-white/[0.04] p-4 text-center">
        <p className="text-xs font-bold text-df-blue">Devis gratuit · Sans engagement</p>
        <p className="mt-1 text-[11px] text-df-blue/50">
          Nous vous recontactons sous 24h avec un devis détaillé personnalisé.
        </p>
      </div>
    </aside>
  );
}
