import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Video, Camera, CalendarDays } from "lucide-react";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pixel 404 × Splice — partenaire gaming & pop culture",
  description:
    "Splice réalise les contenus vidéo et photo de Pixel 404, boutique gaming et pop culture avec atelier de réparation : produits, coulisses de l'atelier et événements en boutique.",
  alternates: { canonical: `${BASE_URL}/partenaires/pixel-404` },
  openGraph: {
    title: "Pixel 404 × Splice",
    description: "Vidéo et photo pour Pixel 404, gaming et pop culture.",
  },
  twitter: { card: "summary_large_image" },
};

// Ce que Splice produit pour Pixel 404 (faits fournis par l'équipe).
const COLLAB = [
  {
    icon: Video,
    title: "Vidéos produit & réparation",
    text: "Présentation des nouveautés et de l'atelier, pour leur chaîne et leurs réseaux.",
  },
  {
    icon: CalendarDays,
    title: "Événements en boutique",
    text: "Captation des soirées, sorties et tournois organisés chez Pixel 404.",
  },
  {
    icon: Camera,
    title: "Photo boutique",
    text: "Images de l'espace de vente et des produits, prêtes pour le web et les réseaux.",
  },
];

export default function PartenairePixel404Page() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "/" },
          { name: "Partenaires", url: "/partenaires" },
          { name: "Pixel 404", url: "/partenaires/pixel-404" },
        ])}
      />
      <NavWrapper />

      <main
        className="mx-auto max-w-5xl px-6 pb-20"
        style={{ paddingTop: "calc(80px + 3rem)" }}
      >
        {/* Hero */}
        <header className="mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-df-gold">
            Partenaire officiel
          </p>
          <h1 className="text-5xl font-bold leading-none text-white md:text-7xl" style={{ letterSpacing: "-0.03em" }}>
            Pixel 404 <span className="text-df-gold">×</span> Splice
          </h1>
          <p className="mt-5 max-w-2xl text-white/70">
            Pixel 404 est une boutique gaming et pop culture, avec son atelier de
            réparation. On s&apos;occupe de leur image : on filme et on photographie
            les produits, l&apos;atelier et les événements en boutique.
          </p>
        </header>

        {/* Ce qu'on fait ensemble */}
        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-semibold text-white">Ce qu&apos;on fait ensemble</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {COLLAB.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/[0.08] bg-df-surface p-6"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-df-blue text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pourquoi ça marche */}
        <section className="mb-14 rounded-2xl border border-white/[0.08] bg-df-surface p-8">
          <h2 className="text-2xl font-semibold text-white">Pourquoi ce partenariat</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            Eux connaissent le gaming et la pop culture, nous l&apos;image. Le public
            est le même : joueurs, créateurs et passionnés de la région. On avance
            ensemble, sans intermédiaire.
          </p>
          {/* TODO: ajouter le lien officiel Pixel 404 (site / Instagram) quand fourni. */}
        </section>

        {/* CTA */}
        <section className="flex flex-col items-start gap-5 rounded-2xl bg-df-blue p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold uppercase text-white">
              Un projet vidéo ou photo ?
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Partenaire de Pixel 404 ou non, on répond sous 24&nbsp;h.
            </p>
          </div>
          <Link
            href="/devis"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-df-gold px-6 py-3 text-sm font-bold text-[#1A1408] transition hover:scale-105"
          >
            Demander un devis <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
