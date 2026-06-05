import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Video, Camera, CalendarDays, MapPin, ExternalLink } from "lucide-react";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pixel 404 × Splice Studio — partenaire gaming & pop culture à Orléans",
  description:
    "Splice Studio réalise les contenus vidéo et photo de Pixel 404, magasin informatique et gaming à Orléans (réparation consoles & PC, montage sur mesure, cartes Pokémon TCG).",
  alternates: { canonical: `${BASE_URL}/partenaires/pixel-404` },
  openGraph: {
    title: "Pixel 404 × Splice Studio",
    description: "Vidéo et photo pour Pixel 404, magasin gaming à Orléans.",
  },
  twitter: { card: "summary_large_image" },
};

// Faits publics vérifiés sur pixel404.fr.
const PIXEL_404 = {
  name: "Pixel 404",
  url: "https://www.pixel404.fr/",
  description:
    "Magasin informatique et gaming à Orléans : réparation consoles & PC, montage de PC sur mesure et cartes Pokémon TCG.",
  address: "84 Boulevard Alexandre Martin, 45000 Orléans",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/pixel404fr" },
    { label: "Facebook", url: "https://www.facebook.com/pixel404fr" },
    { label: "TikTok", url: "https://www.tiktok.com/@pixel404fr" },
  ],
};

// Ce que Splice Studio produit pour Pixel 404.
const COLLAB = [
  {
    icon: Video,
    title: "Vidéos produit & setups",
    text: "Présentation des configs gaming, des nouveautés et de l'atelier, pour leurs réseaux.",
  },
  {
    icon: CalendarDays,
    title: "Événements en boutique",
    text: "Captation des soirées, sorties et tournois organisés chez Pixel 404.",
  },
  {
    icon: Camera,
    title: "Photo boutique",
    text: "Images de la boutique et des produits, prêtes pour le web et les réseaux.",
  },
];

const pixel404OrgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: PIXEL_404.name,
  description: PIXEL_404.description,
  url: PIXEL_404.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: "84 Boulevard Alexandre Martin",
    addressLocality: "Orléans",
    postalCode: "45000",
    addressCountry: "FR",
  },
  sameAs: PIXEL_404.socials.map((s) => s.url),
};

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
      <JsonLd data={pixel404OrgJsonLd} />
      <NavWrapper />

      <main className="mx-auto max-w-5xl px-6 pb-20" style={{ paddingTop: "calc(80px + 3rem)" }}>
        {/* Hero */}
        <header className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-df-gold">
            Partenaire officiel · Orléans
          </p>
          <h1 className="text-5xl font-bold leading-none text-white md:text-7xl" style={{ letterSpacing: "-0.03em" }}>
            Pixel 404 <span className="text-df-gold">×</span> Splice Studio
          </h1>
          <p className="mt-5 max-w-2xl text-white/70">
            Pixel 404 est un magasin informatique et gaming à Orléans : réparation
            consoles & PC, montage de PC sur mesure et cartes Pokémon TCG. On
            s&apos;occupe de leur image, on filme et on photographie la boutique, les
            produits et les événements.
          </p>
        </header>

        {/* Le partenaire — infos vérifiées */}
        <section className="mb-12 grid gap-4 rounded-2xl border border-white/[0.08] bg-df-surface p-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-df-gold" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Boutique</p>
              <p className="text-sm text-white">{PIXEL_404.address}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={PIXEL_404.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-df-gold/40 hover:text-df-gold"
            >
              pixel404.fr <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {PIXEL_404.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 transition hover:text-df-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>

        {/* Ce qu'on fait ensemble */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-white">Ce qu&apos;on fait ensemble</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {COLLAB.map((c) => (
              <div key={c.title} className="rounded-2xl border border-white/[0.08] bg-df-surface p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-df-blue text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pourquoi ce partenariat */}
        <section className="mb-12 rounded-2xl border border-white/[0.08] bg-df-surface p-8">
          <h2 className="text-2xl font-semibold text-white">Pourquoi ce partenariat</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            Deux boîtes d&apos;Orléans, un même public : joueurs, créateurs et
            passionnés de tech. Eux connaissent le gaming et la pop culture, nous
            l&apos;image. On avance ensemble, sans intermédiaire.
          </p>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-start gap-5 rounded-2xl bg-df-blue p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold uppercase text-white">Un projet vidéo ou photo ?</h2>
            <p className="mt-1 text-sm text-white/70">Partenaire de Pixel 404 ou non, on répond sous 24&nbsp;h.</p>
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
