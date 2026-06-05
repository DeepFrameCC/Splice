import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import Wizard from "@/components/devis/Wizard";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Demander un devis vidéo — réponse sous 24h",
  description:
    "Configurez votre projet audiovisuel en 3 étapes et recevez un devis détaillé sous 24h. Gratuit et sans engagement.",
  openGraph: {
    title: "Demander un devis — Splice Studio",
    description: "Configurez votre projet audiovisuel en 3 étapes.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${BASE_URL}/devis` },
};

export default async function DevisPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  let canUseFormuleBienvenue = false;
  let userInfo: { name: string; email: string } | null = null;

  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { hasUsedFormuleBienvenue: true, pseudo: true, email: true },
    });
    if (user) {
      canUseFormuleBienvenue = !user.hasUsedFormuleBienvenue;
      userInfo = { name: user.pseudo, email: user.email };
    }
  }

  return (
    <>
      <NavWrapper />
      <section className="mx-auto max-w-7xl px-6 pb-16" style={{ paddingTop: "calc(80px + 3rem)" }}>
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-df-gold">
            Devis en ligne
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
            Demander un devis
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-white/70">
            3 étapes simples — récapitulatif en temps réel. Gratuit, sans engagement.
            Réponse et proposition commerciale personnalisée sous 48h maximum.
          </p>
        </header>
        <Wizard
          isAuthenticated={Boolean(userId)}
          canUseFormuleBienvenue={canUseFormuleBienvenue}
          userInfo={userInfo}
          isAdmin={isAdmin}
        />
      </section>
      <Footer />
    </>
  );
}
