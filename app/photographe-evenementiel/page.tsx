import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Camera, Zap } from "lucide-react";
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

const PATH = "/photographe-evenementiel";
const TITLE = "Photographe événementiel à Orléans & Tours";
const DESCRIPTION =
  "Photographe événementiel à Orléans et Tours : séminaires, soirées d'entreprise, salons. Reportage photo + aftermovie. Splice, livraison rapide.";
const H1 = "Photographe événementiel à Orléans & Tours";

const FAQ: FAQItem[] = [
  {
    question: "Combien de temps avant l'événement faut-il réserver ?",
    answer:
      "Idéalement deux à quatre semaines à l'avance pour garantir notre disponibilité et préparer le déroulé de la captation. Pour les demandes de dernière minute, contactez-nous : selon le planning, une intervention rapide reste souvent possible.",
  },
  {
    question: "Livrez-vous à la fois les photos et la vidéo ?",
    answer:
      "Oui. Nous couvrons l'événement en photo et en vidéo, et livrons un reportage photo retouché ainsi qu'un aftermovie monté. Cette double captation permet d'alimenter aussi bien vos supports print que vos réseaux sociaux à partir d'un seul événement.",
  },
  {
    question: "Intervenez-vous le soir et le week-end ?",
    answer:
      "Oui, nous intervenons en soirée et le week-end sous réserve de notre disponibilité et de celle de notre matériel d'éclairage. La majorité des événements se déroulant à ces moments, nous adaptons notre planning et nos projecteurs pour garantir un rendu professionnel optimal quelle que soit l'heure.",
  },
  {
    question: "Quel est le tarif d'une couverture événementielle ?",
    answer:
      "La couverture d'événement est chiffrée sur devis selon la durée, le format (photo, vidéo ou les deux) et le déplacement. À titre indicatif, nos packs à la carte démarrent à 15 € pour les photos et 29 € pour la vidéo, avec des frais de déplacement de 0,50 €/km. Le plus précis reste notre simulateur de devis en ligne.",
  },
  {
    question: "Comment trouver un photographe événementiel autour de moi à Orléans ou Tours ?",
    answer:
      "Splice se déplace sur votre lieu d'événement à Orléans, à Tours et dans tout le Centre-Val de Loire. Vous pouvez nous retrouver via notre fiche établissement et notre page de contact, ou demander un devis en ligne pour vérifier notre disponibilité à la date souhaitée.",
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

export default function PhotographeEvenementielPage() {
  const jsonLd = buildLandingJsonLd({
    path: PATH,
    name: "Photographe événementiel à Orléans & Tours",
    pageTitle: TITLE,
    description: DESCRIPTION,
    breadcrumbName: "Photographe événementiel",
    serviceType: "PhotographyService",
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
              { name: "Photographe événementiel", href: PATH },
            ]}
          />
        </div>

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Title / Description */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Reportage &amp; Live · Orléans &amp; Tours
              </span>
              <h1 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-6xl">
                Saisir l&apos;instant.<br />Documenter l&apos;impact.
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Splice couvre vos événements professionnels à Orléans, à Tours et dans tout le Centre-Val de Loire. Séminaires, soirées d&apos;entreprise, salons ou inaugurations : nous captons les temps forts avec élégance et vous livrons un reportage photo haute définition sous 7 à 14 jours, complété d&apos;un aftermovie vidéo dynamique.
              </p>
            </div>
            
            {/* Manifeste / Side Frame */}
            <div className="relative lg:col-span-5">
              <div className="df-cine-corners p-8 bg-df-surface border border-white/[0.06] rounded-2xl">
                <i /><i /><i /><i />
                <span className="text-[10px] font-mono tracking-widest text-[#16a34a] uppercase">Double Captation</span>
                <p className="mt-4 font-serif text-lg italic text-white/90">
                  &ldquo;Parce qu&apos;un événement vit en image et en mouvement, notre duo réalise simultanément la couverture photo haute définition et la réalisation de votre aftermovie vidéo.&rdquo;
                </p>
                <div className="mt-6 h-[1px] bg-white/[0.06]" />
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>REPORTAGE &amp; LIVE</span>
                  <span>EST. 2024</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi nous (3 colonnes) */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[#16a34a]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a]">
              Pourquoi choisir Splice
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="group relative rounded-2xl border border-white/[0.06] bg-df-surface p-6 shadow-sm transition hover:border-[#16a34a]/20">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#16a34a]/10 text-[#16a34a]">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-lg font-medium uppercase text-white group-hover:text-[#16a34a] transition-colors">
                Duo Photo &amp; Vidéo
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Pas besoin de mobiliser deux prestataires différents. Louisia pilote la photographie haute définition pendant que TY réalise les captations vidéo et le montage de l&apos;aftermovie.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group relative rounded-2xl border border-white/[0.06] bg-df-surface p-6 shadow-sm transition hover:border-[#16a34a]/20">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#16a34a]/10 text-[#16a34a]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-lg font-medium uppercase text-white group-hover:text-[#16a34a] transition-colors">
                Discrétion &amp; Basse Lumière
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Nous travaillons avec des boîtiers hybrides professionnels ultra-sensibles en basse lumière. Nous capturons l&apos;ambiance naturelle sans flash intrusif pour respecter vos invités.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group relative rounded-2xl border border-white/[0.06] bg-df-surface p-6 shadow-sm transition hover:border-[#16a34a]/20">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#16a34a]/10 text-[#16a34a]">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-lg font-medium uppercase text-white group-hover:text-[#16a34a] transition-colors">
                Livraison en 7 à 14 jours
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Vos photos retouchées en haute définition et votre aftermovie vidéo sont livrés rapidement via une galerie privée en ligne sécurisée, prêts à alimenter vos réseaux sociaux.
              </p>
            </div>
          </div>
        </section>

        {/* Nos Formats Événementiels (Ce que nous couvrons) */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[#16a34a]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a]">
              Nos prestations
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Format 1 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-[#16a34a]/20">
              <h3 className="font-display text-xl font-medium uppercase text-white group-hover:text-[#16a34a] transition-colors">
                Séminaires &amp; Conventions
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Captation des interventions scéniques, de l&apos;ambiance générale, des ateliers de travail et des moments d&apos;échanges. Valorisez vos initiatives internes et votre marque employeur en externe.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16a34a]" /> Photos d&apos;intervenants et réactions sur le vif
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16a34a]" /> Fichiers haute définition pour le print et le web
                </li>
              </ul>
              <Link href="/services/production-corporate" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline">
                Voir l&apos;offre corporate <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Format 2 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-[#16a34a]/20">
              <h3 className="font-display text-xl font-medium uppercase text-white group-hover:text-[#16a34a] transition-colors">
                Soirées, Lancements &amp; Galas
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Soirées de gala de fin d&apos;année, lancements de nouveaux produits et inaugurations de locaux. Nous capturons les émotions, l&apos;esthétique du lieu et la dynamique festive de l&apos;événement.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16a34a]" /> Photos d&apos;ambiance basse lumière de haute qualité
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16a34a]" /> Retouche esthétique avancée de chaque cliché
                </li>
              </ul>
              <Link href="/services/photographie-professionnelle" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline">
                Voir l&apos;offre photo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Format 3 */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-[#16a34a]/20">
              <h3 className="font-display text-xl font-medium uppercase text-white group-hover:text-[#16a34a] transition-colors">
                Mairies &amp; Vie Locale
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Cérémonies officielles, festivals locaux, manifestations culturelles et rassemblements associatifs ou sportifs organisés par les municipalités et collectivités territoriales.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16a34a]" /> Aftermovies dynamiques pour la communication publique
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16a34a]" /> Valorisation du patrimoine et du dynamisme local
                </li>
              </ul>
              <Link href="/services/photographie-professionnelle" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline">
                Voir l&apos;offre photo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-4xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3 justify-center">
            <span className="h-[1px] w-8 bg-[#16a34a]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#16a34a]">
              Questions fréquentes
            </span>
            <span className="h-[1px] w-8 bg-[#16a34a]" />
          </div>

          <div className="space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl bg-df-surface ring-1 ring-white/[0.08]"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-white transition hover:bg-white/[0.04]">
                  <span className="font-sans text-base font-medium text-white m-0 leading-normal">{item.question}</span>
                  <span className="ml-4 shrink-0 text-[#16a34a] transition-transform group-open:rotate-45">
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
          <ServiceCTA variant="block" serviceName="couverture événementielle" />
        </div>
      </div>

      <Footer />
      <StickyMobileCta source="sticky_evenementiel" />
    </>
  );
}
