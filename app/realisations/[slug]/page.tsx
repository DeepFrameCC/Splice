import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import { absoluteUrl, buildRealisationJsonLd } from "@/lib/seo";
import {
  getAllRealisations,
  getRealisationBySlug,
  type Realisation,
} from "@/lib/realisations";

export const revalidate = 3600;
export const dynamicParams = true;

// ── Contexte éditorial par catégorie (générique mais véridique, anti-doorway) ──
const CATEGORY_CONTEXT: Record<string, string> = {
  automobile:
    "Splice Studio Orléans réalise des contenus vidéo automobile dans le Loiret (45) et tout le Centre-Val de Loire : rolling shots, plans détails et montage rythmé pour valoriser un véhicule, une préparation ou un savoir-faire. Le tournage se fait avec un setup léger (Sony ZV-1 4K, micro sans fil DJI) et le montage sur DaVinci Resolve.",
  "pub-sociaux":
    "Cette réalisation s'inscrit dans nos formats courts pensés pour le mobile : vidéos verticales 9:16 pour Instagram Reels, TikTok et YouTube Shorts, avec accroche dès la première seconde et sous-titres animés. Splice Studio accompagne les marques d'Orléans et de Tours dans leur stratégie de contenu réseaux sociaux.",
  evenement:
    "Splice Studio couvre les événements à Orléans, Tours et dans tout le Centre-Val de Loire : captation multi-plans, aftermovie et montage dynamique qui restitue l'ambiance d'un moment. De la soirée à l'événement institutionnel, nous livrons une version longue pour le site et des formats courts pour les réseaux.",
  portrait:
    "Splice Studio réalise des portraits et reportages vidéo à Orléans et Tours : interviews, présentations et témoignages filmés en multicaméra avec un son professionnel. L'objectif est de donner une parole crédible et incarnée à une marque ou une équipe.",
};
const DEFAULT_CONTEXT =
  "Splice Studio est une boîte de production audiovisuelle basée à Orléans et Tours. Nous concevons, tournons et montons des contenus vidéo pour les entreprises et les marques du Centre-Val de Loire.";

// ── Lien service métier contextuel par catégorie (maillage interne) ──
const CATEGORY_LINK: Record<string, { href: string; label: string }> = {
  automobile: { href: "/services/shooting-automobile", label: "shooting automobile à Orléans" },
  "pub-sociaux": { href: "/services/pub-reseaux-sociaux", label: "publicité vidéo pour les réseaux sociaux" },
  evenement: { href: "/services/production-corporate", label: "captation d'événement et film corporate" },
  portrait: { href: "/services/interview-temoignage", label: "interview et témoignage vidéo" },
};
const DEFAULT_LINK = { href: "/services", label: "nos services audiovisuels" };

function contextFor(r: Realisation): string {
  return (r.category && CATEGORY_CONTEXT[r.category]) || DEFAULT_CONTEXT;
}
function serviceLinkFor(r: Realisation): { href: string; label: string } {
  return (r.category && CATEGORY_LINK[r.category]) || DEFAULT_LINK;
}

export async function generateStaticParams() {
  const all = await getAllRealisations();
  return all.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRealisationBySlug(slug);
  if (!r) return { title: "Réalisation introuvable" };

  const url = absoluteUrl(`/realisations/${r.slug}`);
  const title = `${r.title} — Réalisation vidéo Orléans`;
  const description =
    r.description ||
    `Réalisation vidéo Splice Studio à Orléans : ${r.title}. Production audiovisuelle en Centre-Val de Loire.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Splice Studio",
      locale: "fr_FR",
      type: "article",
      ...(r.thumbnailUrl ? { images: [{ url: r.thumbnailUrl }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RealisationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await getRealisationBySlug(slug);
  if (!r) notFound();

  const all = await getAllRealisations();
  const related = all
    .filter((x) => x.slug !== r.slug && x.category === r.category)
    .slice(0, 3);

  const link = serviceLinkFor(r);
  const facts = [
    { label: "Durée", value: r.duration ?? null },
    { label: "Client", value: r.client ?? null },
    { label: "Catégorie", value: r.category ?? null },
    { label: "Matériel", value: r.materiel.length > 0 ? r.materiel.join(", ") : null },
  ].filter((f) => f.value);

  return (
    <>
      <JsonLd data={buildRealisationJsonLd(r)} />
      <NavWrapper />

      <main className="mx-auto max-w-[860px] px-6 pb-20" style={{ paddingTop: "calc(80px + 3rem)" }}>
        <Breadcrumbs
          items={[
            { name: "Accueil", href: "/" },
            { name: "Réalisations", href: "/galerie" },
            { name: r.title, href: `/realisations/${r.slug}` },
          ]}
        />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-df-gold">
            Réalisation vidéo · Splice Studio Orléans
          </p>
          <h1
            className="mt-2 font-display text-4xl uppercase tracking-tight text-white md:text-5xl"
            style={{ textWrap: "balance" }}
          >
            {r.title}
          </h1>
          {r.description && (
            <p className="mt-3 text-white/70">{r.description}</p>
          )}
        </header>

        {/* ── Vidéo ────────────────────────────────────────────────────── */}
        <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-white/[0.08]">
          <video
            controls
            preload="metadata"
            poster={r.thumbnailUrl ?? undefined}
            className="aspect-video w-full bg-black"
          >
            <source src={r.url} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture vidéo.
          </video>
        </div>

        {/* ── Faits clés ───────────────────────────────────────────────── */}
        {facts.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-white/[0.08] py-6 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label}>
                <dd className="font-display text-lg text-df-gold">{f.value}</dd>
                <dt className="mt-1 text-[11px] uppercase tracking-wide text-white/50">{f.label}</dt>
              </div>
            ))}
          </dl>
        )}

        {/* ── Contexte ─────────────────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-white">À propos de cette réalisation</h2>
          <p className="mt-3 leading-relaxed text-white/70">{contextFor(r)}</p>
          <p className="mt-4 leading-relaxed text-white/70">
            Découvrez notre savoir-faire en{" "}
            <Link
              href={link.href}
              className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue"
            >
              {link.label}
            </Link>
            , parcourez{" "}
            <Link
              href="/galerie"
              className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue"
            >
              l&apos;ensemble de nos réalisations
            </Link>{" "}
            ou demandez un{" "}
            <Link
              href="/devis"
              className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue"
            >
              devis gratuit en ligne
            </Link>
            .
          </p>
        </section>

        {/* ── Réalisations liées ───────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-white">Autres réalisations</h2>
            <ul className="mt-3 space-y-2">
              {related.map((x) => (
                <li key={x.slug}>
                  <Link
                    href={`/realisations/${x.slug}`}
                    className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue"
                  >
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-14 rounded-2xl bg-df-blue p-8 text-center text-df-night">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Un projet vidéo similaire&nbsp;?
          </h2>
          <p className="mt-2 text-df-night/85">
            Splice Studio Orléans produit vos vidéos à Orléans, Tours et dans tout le Centre-Val de Loire.
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
