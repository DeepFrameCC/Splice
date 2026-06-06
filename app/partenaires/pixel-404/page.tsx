import type { Metadata } from "next";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, BASE_URL } from "@/lib/seo";
import Pixel404Interactive from "@/components/partners/Pixel404Interactive";

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

const PIXEL_404 = {
  name: "Pixel 404",
  url: "https://www.pixel404.fr/",
  description:
    "Magasin informatique et gaming à Orléans : réparation consoles & PC, montage de PC sur mesure et cartes Pokémon TCG.",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/pixel404fr" },
    { label: "Facebook", url: "https://www.facebook.com/pixel404fr" },
    { label: "TikTok", url: "https://www.tiktok.com/@pixel404fr" },
  ],
};

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

      <main className="min-h-screen bg-[#08080C] text-white">
        <Pixel404Interactive />
      </main>

      <Footer />
    </>
  );
}
