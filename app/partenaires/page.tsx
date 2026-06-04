import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Partenaires — Splice",
  description:
    "Les structures locales avec qui Splice travaille, dont Pixel 404, boutique gaming et pop culture.",
  alternates: { canonical: `${BASE_URL}/partenaires` },
  openGraph: {
    title: "Partenaires Splice",
    description: "Nos partenaires en Centre-Val de Loire.",
  },
};

const PARTNERS = [
  {
    slug: "pixel-404",
    name: "Pixel 404",
    tagline: "Magasin gaming & informatique · Orléans",
    text: "On réalise leurs vidéos et photos : boutique, produits et événements.",
  },
];

export default function PartenairesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "/" },
          { name: "Partenaires", url: "/partenaires" },
        ])}
      />
      <NavWrapper />

      <main
        className="mx-auto max-w-5xl px-6 pb-20"
        style={{ paddingTop: "calc(80px + 3rem)" }}
      >
        <header className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-df-gold">
            Partenaires
          </p>
          <h1 className="text-5xl font-bold leading-none text-white md:text-6xl" style={{ letterSpacing: "-0.03em" }}>
            On travaille avec
          </h1>
          <p className="mt-5 max-w-2xl text-white/70">
            Des structures locales avec qui on avance en confiance.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {PARTNERS.map((p) => (
            <Link
              key={p.slug}
              href={`/partenaires/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-white/[0.08] bg-df-surface p-6 transition hover:border-df-gold/30"
            >
              <h2 className="text-xl font-bold text-white group-hover:text-df-gold">{p.name}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-df-gold">
                {p.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{p.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                Voir le partenariat
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
