"use client";
import { useDevisForm } from "./store";
import { computeQuote, PricingError, type QuoteInput } from "@/lib/pricing";
import { useMemo } from "react";

export default function Recap() {
  const f = useDevisForm();

  // Project only the fields computeQuote actually reads. This avoids the
  // react-hooks/exhaustive-deps warning while keeping the memo correct: any
  // unrelated state change (e.g. nomContact) won't recompute, and any pricing
  // input change is captured because each one is listed in the deps array.
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
    <aside className="sticky top-24 rounded-3xl bg-gradient-to-br from-df-blue to-df-blue-dark p-6 text-white shadow-2xl">
      <p className="font-display text-sm italic text-df-gold">Récapitulatif</p>
      <h3 className="mt-1 font-display text-3xl italic">Votre devis</h3>

      {result.error && <p className="mt-4 rounded-lg bg-red-500/30 p-3 text-sm">{result.error}</p>}

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
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-lg">
              <span className="font-display italic">Total HT</span>
              <span className="font-bold text-df-gold">{result.quote.totalHT} €</span>
            </div>
            <div className="flex justify-between text-sm opacity-80">
              <span>Acompte 30 %</span><span>{result.quote.acompte} €</span>
            </div>
            <div className="flex justify-between text-sm opacity-80">
              <span>Solde livraison</span><span>{result.quote.solde} €</span>
            </div>
          </div>
          <p className="mt-4 text-xs opacity-60">TVA non applicable, art. 293 B du CGI.</p>
        </>
      )}
    </aside>
  );
}
