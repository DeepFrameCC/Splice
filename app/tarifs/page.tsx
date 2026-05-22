import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PricingSection from "@/components/tarifs/PricingSection";

export const metadata: Metadata = {
  title: "Tarifs — Deepframe | Vidéo & Photo en Centre-Val de Loire",
  description:
    "Tarifs transparents, zéro surprise. Abonnements vidéo dès 45 €/mois, Pack Particulier dès 29 €. Options à la carte, recyclage multi-réseaux inclus.",
  alternates: { canonical: "/tarifs" },
};

export default function TarifsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-6">
      {/* Retour à l'accueil */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/40 transition hover:text-df-gold"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour à l&apos;accueil
      </Link>

      {/* Hero */}
      <div className="text-center">
        <h1 className="font-display text-5xl uppercase tracking-tight text-white md:text-7xl">
          Tarifs fixes.<br />
          Pas de <em className="not-italic text-df-gold">mauvaise surprise</em>.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
          Abonnement mensuel pour les pros, pack à la carte pour les particuliers.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-xs text-white/40">
          TVA non applicable, art. 293 B du CGI.
        </p>
      </div>

      <PricingSection />
    </main>
  );
}
