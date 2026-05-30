import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { buildLandingJsonLd } from "@/lib/services/schema-service";
import { absoluteUrl } from "@/lib/seo";
import type { FAQItem } from "@/lib/services/types";

export const revalidate = 86400;

const PATH = "/agence-communication-orleans";
const TITLE = "Agence de communication à Orléans | Splice Studio";
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
      "Tout dépend du périmètre. Splice propose une formule Bienvenue gratuite pour découvrir notre univers, des packs à la carte (photos dès 15 €, vidéos dès 29 €) et des abonnements mensuels à partir de 45 €/mois en offre de lancement. Les accompagnements plus complets sont chiffrés sur devis : configurez votre besoin sur notre simulateur de devis en ligne ou consultez la page Tarifs.",
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
      <JsonLd data={jsonLd} />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumb */}
        <Breadcrumbs
          jsonLd={false}
          className="mb-8 text-sm text-white/50"
          items={[
            { name: "Accueil", href: "/" },
            { name: "Agence de communication Orléans", href: PATH },
          ]}
        />

        <article>
          {/* Hero */}
          <header className="mb-12">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {H1}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
              Splice est un studio créatif et une agence de communication à Orléans. Nous
              accompagnons les entreprises, commerces et institutions du Loiret pour donner
              une image forte et cohérente à leur marque — de la stratégie visuelle à la
              vidéo, du social media à l&apos;événementiel.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Communication visuelle</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Une marque se reconnaît d&apos;abord à ses images. Nous produisons des visuels
              sur mesure — photographie, motion design, habillage graphique — qui traduisent
              votre positionnement plutôt que de recourir à des banques d&apos;images
              génériques. Cette identité visuelle se décline ensuite sur l&apos;ensemble de
              vos supports, du site web aux documents commerciaux. Découvrez notre approche
              de la{" "}
              <Link href="/services/photographie-professionnelle" className="text-df-gold hover:underline">
                photographie professionnelle
              </Link>{" "}
              et du{" "}
              <Link href="/services/motion-design" className="text-df-gold hover:underline">
                motion design
              </Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Communication événementielle</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Séminaires, soirées d&apos;entreprise, salons, lancements : un événement mérite
              d&apos;être documenté pour vivre au-delà du jour J. Nous assurons la couverture
              photo et vidéo, jusqu&apos;à l&apos;aftermovie, pour alimenter votre
              communication interne et externe. Pour ces prestations, voyez notre offre dédiée
              de{" "}
              <Link href="/photographe-evenementiel" className="text-df-gold hover:underline">
                photographe événementiel
              </Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Social media &amp; contenu</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              En tant qu&apos;agence social media, nous concevons des contenus pensés pour les
              réseaux : formats verticaux, vidéos courtes orientées conversion, séries de
              visuels cohérents. L&apos;objectif n&apos;est pas de publier pour publier, mais
              d&apos;entretenir une présence régulière qui transforme l&apos;audience en
              clients. Explorez notre service de{" "}
              <Link href="/services/pub-reseaux-sociaux" className="text-df-gold hover:underline">
                publicité réseaux sociaux
              </Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Communication pour restaurants &amp; commerces</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Les commerces de proximité et les restaurants d&apos;Orléans ont des besoins
              spécifiques : montrer un lieu, donner envie d&apos;un plat, animer une page
              locale. Nous proposons des formules adaptées à un budget de commerce indépendant,
              avec des contenus photo et vidéo qui se diffusent immédiatement sur vos canaux.
              {" "}Nos clients vont des PME locales et des restaurants aux commerces de
              proximité d&apos;Orléans, et nous travaillons aussi avec les mairies pour la
              couverture d&apos;événements de la ville.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Notre approche</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Splice combine la rigueur d&apos;une agence et la souplesse d&apos;un studio.
              Chaque projet commence par la compréhension de votre objectif réel — recruter,
              vendre, fidéliser — avant de choisir les bons formats. Notre équipe réunit la
              photographie (Louisia) et la vidéo &amp; le motion design (Tracy / TY), ce qui
              nous permet de tenir une cohérence créative d&apos;un support à l&apos;autre.
              Vous gardez un interlocuteur unique du brief à la livraison.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              Zone d&apos;intervention (Orléans, Tours, Centre-Val de Loire)
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Basés en Centre-Val de Loire, nous intervenons à Orléans, à Tours et dans tout le
              Loiret pour les tournages, shootings et couvertures d&apos;événements. Les volets
              stratégie, montage et production graphique se gèrent à distance, sans contrainte
              de déplacement. Retrouvez l&apos;ensemble de nos prestations sur la page{" "}
              <Link href="/services" className="text-df-gold hover:underline">Services</Link>.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Questions fréquentes</h2>
            <dl className="mt-6 grid gap-4">
              {FAQ.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
                >
                  <dt className="font-semibold text-white">{item.question}</dt>
                  <dd className="mt-2 leading-relaxed text-white/70">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Internal links */}
          <section className="mb-12 border-t border-white/[0.08] pt-8">
            <p className="text-sm text-white/40">Nos expertises liées :</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/photographe-evenementiel" className="inline-flex items-center gap-1.5 text-sm text-df-gold hover:underline">
                Photographe événementiel <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/services/pub-reseaux-sociaux" className="inline-flex items-center gap-1.5 text-sm text-df-gold hover:underline">
                Publicité réseaux sociaux <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-df-gold hover:underline">
                Tous nos services <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* CTA */}
          <ServiceCTA variant="block" serviceName="communication" />
        </article>
      </main>
    </>
  );
}
