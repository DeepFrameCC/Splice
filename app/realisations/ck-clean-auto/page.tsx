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
  "Étude de cas Splice Studio Orléans : shooting photo et vidéo automobile réalisé pour CK Clean Auto dans le Loiret. Contexte, livrables et résultats du projet.";

// Le nœud Organization vit dans le @graph global (app/layout.tsx).
const ORG_ID = `${BASE_URL}/#organization`;

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
    // TODO: chiffre réel — datePublished (date de mise en ligne de l'étude de cas)
    // TODO: chiffre réel — image / thumbnailUrl (URL R2 d'un visuel du projet)
    // TODO: chiffre réel — si une vidéo existe, ajouter un nœud VideoObject dans `video`
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
            CK Clean Auto, spécialiste du detailing dans le Loiret (45).
          </p>
        </header>

        {/* ── Chiffres clés ────────────────────────────────────────────── */}
        {/* TODO: chiffre réel — renseigner chaque `value` avec la donnée du projet. */}
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/[0.08] py-6 sm:grid-cols-4">
          {[
            { label: "Durée du tournage", value: null },
            { label: "Photos livrées", value: null },
            { label: "Vidéos livrées", value: null },
            { label: "Délai de livraison", value: null },
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
            {/* TODO: chiffre réel — décrire le besoin client : objectif (acquisition,
                image de marque, réseaux sociaux), cible, contraintes de lieu/date. */}
            CK Clean Auto souhaitait valoriser son activité de detailing automobile
            auprès de sa clientèle locale. (Détails du brief à compléter.)
          </p>
        </section>

        {/* ── Objectifs ────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-white">Les objectifs</h2>
          <ul className="mt-3 space-y-2 text-white/70">
            <li>{/* TODO: chiffre réel */} Objectif 1 (à compléter)</li>
            <li>{/* TODO: chiffre réel */} Objectif 2 (à compléter)</li>
            <li>{/* TODO: chiffre réel */} Objectif 3 (à compléter)</li>
          </ul>
        </section>

        {/* ── Livrables ────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-white">Notre intervention &amp; les livrables</h2>
          <p className="mt-3 leading-relaxed text-white/70">
            {/* TODO: chiffre réel — préciser le déroulé : repérage, shooting,
                rolling shots, montage, étalonnage, formats livrés (9:16 / 16:9). */}
            Shooting réalisé à Orléans avec notre setup léger (à détailler).
            Voir le savoir-faire associé :{" "}
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
            {/* TODO: chiffre réel — résultats chiffrés : vues, engagement, leads,
                retours client. Ne rien publier tant que les chiffres ne sont pas fournis. */}
            Résultats à compléter avec les données réelles du projet.
          </p>
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
