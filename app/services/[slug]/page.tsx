import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServiceBySlug, getAllServiceSlugs, getRelatedArticles } from "@/lib/services/queries";
import { buildServiceJsonLd } from "@/lib/services/schema-service";
import type { ServiceFeature, FAQItem } from "@/lib/services/types";
import { ServiceBreadcrumb } from "@/components/services/ServiceBreadcrumb";
import { ServiceTOC } from "@/components/services/ServiceTOC";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceReassurance } from "@/components/services/ServiceReassurance";

export const dynamicParams = false;
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

  const [service, relatedArticles] = await Promise.all([
    getServiceBySlug(slug),
    getRelatedArticles(slug, 3),
  ]);

  if (!service) notFound();

  const jsonLd = buildServiceJsonLd(service);
  const features = service.features as unknown as ServiceFeature[];
  const faqItems = service.faq as unknown as FAQItem[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <ServiceBreadcrumb serviceName={service.shortName} slug={slug} />

        <article>
          <header className="mb-10 md:mb-14">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-df-blue md:text-5xl">
              {service.h1}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-df-ink/70 md:text-xl">
              {service.introParagraph}
            </p>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-df-cream">
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

          <ServiceTOC
            sections={[
              { id: "problematique", label: "Notre approche" },
              { id: "prestation", label: "Prestations" },
              { id: "reassurance", label: "Engagements" },
              { id: "faq", label: "FAQ" },
            ]}
          />

          <section id="problematique" aria-labelledby="problem-h2" className="mt-16 scroll-mt-24">
            <h2 id="problem-h2" className="text-2xl font-semibold tracking-tight text-df-blue md:text-3xl">
              {service.problemQuestion}
            </h2>
            <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-df-ink/70">
              {service.problemAnswer}
            </p>
          </section>

          <ServiceCTA variant="inline" serviceName={service.shortName} />

          <section id="prestation" aria-labelledby="prestation-h2" className="mt-16 scroll-mt-24">
            <h2 id="prestation-h2" className="text-2xl font-semibold tracking-tight text-df-blue md:text-3xl">
              Prestations {service.shortName}
            </h2>
            <div className="mt-8 grid gap-10">
              {features.map((feature) => (
                <div key={feature.h3}>
                  <h3 className="text-xl font-semibold text-df-ink md:text-2xl">{feature.h3}</h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-df-ink/70">{feature.content}</p>
                </div>
              ))}
            </div>
          </section>

          <ServiceCTA variant="inline" serviceName={service.shortName} />

          <ServiceReassurance />

          <section id="faq" aria-labelledby="faq-h2" className="mt-16 scroll-mt-24">
            <h2 id="faq-h2" className="text-2xl font-semibold tracking-tight text-df-blue md:text-3xl">
              Questions frequentes
            </h2>
            <ServiceFAQ items={faqItems} />
          </section>

          {relatedArticles.length > 0 && (
            <aside aria-labelledby="related-h2" className="mt-20">
              <h2 id="related-h2" className="text-2xl font-semibold tracking-tight text-df-blue md:text-3xl">
                Pour aller plus loin
              </h2>
              <ul className="mt-6 grid gap-4 md:grid-cols-3">
                {relatedArticles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block rounded-xl border border-df-blue/10 p-5 transition hover:border-df-blue/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-blue"
                    >
                      <h3 className="font-medium text-df-ink">{article.title}</h3>
                      <p className="mt-2 text-sm text-df-ink/60">{article.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <ServiceCTA variant="block" serviceName={service.shortName} />
        </article>
      </main>
    </>
  );
}
