import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { buildLandingJsonLd } from "@/lib/services/schema-service";
import { absoluteUrl } from "@/lib/seo";
import type { FAQItem } from "@/lib/services/types";

export const revalidate = 86400;

const PATH = "/photographe-evenementiel";
const TITLE = "Photographe événementiel Orléans & Tours | Splice Studio";
const DESCRIPTION =
  "Photographe événementiel à Orléans et Tours : séminaires, soirées d'entreprise, salons. Reportage photo + aftermovie. Splice Studio, livraison rapide.";
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
      "Oui, la majorité des événements d'entreprise se déroulent en soirée ou le week-end. Nous adaptons notre matériel d'éclairage aux conditions de faible lumière pour garantir un rendu professionnel quelle que soit l'heure.",
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
      <JsonLd data={jsonLd} />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-white/50">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-white transition">Accueil</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-white/80">Photographe événementiel</li>
          </ol>
        </nav>

        <article>
          {/* Hero */}
          <header className="mb-12">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {H1}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
              Splice couvre vos événements professionnels à Orléans et à Tours en photo et en
              vidéo. Séminaires, soirées d&apos;entreprise, salons ou inaugurations : nous
              capturons les temps forts et vous livrons un reportage prêt à diffuser, complété
              d&apos;un aftermovie qui prolonge l&apos;impact de votre événement.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Événements d&apos;entreprise &amp; séminaires</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Conventions, séminaires, conférences et journées d&apos;équipe : nous
              documentons l&apos;ambiance, les intervenants et les moments d&apos;échange.
              Le reportage valorise votre marque employeur et fournit une banque d&apos;images
              authentiques pour vos communications de l&apos;année. Pour aller plus loin, voyez
              notre offre de{" "}
              <Link href="/services/production-corporate" className="text-df-gold hover:underline">
                production corporate
              </Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Soirées, lancements &amp; inaugurations</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Les moments festifs ou stratégiques — soirée de gala, lancement de produit,
              inauguration de locaux — méritent une captation soignée, y compris en conditions
              de faible lumière. Nous travaillons avec un éclairage discret pour préserver
              l&apos;atmosphère tout en garantissant des images nettes et lumineuses.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Reportage photo + aftermovie vidéo</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Notre approche combine photo et vidéo sur un même événement. Vous recevez une
              sélection de photos retouchées en haute définition et un aftermovie monté,
              rythmé, sous-titré si besoin — idéal pour les réseaux sociaux. Une seule
              captation alimente ainsi l&apos;ensemble de vos canaux.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Notre matériel &amp; équipe</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              L&apos;équipe Splice réunit la photographie (Louisia) et la vidéo &amp; le motion
              design (Tracy / TY), avec un matériel professionnel adapté à l&apos;événementiel :
              boîtiers performants en basse lumière, optiques lumineuses et stabilisation
              vidéo. {"{{À COMPLÉTER : détail du matériel événementiel et de l'équipe sur site}}"}
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white md:text-2xl">Zone d&apos;intervention</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Nous intervenons à Orléans, à Tours et dans tout le Centre-Val de Loire pour la
              couverture de vos événements. Le montage et la retouche se gèrent ensuite à
              distance, pour une livraison rapide après l&apos;événement.
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
              <Link href="/services/production-corporate" className="inline-flex items-center gap-1.5 text-sm text-df-gold hover:underline">
                Production corporate <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/agence-communication-orleans" className="inline-flex items-center gap-1.5 text-sm text-df-gold hover:underline">
                Agence de communication Orléans <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-df-gold hover:underline">
                Tous nos services <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* CTA */}
          <ServiceCTA variant="block" serviceName="couverture événementielle" />
        </article>
      </main>
    </>
  );
}
