import type { Metadata } from "next";
import PricingSection from "@/components/tarifs/PricingSection";

export const metadata: Metadata = {
  title: "Tarifs — Deepframe | Vidéo & Photo en Centre-Val de Loire",
  description:
    "Tarifs transparents, zéro surprise. Abonnements vidéo dès 49 €/mois, Pack Particulier dès 29 €. Options à la carte, recyclage multi-réseaux inclus.",
  alternates: { canonical: "/tarifs" },
};

export default function TarifsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-6">
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-display text-5xl italic text-white md:text-6xl">
          Tarifs <span className="text-df-gold">transparents</span>.
          <br />
          Zéro surprise.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
          Des formules adaptées à chaque besoin : abonnement mensuel pour les
          professionnels, pack à la carte pour les particuliers. TVA non
          applicable, art. 293 B du CGI.
        </p>
      </div>

      <PricingSection />
    </main>
  );
}
