import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { StickyMobileCta } from "@/components/marketing/StickyMobileCta";
import { buildLandingJsonLd } from "@/lib/services/schema-service";
import { absoluteUrl } from "@/lib/seo";
import type { FAQItem } from "@/lib/services/types";

export const revalidate = 86400;

const PATH = "/agence-communication-orleans";
const TITLE = "Agence de communication à Orléans";
const DESCRIPTION =
  "Agence de communication à Orléans : stratégie visuelle, vidéo, événementiel et social media. Splice accompagne les entreprises du Loiret. Devis gratuit.";
const H1 = "Agence de communication à Orléans";

const FAQ: FAQItem[] = [
  {
    question: "Quelle différence entre une agence de communication et un freelance ?",
    answer:
      "Un freelance couvre une compétence précise (montage, photo, rédaction). Une agence comme Splice orchestre l'ensemble : stratégie, image, vidéo, social media et événementiel, avec une cohérence de marque d'un support à l'autre et un interlocuteur unique qui pilote le projet de bout en bout.",
  },
  {
    question: "Combien coûte une agence de communication à Orléans ?",
    answer:
      "Tout dépend du périmètre. Splice propose des packs à la carte (photos dès 15 €, vidéos dès 29 €) et des abonnements mensuels de montage vidéo à partir de 45 €/mois. Les accompagnements plus complets sont chiffrés sur devis : configurez votre besoin sur notre simulateur de devis en ligne ou consultez la page Tarifs.",
  },
  {
    question: "Travaillez-vous avec les restaurants et commerces locaux ?",
    answer:
      "Oui. Les restaurants, commerces et marques locales d'Orléans font partie de nos cibles privilégiées : photos de produits et de plats, contenus vidéo verticaux pour les réseaux et couverture d'événements. Nous adaptons les formats et le budget à la réalité d'un commerce de proximité.",
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
      siteName: "Splice",
      locale: "fr_FR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

export default function AgenceCommunicationOrleansPage() {
  const jsonLd = buildLandingJsonLd({
    path: PATH,
    name: "Agence de communication à Orléans",
    pageTitle: TITLE,
    description: DESCRIPTION,
    breadcrumbName: "Agence de communication Orléans",
    serviceType: "MarketingService",
    faq: FAQ,
  });

  return (
    <>
      <NavWrapper />
      <JsonLd data={jsonLd} />

      <div className="df-root pb-24" style={{ paddingTop: "calc(80px + 3rem)" }}>
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 mb-8">
          <Breadcrumbs
            jsonLd={false}
            className="text-xs text-white/50"
            items={[
              { name: "Accueil", href: "/" },
              { name: "Agence de communication Orléans", href: PATH },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Title / Description */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Studio Créatif · Orléans
              </span>
              <h1 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-6xl">
                {H1}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Splice est un studio de création visuelle et une agence de communication à Orléans. Nous accompagnons les entreprises, commerces et institutions du Loiret pour donner une image forte et cohérente à leur marque — de la stratégie de marque à la production de contenus photo, vidéo, motion design et réseaux sociaux.
              </p>
            </div>
            
            {/* Manifeste / Side Frame */}
            <div className="relative lg:col-span-5">
              <div className="df-cine-corners p-8 bg-df-surface border border-white/[0.06] rounded-2xl">
                <i /><i /><i /><i />
                <span className="text-[10px] font-mono tracking-widest text-df-gold uppercase">Manifeste</span>
                <p className="mt-4 font-serif text-lg italic text-white/90">
                  &ldquo;L&apos;image juste a plus de pouvoir qu&apos;un long discours. Nous refusons les banques d&apos;images génériques pour façonner l&apos;identité visuelle singulière de votre entreprise.&rdquo;
                </p>
                <div className="mt-6 h-[1px] bg-white/[0.06]" />
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>SPLICE STUDIO</span>
                  <span>EST. 2024</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Expertise Sections (Ce que nous faisons) */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
              Ce que nous faisons
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <span className="text-3xl font-light text-df-gold/30">01</span>
              <h3 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Production Vidéo &amp; Motion Design
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Films corporate, interviews, vidéos de marque et animations en motion design. Nous gérons tout : scénarisation, tournage cinéma 4K et post-production complète (étalonnage, sound design).
              </p>
              <ul className="mt-6 space-y-2 text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Films institutionnels &amp; marque employeur
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Animations 2D/3D et logo reveals
                </li>
              </ul>
              <Link href="/services/montage-video" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Découvrir l&apos;offre vidéo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <span className="text-3xl font-light text-df-gold/30">02</span>
              <h3 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Photographie Professionnelle
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Portraits d&apos;équipe corporate, reportages métier sur site, photographies d&apos;établissements, packshots produits et couverture d&apos;événements. Des clichés retouchés d&apos;une netteté absolue.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Portraits corporate LinkedIn
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Shootings immobiliers, culinaires et produits
                </li>
              </ul>
              <Link href="/services/photographie-professionnelle" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Découvrir l&apos;offre photo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <span className="text-3xl font-light text-df-gold/30">03</span>
              <h3 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Social Media &amp; Publicités
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Création de publicités vidéo verticales (Reels, TikTok, Shorts) à fort taux de complétion, hooks d&apos;accroche, sous-titres animés et packs mensuels pour booster votre visibilité en continu.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Formats courts 9:16 natifs mobiles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Direction artistique orientée conversion
                </li>
              </ul>
              <Link href="/services/pub-reseaux-sociaux" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Découvrir l&apos;offre social media <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <span className="text-3xl font-light text-df-gold/30">04</span>
              <h3 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Événementiel, Mairies &amp; Collectivités
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Couverture de séminaires, salons, rassemblements locaux, cérémonies officielles et événements culturels ou associatifs organisés par les mairies et collectivités territoriales du Centre-Val de Loire.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Reportages photo &amp; aftermovies vidéo pour collectivités
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-df-gold" /> Communication institutionnelle &amp; mise en valeur de la vie locale
                </li>
              </ul>
              <Link href="/photographe-evenementiel" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Découvrir l&apos;offre événementielle <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section Qui sommes-nous (Qui nous sommes) */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Qui sommes-nous
              </span>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-tight text-white md:text-4xl">
                La force d&apos;un studio,<br />la souplesse de freelances
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                Splice réunit Louisia (directrice artistique &amp; photographe) et Tracy (réalisateur, monteur &amp; motion designer). Nous intervenons directement sans intermédiaire. Vous bénéficiez d&apos;une communication fluide, de délais réactifs et d&apos;une cohérence visuelle parfaite sur tous vos canaux.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-xl border border-white/[0.06] bg-df-surface p-4 text-center min-w-[140px]">
                  <span className="block text-lg font-bold text-white">Louisia</span>
                  <span className="text-xs text-df-gold">Photo &amp; DA</span>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-df-surface p-4 text-center min-w-[140px]">
                  <span className="block text-lg font-bold text-white">Tracy</span>
                  <span className="text-xs text-df-gold">Vidéo &amp; Motion</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.06] bg-df-surface p-8">
                <span className="text-xs font-mono uppercase tracking-wider text-df-gold">Zone de service &amp; intervention</span>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Nous sommes basés en Centre-Val de Loire et nous déplaçons physiquement à <strong>Orléans</strong>, <strong>Tours</strong> et dans tout le <strong>Loiret (45)</strong> pour les tournages et prises de vues. Les étapes de conception stratégique, montage vidéo et post-production s&apos;effectuent à distance avec des outils collaboratifs en ligne pour une rapidité maximale.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 text-white/60">Orléans Centre</span>
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 text-white/60">La Source / Olivet</span>
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 text-white/60">Saran / Ingré</span>
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 text-white/60">Tours &amp; Indre-et-Loire</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-4xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3 justify-center">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
              Questions fréquentes
            </span>
            <span className="h-[1px] w-8 bg-df-gold" />
          </div>

          <div className="space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-df-surface ring-1 ring-white/[0.08]"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-white transition hover:bg-white/[0.04]">
                  <span className="font-sans text-base font-medium text-white m-0 leading-normal">{item.question}</span>
                  <span className="ml-4 shrink-0 text-df-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-white/70 border-t border-white/[0.04] pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="mx-auto max-w-7xl px-6 mt-24">
          <ServiceCTA variant="block" serviceName="communication" />
        </div>
      </div>

      <Footer />
      <StickyMobileCta source="sticky_agence" />
    </>
  );
}
