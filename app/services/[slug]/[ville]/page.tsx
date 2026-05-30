import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

import {
  VILLES,
  SERVICES_LOCAL_SLUGS,
  LOCAL_SERVICE_DATA,
  fillTemplate,
  getLocalPageContent,
  type LocalServiceSlug,
  type Ville,
} from "@/lib/services/local-seo";
import { buildLocalServiceJsonLd } from "@/lib/services/schema-service";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { absoluteUrl } from "@/lib/seo";

export const dynamicParams = false;
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string; ville: string }>;
}

// Generate 6 x 4 = 24 static pages
export function generateStaticParams() {
  const params: { slug: string; ville: string }[] = [];
  for (const slug of SERVICES_LOCAL_SLUGS) {
    for (const v of VILLES) {
      params.push({ slug, ville: v.slug });
    }
  }
  return params;
}

function findVille(villeSlug: string): Ville | undefined {
  return VILLES.find((v) => v.slug === villeSlug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, ville: villeSlug } = await params;
  const ville = findVille(villeSlug);
  const data = LOCAL_SERVICE_DATA[slug as LocalServiceSlug];
  if (!ville || !data) return {};

  const title = fillTemplate(data.h1Template, ville) + " | Splice";
  const description = fillTemplate(data.introTemplate, ville);
  const url = absoluteUrl(`/services/${slug}/${villeSlug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Splice",
      locale: "fr_FR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocalServicePage({ params }: PageProps) {
  const { slug, ville: villeSlug } = await params;
  const ville = findVille(villeSlug);
  const data = LOCAL_SERVICE_DATA[slug as LocalServiceSlug];
  if (!ville || !data) notFound();

  const h1 = fillTemplate(data.h1Template, ville);
  const intro = fillTemplate(data.introTemplate, ville);
  const localContent = getLocalPageContent(slug as LocalServiceSlug, villeSlug);

  const jsonLd = buildLocalServiceJsonLd({
    serviceName: data.serviceName,
    serviceSlug: slug,
    ville,
    description: intro,
    priceRange: data.priceRange,
    parentServiceSlug: slug,
    faq: localContent?.localFaq,
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
            <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/services/${slug}`} className="hover:text-white transition">{data.shortName}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-white/80">{ville.name}</li>
          </ol>
        </nav>

        <article>
          {/* Hero */}
          <header className="mb-12">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {h1}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/70">
              {intro}
            </p>
          </header>

          {/* Points cles */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              Pourquoi choisir Splice
            </h2>
            <ul className="mt-6 grid gap-3">
              {data.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <span className="mt-0.5 text-df-gold" aria-hidden="true">&#10003;</span>
                  <span className="text-white/80">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Delais et tarifs */}
          <section className="mb-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-df-gold/70">Delai</p>
              <p className="mt-2 text-lg font-semibold text-white">{data.deliveryTime}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-df-gold/70">Tarif</p>
              <p className="mt-2 text-lg font-semibold text-white">{data.priceRange}</p>
            </div>
          </section>

          {/* Contenu local unique */}
          {localContent && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                Splice à {ville.name}
              </h2>
              <p className="mt-4 whitespace-pre-line text-pretty leading-relaxed text-white/70">
                {localContent.localContext}
              </p>
            </section>
          )}

          {/* FAQ locale */}
          {localContent && localContent.localFaq.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                Questions fréquentes — {data.shortName} à {ville.name}
              </h2>
              <dl className="mt-6 grid gap-4">
                {localContent.localFaq.map((item) => (
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
          )}

          {/* Zone d'intervention */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              Zone d&apos;intervention
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Splice intervient à {ville.name}
              {ville.departmentCode ? ` (${ville.department}, ${ville.departmentCode})` : ` et dans toute la région ${ville.name}`}
              {" "}ainsi qu&apos;à Orléans, Tours, Blois, Chartres et Bourges.
            </p>
          </section>

          {/* CTA */}
          <ServiceCTA variant="block" serviceName={data.shortName} />

          {/* Link back to full service page */}
          <p className="mt-12 text-center text-sm text-white/50">
            Découvrez notre prestation complète sur la page{" "}
            <Link
              href={`/services/${slug}`}
              className="text-df-gold hover:underline"
            >
              {data.serviceName}
            </Link>
          </p>
        </article>
      </main>
    </>
  );
}
