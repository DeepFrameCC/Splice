import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import { absoluteUrl, BASE_URL } from "@/lib/seo";

export const revalidate = 86400;

const PATH = "/realisations/ck-clean-auto";
const TITLE = "Étude de cas — Shooting auto CK Clean Auto · Orléans";
const DESCRIPTION =
  "Étude de cas Splice Studio Orléans : shooting photo et vidéo automobile réalisé pour CK Clean Auto dans le Loiret (45) à Saran. Contexte, livrables et résultats du projet.";

// Le nœud Organization vit dans le @graph global (app/layout.tsx).
const ORG_ID = `${BASE_URL}/#organization`;

// Miniatures : vraies photos du chantier déjà présentes dans la galerie (R2).
const THUMB_PPF = "https://media.splicestudio.fr/photos/travail%204%20porche.webp";
const THUMB_INTERVIEW = "https://media.splicestudio.fr/photos/porche%20c%C3%B4t%C3%A9.webp";

// Vidéos publiées sur Instagram (posts collaboratifs avec CK Clean Auto).
const REELS = [
  {
    url: "https://www.instagram.com/reel/DW4AaU7DKRo/",
    name: "Présentation : pose de film PPF sur Porsche Cayman S",
    thumbnailUrl: THUMB_PPF,
    uploadDate: "2026-04-15",
  },
  {
    url: "https://www.instagram.com/reel/DXKA6-YDUjO/",
    name: "Interview du propriétaire de CK Clean Auto",
    thumbnailUrl: THUMB_INTERVIEW,
    uploadDate: "2026-04-15",
  },
];

export function generateMetadata(): Metadata {
  const url = absoluteUrl(PATH);
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: "Splice Studio",
      locale: "fr_FR",
      type: "article",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

export default function CkCleanAutoCaseStudyPage() {
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Shooting automobile CK Clean Auto",
    headline: "Étude de cas — Shooting auto CK Clean Auto",
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    inLanguage: "fr-FR",
    creator: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
    locationCreated: {
      "@type": "Place",
      name: "Orléans, Loiret, Centre-Val de Loire, France",
    },
    about: "Shooting photo et vidéo automobile pour le detailing automobile CK Clean Auto.",
    datePublished: "2026-06-11",
    image: THUMB_PPF,
    video: REELS.map((reel) => ({
      "@type": "VideoObject",
      name: reel.name,
      description:
        "Detailing automobile CK Clean Auto à Saran (Loiret) par Splice Studio Orléans.",
      embedUrl: reel.url,
      thumbnailUrl: reel.thumbnailUrl,
      uploadDate: reel.uploadDate,
    })),
  };

  return (
    <>
      {/* BreadcrumbList JSON-LD est émis par le composant Breadcrumbs ci-dessous. */}
      <JsonLd data={creativeWorkJsonLd} />
      <NavWrapper />

      <main className="mx-auto max-w-[860px] px-6 pb-20" style={{ paddingTop: "calc(80px + 3rem)" }}>
        <Breadcrumbs
          items={[
            { name: "Accueil", href: "/" },
            { name: "Réalisations", href: "/galerie" },
            { name: "CK Clean Auto", href: PATH },
          ]}
        />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-df-gold">
            Étude de cas · Shooting automobile
          </p>
          <h1
            className="mt-2 font-display text-4xl uppercase tracking-tight text-white md:text-5xl"
            style={{ textWrap: "balance" }}
          >
            CK Clean Auto
          </h1>
          <p className="mt-3 text-white/70">
            Shooting photo et vidéo automobile réalisé par Splice Studio Orléans pour{" "}
            CK Clean Auto, spécialiste du detailing dans le Loiret (45) à Saran.
          </p>
        </header>

        {/* ── Chiffres clés ────────────────────────────────────────────── */}
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/[0.08] py-6 sm:grid-cols-4">
          {[
            { label: "Durée du tournage", value: "3 h" },
            { label: "Photos livrées", value: "10" },
            { label: "Vidéos livrées", value: "3" },
            { label: "Délai de livraison", value: "3 jours" },
          ].map((stat) => (
            <div key={stat.label}>
              <dd className="font-display text-2xl text-df-gold">
                {stat.value ?? <span className="text-white/30">à compléter</span>}
              </dd>
              <dt className="mt-1 text-[11px] uppercase tracking-wide text-white/50">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* ── Contexte ─────────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2 className="font-display text-2xl text-white">Le contexte</h2>
          <p className="mt-3 leading-relaxed text-white/70">
            CK Clean Auto, spécialiste du detailing automobile dans le Loiret (45),
            nous a confié la réalisation de{" "}
            <Link
              href="/services/pub-reseaux-sociaux/orleans"
              className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue"
            >
              vidéos promotionnelles pour les réseaux sociaux à Orléans
            </Link>
            . Sur place, nous
            avons filmé la pose d&apos;un film de protection (PPF) sur une Porsche
            Cayman S bleue, puis interviewé le propriétaire sur l&apos;histoire et le
            parcours de son entreprise. Le but : présenter les services et les tarifs
            du garage à ses futurs clients.
          </p>
        </section>

        {/* ── Objectifs ────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-white">Les objectifs</h2>
          <ul className="mt-3 space-y-2 text-white/70">
            <li>
              <strong className="font-semibold text-white">Promouvoir</strong> l&apos;entreprise
              et son savoir-faire en detailing automobile.
            </li>
            <li>
              <strong className="font-semibold text-white">Informer</strong> les clients
              sur les services proposés et les tarifs.
            </li>
            <li>
              <strong className="font-semibold text-white">Crédibiliser</strong> l&apos;expertise
              du garage en montrant une pose de PPF et le parcours du propriétaire.
            </li>
          </ul>
        </section>

        {/* ── Livrables ────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-white">Notre intervention &amp; les livrables</h2>
          <p className="mt-3 leading-relaxed text-white/70">
            Nous avons monté les rushes sur DaVinci Resolve et livré les vidéos au
            format MP4. La diffusion s&apos;est faite via un post collaboratif sur
            Instagram, publié avec le compte de CK Clean Auto. Voir le savoir-faire
            associé :{" "}
            <Link
              href="/services/shooting-automobile"
              className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue"
            >
              shooting automobile
            </Link>
            .
          </p>
        </section>

        {/* ── Résultats ────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-white">Les résultats</h2>
          <p className="mt-3 leading-relaxed text-white/70">
            Les vidéos ont dépassé 2 000 vues sur Instagram.
          </p>
        </section>

        {/* ── Vidéos ───────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-white">Les vidéos</h2>
          <ul className="mt-3 space-y-2">
            {REELS.map((reel) => (
              <li key={reel.url}>
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue"
                >
                  {reel.name} sur Instagram
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-14 rounded-2xl bg-df-blue p-8 text-center text-df-night">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Un projet automobile similaire&nbsp;?
          </h2>
          <p className="mt-2 text-df-night/85">
            Splice Studio Orléans réalise vos shootings photo et vidéo dans tout le Loiret.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 rounded-full bg-df-night px-6 py-3 font-bold text-white transition hover:bg-df-night/90"
            >
              Demander un devis →
            </Link>
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 rounded-full border-2 border-df-night/40 px-6 py-3 font-bold text-df-night transition hover:bg-df-night/10"
            >
              Voir nos réalisations
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
