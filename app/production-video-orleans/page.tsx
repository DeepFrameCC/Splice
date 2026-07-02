import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Video, Film, Eye, Award } from "lucide-react";
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

const PATH = "/production-video-orleans";
const TITLE = "Production vidéo à Orléans — Vidéaste & Studio";
const DESCRIPTION =
  "Boîte de production vidéo à Orléans : films corporate, vidéos réseaux sociaux (Reels/TikTok), shootings de marque et motion design. Splice Studio vous accompagne du brief à la diffusion. Devis gratuit.";
const H1 = "Production vidéo à Orléans";

const FAQ: FAQItem[] = [
  {
    question: "Quel type de vidéo réalise votre boîte de production à Orléans ?",
    answer:
      "Splice Studio réalise une large gamme de vidéos professionnelles à Orléans : films d'entreprise (corporate/institutionnel), vidéos courtes et publicitaires pour les réseaux sociaux (Reels, TikTok, Shorts), shootings photo et vidéo automobile, Aftermovies d'événements (salons, festivals, soirées d'entreprise) et podcasts vidéo multi-caméras.",
  },
  {
    question: "Quel matériel de tournage utilisez-vous pour les vidéos à Orléans ?",
    answer:
      "Nous filmons avec un setup léger et efficace : Sony ZV-1 et iPhone 14 en 4K, micro sans fil DJI pour le son, puis montage et étalonnage sur DaVinci Resolve Studio.",
  },
  {
    question: "Quel est le délai de livraison pour un film d'entreprise à Orléans ?",
    answer:
      "Le délai moyen est de 7 à 14 jours ouvrés après le tournage. Cela comprend le montage, l'étalonnage colorimétrique professionnel, le sound design et l'intégration des titres ou sous-titres animés. Deux allers-retours de modifications sont inclus pour chaque projet.",
  },
  {
    question: "Proposez-vous des abonnements vidéo récurrents ?",
    answer:
      "Oui. Pour les entreprises d'Orléans qui souhaitent alimenter leurs réseaux sociaux de manière régulière (LinkedIn, Instagram, TikTok), nous proposons des abonnements mensuels de montage vidéo à partir de 45 €/mois, incluant le recyclage multi-réseau (repurposing).",
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
      type: "website",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

export default function ProductionVideoOrleansPage() {
  const jsonLd = buildLandingJsonLd({
    path: PATH,
    name: "Production vidéo à Orléans",
    pageTitle: TITLE,
    description: DESCRIPTION,
    breadcrumbName: "Production vidéo Orléans",
    serviceType: "MovieStudio",
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
              { name: "Production vidéo Orléans", href: PATH },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Title / Description */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Boîte de production · Orléans
              </span>
              <h1 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-6xl">
                {H1}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Splice Studio est votre studio partenaire de production vidéo à Orléans. Nous accompagnons les entreprises, PMEs et marques du Loiret pour façonner des contenus vidéo cinématiques à fort impact : du film corporate de marque aux formats verticaux percutants pour vos réseaux sociaux.
              </p>
            </div>
            
            {/* Manifeste / Side Frame */}
            <div className="relative lg:col-span-5">
              <div className="df-cine-corners p-8 bg-df-surface border border-white/[0.06] rounded-2xl">
                <i /><i /><i /><i />
                <span className="text-[10px] font-mono tracking-widest text-df-gold uppercase">Engagements</span>
                <p className="mt-4 font-serif text-lg italic text-white/90">
                  &ldquo;Nous créons des vidéos qui captent l&apos;attention en 3 secondes et transmettent votre message avec sincérité, sans utiliser de banques d&apos;images génériques.&rdquo;
                </p>
                <div className="mt-6 h-[1px] bg-white/[0.06]" />
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>SPLICE STUDIO</span>
                  <span>ORLÉANS (45)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formats de vidéo maîtrisés */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
              Formats &amp; Services Vidéo
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Video className="h-8 w-8" /></div>
              <h3 className="font-display mt-4 text-xl font-bold uppercase text-white group-hover:text-df-gold transition-colors">
                Film Corporate &amp; Entreprise
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Valorisez votre savoir-faire industriel, présentez vos locaux sur Orléans et vos équipes avec un film de marque esthétique et soigné. Idéal pour votre site internet et vos présentations clients B2B.
              </p>
              <Link href="/services/production-corporate" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                En savoir plus <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Film className="h-8 w-8" /></div>
              <h3 className="font-display mt-4 text-xl font-bold uppercase text-white group-hover:text-df-gold transition-colors">
                Publicités Réseaux Sociaux
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Nous produisons des vidéos au format vertical (Reels, TikTok, Shorts) spécifiquement optimisées pour retenir l&apos;attention sur mobile. Idéal pour booster votre engagement et attirer des prospects locaux.
              </p>
              <Link href="/services/pub-reseaux-sociaux" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                En savoir plus <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Eye className="h-8 w-8" /></div>
              <h3 className="font-display mt-4 text-xl font-bold uppercase text-white group-hover:text-df-gold transition-colors">
                Shooting Automobile &amp; Événements
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Couverture vidéo d&apos;événements d&apos;entreprise (aftermovies) et shootings photo/vidéo automobile haut de gamme pour les professionnels de l&apos;automobile et les collectionneurs dans le Loiret.
              </p>
              <Link href="/services/shooting-automobile" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                En savoir plus <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pourquoi faire appel à notre vidéaste à Orléans ? */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Pourquoi Splice Studio
              </span>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-tight text-white md:text-4xl">
                La réactivité d&apos;un vidéaste local
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                Basés en Centre-Val de Loire, nous nous déplaçons directement dans vos locaux à <strong>Orléans, Saran, Olivet, Fleury-les-Aubrais</strong> et partout dans le Loiret pour filmer vos équipes et vos réalisations. Pas d&apos;intermédiaires : vous échangez en direct avec Louisia et Tracy pour une cohérence parfaite et des délais respectés. Parcourez nos <Link href="/galerie" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">réalisations vidéo</Link> et nos <Link href="/tarifs" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">tarifs</Link>.
              </p>
            </div>
            
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.06] bg-df-surface p-8">
                <span className="text-xs font-mono uppercase tracking-wider text-df-gold">Chiffres clés &amp; Matériel</span>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-df-gold" /> Captation 4K : Sony ZV-1 &amp; iPhone 14
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-df-gold" /> Son sans fil DJI &amp; montage DaVinci Resolve Studio
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-df-gold" /> Garantie de réponse &amp; proposition sous 48h maximum
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-df-gold" /> 2 allers-retours de modifications inclus sur le montage
                  </li>
                </ul>
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
          <ServiceCTA variant="block" serviceName="production vidéo Orléans" />
        </div>
      </div>

      <Footer />
      <StickyMobileCta source="sticky_prod_orleans" />
    </>
  );
}
