import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Video, Film, Sparkles } from "lucide-react";
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

const PATH = "/videaste-orleans";
const TITLE = "Vidéaste à Orléans — Films, Reels & Motion Design";
const DESCRIPTION =
  "Vidéaste à Orléans pour vos films d'entreprise, vidéos réseaux sociaux (Reels, TikTok) et motion design. Splice Studio se déplace dans tout le Loiret. Devis gratuit en ligne.";
const H1 = "Vidéaste à Orléans";

const FAQ: FAQItem[] = [
  {
    question: "Combien coûte un vidéaste à Orléans ?",
    answer:
      "Le tarif dépend du format et de la durée du tournage. Une vidéo réseaux sociaux à l'unité démarre à 29 €, un abonnement mensuel de montage à 45 €/mois, et un film d'entreprise complet à partir de 1 490 €. Le devis en ligne est gratuit et détaillé, avec une réponse sous 24h ouvrées.",
  },
  {
    question: "Quels types de vidéos réalise votre vidéaste à Orléans ?",
    answer:
      "Splice Studio couvre les films d'entreprise et institutionnels, les vidéos courtes pour les réseaux sociaux (Reels, TikTok, Shorts), le motion design (animations 2D/3D), les interviews et témoignages, ainsi que les aftermovies d'événements et les shootings automobile.",
  },
  {
    question: "Votre vidéaste se déplace-t-il en dehors d'Orléans ?",
    answer:
      "Oui. Nous nous déplaçons dans tout le Loiret (Saran, Olivet, Fleury-les-Aubrais, La Source) et en Centre-Val de Loire, jusqu'à Tours. Les frais de déplacement sont calculés à 0,50 €/km aller-retour au-delà de 30 km.",
  },
  {
    question: "Vidéaste freelance ou agence vidéo : que choisir à Orléans ?",
    answer:
      "Splice Studio combine les deux : vous échangez en direct avec Louisia et Tracy, sans intermédiaire, tout en bénéficiant d'une chaîne de production complète (tournage 4K, montage, étalonnage, motion design). Vous gardez la réactivité d'un vidéaste local et la rigueur d'un studio.",
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

export default function VideasteOrleansPage() {
  const jsonLd = buildLandingJsonLd({
    path: PATH,
    name: "Vidéaste à Orléans",
    pageTitle: TITLE,
    description: DESCRIPTION,
    breadcrumbName: "Vidéaste Orléans",
    serviceType: "VideoProductionService",
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
              { name: "Vidéaste Orléans", href: PATH },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                Vidéaste · Orléans (45)
              </span>
              <h1 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-6xl">
                {H1}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Vous cherchez un vidéaste à Orléans capable de tourner, monter et habiller vos vidéos de bout en bout ? Splice Studio filme vos équipes, vos produits et vos événements dans le Loiret, puis assure le montage, l&apos;étalonnage et le motion design. Un seul interlocuteur, du brief à la diffusion.
              </p>
            </div>

            <div className="relative lg:col-span-5">
              <div className="df-cine-corners p-8 bg-df-surface border border-white/[0.06] rounded-2xl">
                <i /><i /><i /><i />
                <span className="text-[10px] font-mono tracking-widest text-df-gold uppercase">Approche</span>
                <p className="mt-4 font-serif text-lg italic text-white/90">
                  &ldquo;Un vidéaste qui pense à votre canal de diffusion avant d&apos;appuyer sur REC : chaque plan sert le message final.&rdquo;
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
              Ce que filme votre vidéaste
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Video className="h-8 w-8" /></div>
              <h2 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Vidéos réseaux sociaux
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Formats verticaux (Reels, TikTok, Shorts) pensés pour le mobile, avec accroche dès la première seconde et sous-titres animés.
              </p>
              <Link href="/services/pub-reseaux-sociaux/orleans" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Pub réseaux sociaux à Orléans <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Film className="h-8 w-8" /></div>
              <h2 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Films d&apos;entreprise
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Films corporate et institutionnels tournés en 4K, montés pour convaincre vos clients B2B et valoriser votre savoir-faire.
              </p>
              <Link href="/services/montage-video/orleans" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Montage vidéo à Orléans <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-df-surface p-8 shadow-sm transition hover:border-df-gold/20">
              <div className="text-df-gold"><Sparkles className="h-8 w-8" /></div>
              <h2 className="font-display mt-4 text-xl font-medium uppercase text-white group-hover:text-df-gold transition-colors">
                Motion design
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Animations 2D et 3D calées sur votre charte pour expliquer un message ou habiller vos vidéos filmées.
              </p>
              <Link href="/services/motion-design/orleans" className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-df-gold hover:underline">
                Motion design à Orléans <ArrowRight className="h-3.5 w-3.5" />
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
                Un vidéaste local, réactif
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                Basés en Centre-Val de Loire, nous nous déplaçons dans vos locaux à <strong>Orléans, Saran, Olivet, Fleury-les-Aubrais</strong> et partout dans le Loiret. Vous travaillez en direct avec Louisia et Tracy, pour des délais tenus et une cohérence parfaite entre le tournage et le montage. Pour un studio complet, voyez aussi notre page <Link href="/production-video-orleans" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">production vidéo à Orléans</Link>.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/[0.06] bg-df-surface p-8">
                <span className="text-xs font-mono uppercase tracking-wider text-df-gold">Méthode &amp; matériel</span>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> Captation 4K : Sony ZV-1 &amp; iPhone 14, son sans fil DJI</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> Montage &amp; étalonnage sur DaVinci Resolve Studio</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> Réponse et proposition sous 48h maximum</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-df-gold" /> 2 allers-retours de modifications inclus</li>
                </ul>
                <p className="mt-6 text-sm text-white/60">
                  Voir nos <Link href="/galerie" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">réalisations vidéo</Link> et nos <Link href="/tarifs" className="font-semibold text-df-gold underline underline-offset-2 hover:text-df-blue">tarifs</Link>.
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
          <ServiceCTA variant="block" serviceName="vidéaste Orléans" />
        </div>
      </div>

      <Footer />
      <StickyMobileCta source="sticky_videaste_orleans" />
    </>
  );
}
