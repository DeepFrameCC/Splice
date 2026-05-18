import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import Wizard from "@/components/devis/Wizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demander un devis — DeepFrame",
  description:
    "Configurez votre projet audiovisuel en 4 étapes et recevez un devis détaillé sous 24h. Gratuit et sans engagement.",
  openGraph: {
    title: "Demander un devis — DeepFrame",
    description: "Configurez votre projet audiovisuel en 4 étapes.",
  },
};

export default function DevisPage() {
  return (
    <>
      <NavWrapper />
      <section className="mx-auto max-w-7xl px-6 pb-16" style={{ paddingTop: "calc(80px + 3rem)" }}>
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-df-gold">
            Devis en ligne
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-white md:text-5xl lg:text-6xl">
            Demandez votre devis
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-white/70">
            4 étapes simples — récapitulatif en temps réel. Gratuit, sans engagement.
            Nous revenons vers vous sous 24h.
          </p>
        </header>
        <Wizard />
      </section>
      <Footer />
    </>
  );
}
