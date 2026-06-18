import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Camera, Aperture, Building2 } from "lucide-react";
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

const PATH = "/photographe-orleans";
const TITLE = "Photographe à Orléans — Corporate, Portrait & Produit";
const DESCRIPTION =
  "Photographe professionnel à Orléans : portraits corporate, shooting produit, photo immobilier et Google Business Profile. Splice Studio se déplace dans le Loiret. Devis gratuit.";
const H1 = "Photographe à Orléans";

const FAQ: FAQItem[] = [
  {
    question: "Combien coûte un photographe professionnel à Orléans ?",
    answer:
      "Nos packs photo démarrent à 15 € pour 5 photos retouchées. Une séance complète (portraits corporate, packshots produits, reportage métier) est chiffrée selon la durée et le nombre de livrables, à partir de 190 € pour un reportage Google Business Profile et 350 € pour une séance professionnelle. Le devis en ligne est gratuit.",
  },
  {
    question: "Quels types de photos réalisez-vous à Orléans ?",
    answer:
      "Splice Studio réalise des portraits corporate pour LinkedIn et la marque employeur, des packshots produits, du reportage métier en entreprise, de la photo immobilier, du shooting automobile et des reportages d'établissement optimisés pour Google Business Profile.",
  },
  {
    question: "Faites-vous des shootings photo en extérieur à Orléans ?",
    answer:
      "Oui. Nous photographions en studio mobile comme en lumière naturelle, directement dans vos locaux ou en extérieur à Orléans (centre-ville, La Source, Saran, Olivet) et partout dans le Loiret. La direction artistique est adaptée à votre univers de marque.",
  },
  {
    question: "Sous quel délai livrez-vous les photos ?",
    answer:
      "Les clichés sélectionnés et retouchés sont livrés sous 7 à 14 jours via une galerie en ligne privée et sécurisée, en haute définition pour le print comme pour le web.",
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

export default function PhotographeOrleansPage() {
  const jsonLd = buildLandingJsonLd({
    path: PATH,
    name: "Photographe à Orléans",
    pageTitle: TITLE,
    description: DESCRIPTION,
    breadcrumbName: "Photographe Orléans",
    serviceType: "Photography",
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
              { name: "Photographe Orléans", href: PATH },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Photographe · Orléans (45)
              </span>
              <h1 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-6xl">
                {H1}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Vous cherchez un photographe professionnel à Orléans pour valoriser votre entreprise ? Splice Studio réalise des portraits corporate, des packshots produits, des reportages métier et des photos d&apos;établissement, directement dans vos locaux du Loiret. Des visuels réels qui inspirent confiance, loin des banques d&apos;images génériques.
              </p>
            </div>

            <div className="relative lg:col-span-5">
              <div className="df-cine-corners p-8 bg-df-surface border border-white/[0.06] rounded-2xl">
                <i /><i /><i /><i />
                <span className="text-[10px] font-mono tracking-widest text-df-gold uppercase">Approche</span>
                <p className="mt-4 font-serif text-lg italic text-white/90">
                  &ldquo;Montrer vos équipes, vos gestes et vos produits réels rassure bien plus qu&apos;une photo de stock.&rdquo;
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

        {/* Prestations */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
              Prestations photo
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Camera className="h-8 w-8" /></div>
              <h2 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Portrait &amp; corporate
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Portraits professionnels pour LinkedIn, photos d&apos;équipe et reportages métier qui crédibilisent votre image de marque B2B.
              </p>
              <Link href="/services/photographie-professionnelle/orleans" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Photographie professionnelle <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Aperture className="h-8 w-8" /></div>
              <h2 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Produit &amp; packshot
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Photos produits et packshots e-commerce détourés ou en situation, retouchés et livrés en haute définition pour le web et le print.
              </p>
              <Link href="/galerie" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Voir le portfolio <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Building2 className="h-8 w-8" /></div>
              <h2 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Google Business &amp; immobilier
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Reportages d&apos;établissement optimisés pour votre fiche Google Business Profile et photos immobilier qui valorisent vos espaces.
              </p>
              <Link href="/services/photographie-google-business/orleans" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Photo Google Business <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pourquoi */}
        <section className="mx-auto max-w-7xl px-6 mt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Pourquoi Splice Studio
              </span>
              <h2 className="mt-4 font-display text-3xl uppercase tracking-tight text-white md:text-4xl">
                Un photographe qui se déplace
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                Nous intervenons dans vos locaux à <strong>Orléans, Saran, Olivet, Fleury-les-Aubrais</strong> et partout dans le Loiret, en studio mobile ou en lumière naturelle. Pour la couverture de vos événements, voyez aussi notre page <Link href="/photographe-evenementiel" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">photographe événementiel</Link>.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.06] bg-df-surface p-8">
                <span className="text-xs font-mono uppercase tracking-wider text-df-gold">Ce qui est inclus</span>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> Boîtier hybride 4K, studio mobile &amp; lumière naturelle</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> Retouche avancée, livraison HD print &amp; web</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> Galerie privée en ligne pour sélectionner vos photos</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> Livraison sous 7 à 14 jours</li>
                </ul>
                <p className="mt-6 text-sm text-white/60">
                  Découvrez nos <Link href="/tarifs" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">tarifs photo</Link> et notre <Link href="/galerie" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">galerie</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 mt-24">
          <div className="mb-12 flex items-center gap-3 justify-center">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">Questions fréquentes</span>
            <span className="h-[1px] w-8 bg-df-gold" />
          </div>

          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.question} className="group rounded-2xl bg-df-surface ring-1 ring-white/[0.08]">
                <summary className="flex cursor-pointer items-center justify-between p-5 text-white transition hover:bg-white/[0.04]">
                  <span className="font-sans text-base font-medium text-white m-0 leading-normal">{item.question}</span>
                  <span className="ml-4 shrink-0 text-df-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed text-white/70 border-t border-white/[0.04] pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mx-auto max-w-7xl px-6 mt-24">
          <ServiceCTA variant="block" serviceName="photographe Orléans" />
        </div>
      </div>

      <Footer />
      <StickyMobileCta source="sticky_photographe_orleans" />
    </>
  );
}
