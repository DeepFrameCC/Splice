import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PricingSection from "@/components/tarifs/PricingSection";
import { buildPricingJsonLd, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Tarifs vidéo & photo — Orléans & Tours",
  description:
    "Tarifs transparents, zéro surprise. Abonnements vidéo dès 45 €/mois, Pack Particulier dès 29 €. Options à la carte, recyclage multi-réseaux inclus.",
  openGraph: {
    title: "Tarifs — Splice Studio",
    description: "Abonnements vidéo dès 45 €/mois, packs photo à la carte.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${BASE_URL}/tarifs` },
};

export default function TarifsPage() {
  return (
    <div className="df-site">
      <JsonLd data={buildPricingJsonLd()} />
      <NavWrapper />
      <main className="mx-auto max-w-6xl px-4 pb-20 md:px-6" style={{ paddingTop: "calc(80px + 3rem)" }}>
        {/* Retour à l'accueil */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/60 transition hover:text-df-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à l&apos;accueil
        </Link>

        {/* Hero */}
        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl uppercase tracking-tight text-white">
            Tarifs fixes.<br />
            Pas de <em className="not-italic text-df-gold">mauvaise surprise</em>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Abonnement mensuel pour les entreprises, des packs faits exprès pour les particuliers.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs text-white/60">
            TVA non applicable, art. 293 B du CGI.
          </p>
        </div>

        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
