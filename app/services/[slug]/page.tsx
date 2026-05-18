import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedArticles,
  getRelatedServices,
} from "@/lib/services/queries";
import { buildServiceJsonLd } from "@/lib/services/schema-service";
import type { ServiceFeature, FAQItem, ServiceDeliverable } from "@/lib/services/types";
import { ServiceBreadcrumb } from "@/components/services/ServiceBreadcrumb";
import { ServiceTOC } from "@/components/services/ServiceTOC";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceReassurance } from "@/components/services/ServiceReassurance";

export const dynamicParams = true;
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  const url = `https://deepframe.cc/services/${slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
      siteName: "DeepFrame",
      locale: "fr_FR",
      type: "article",
      images: [
        {
          url: service.coverImageUrl,
          width: 1200,
          height: 630,
          alt: service.coverImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [service.coverImageUrl],
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;

  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const jsonLd = buildServiceJsonLd(service);

  const features = service.features as unknown as ServiceFeature[];
  const faqItems = service.faq as unknown as FAQItem[];
  const deliverables = (service.deliverables as unknown as ServiceDeliverable[]) ?? [];
  const relatedSlugs = (service.relatedSlugs as unknown as string[]) ?? [];

  const [relatedArticles, relatedServices] = await Promise.all([
    getRelatedArticles(slug),
    getRelatedServices(relatedSlugs),
  ]);

  const tocSections = [
    { id: "problematique", label: "Notre approche" },
    { id: "prestation", label: "Prestations" },
    ...(deliverables.length > 0 ? [{ id: "livrables", label: "Livrables" }] : []),
    { id: "reassurance", label: "Engagements" },
    { id: "faq", label: "FAQ" },
    ...(service.zoneText ? [{ id: "zone", label: "Zone d'intervention" }] : []),
  ];

  return (
    <>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <ServiceBreadcrumb serviceName={service.shortName} slug={slug} />

        <article>
          {/* ── Hero ───────────────────────────────────────────────── */}
          <header className="mb-10 md:mb-14">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {service.h1}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/70 md:text-xl">
              {service.introParagraph}
            </p>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-white/5">
              <Image
                src={service.coverImageUrl}
                alt={service.coverImageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </header>

          <ServiceTOC sections={tocSections} />

          {/* ── Problématique ─────────────────────────────────────── */}
          <section id="problematique" aria-labelledby="problem-h2" className="mt-16 scroll-mt-24">
            <h2 id="problem-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {service.problemQuestion}
            </h2>
            <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-white/70">
              {service.problemAnswer}
            </p>
          </section>

          <ServiceCTA variant="inline" serviceName={service.shortName} />

          {/* ── Prestations ───────────────────────────────────────── */}
          <section id="prestation" aria-labelledby="prestation-h2" className="mt-16 scroll-mt-24">
            <h2 id="prestation-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Prestations {service.shortName}
            </h2>
            <div className="mt-8 grid gap-10">
              {features.map((feature) => (
                <div key={feature.h3}>
                  <h3 className="text-xl font-semibold text-white md:text-2xl">{feature.h3}</h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-white/70">{feature.content}</p>
                </div>
              ))}
            </div>
          </section>

          <ServiceCTA variant="inline" serviceName={service.shortName} />

          {/* ── Livrables ─────────────────────────────────────────── */}
          {deliverables.length > 0 && (
            <section id="livrables" aria-labelledby="livrables-h2" className="mt-16 scroll-mt-24">
              <h2 id="livrables-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Ce que vous recevez
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {deliverables.map((d) => (
                  <li
                    key={d.label}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
                  >
                    <span className="mt-0.5 text-df-gold" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <span className="font-medium text-white">{d.label}</span>
                      {d.detail && (
                        <span className="ml-1 text-sm text-white/50">— {d.detail}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Réassurance ───────────────────────────────────────── */}
          <ServiceReassurance />

          {/* ── FAQ ───────────────────────────────────────────────── */}
          <section id="faq" aria-labelledby="faq-h2" className="mt-16 scroll-mt-24">
            <h2 id="faq-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Questions fréquentes
            </h2>
            <ServiceFAQ items={faqItems} />
          </section>

          {/* ── Zone d'intervention ───────────────────────────────── */}
          {service.zoneText && (
            <section id="zone" aria-labelledby="zone-h2" className="mt-16 scroll-mt-24">
              <h2 id="zone-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Zone d&apos;intervention
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
                {service.zoneText as string}
              </p>
            </section>
          )}

          {/* ── Articles liés ─────────────────────────────────────── */}
          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Articles liés
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group block rounded-xl bg-white/5 p-5 ring-1 ring-white/[0.08] transition hover:ring-df-gold/25"
                  >
                    <h3 className="font-semibold text-white group-hover:text-df-gold transition">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/60 line-clamp-2">{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Services liés ─────────────────────────────────────── */}
          {relatedServices.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Services complémentaires
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.map((rs) => (
                  <Link
                    key={rs.slug}
                    href={`/services/${rs.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-df-surface p-5 transition hover:border-df-gold/25"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-df-gold/70">
                      {rs.category}
                    </p>
                    <h3 className="mt-1 font-semibold text-white group-hover:text-df-gold transition">
                      {rs.shortName}
                    </h3>
                    <p className="mt-2 text-sm text-white/50 line-clamp-2">{rs.metaDescription}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <ServiceCTA variant="block" serviceName={service.shortName} />
        </article>
      </main>
    </>
  );
}
