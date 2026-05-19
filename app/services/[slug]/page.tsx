import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedArticles,
  getRelatedServices,
} from "@/lib/services/queries";
import { buildServiceJsonLd } from "@/lib/services/schema-service";
import type { ServiceFeature, FAQItem, ServiceDeliverable, EquipmentItem, Equipment } from "@/lib/services/types";
import { VILLES, SERVICES_LOCAL_SLUGS, type LocalServiceSlug } from "@/lib/services/local-seo";

import { ServiceBreadcrumb } from "@/components/services/ServiceBreadcrumb";
import { ServiceTOC } from "@/components/services/ServiceTOC";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceCTA } from "@/components/services/ServiceCTA";
import { ServiceReassurance } from "@/components/services/ServiceReassurance";
import { ServiceTeam } from "@/components/services/ServiceTeam";
import { ServiceEquipment } from "@/components/services/ServiceEquipment";
import { ServiceDeliverables } from "@/components/services/ServiceDeliverables";
import { ServiceZone } from "@/components/services/ServiceZone";
import { ServiceLocalLinks } from "@/components/services/ServiceLocalLinks";

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
      images: [{ url: service.coverImageUrl, width: 1200, height: 630, alt: service.coverImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [service.coverImageUrl],
    },
  };
}

const EQUIPMENT_BY_SERVICE: Record<string, Equipment[]> = {
  "montage-video": [
    { name: "Premiere Pro CC" },
    { name: "DaVinci Resolve Studio" },
    { name: "After Effects" },
    { name: "Logic Pro X" },
    { name: "Audition CC" },
  ],
  "production-corporate": [
    { name: "Sony FX3 / FX6" },
    { name: "Blackmagic Pocket 6K" },
    { name: "Optiques Sigma Art", detail: "24-70mm, 85mm" },
    { name: "Ronin RS3 Pro" },
    { name: "Éclairage Aputure", detail: "300X + LS 600D" },
  ],
  "motion-design": [
    { name: "After Effects" },
    { name: "Cinema 4D" },
    { name: "Illustrator" },
    { name: "Lottie" },
  ],
  "pub-reseaux-sociaux": [
    { name: "Sony ZV-E1" },
    { name: "iPhone Pro", detail: "Tournage vertical natif" },
    { name: "DJI OM6" },
    { name: "Premiere Pro" },
  ],
  "shooting-automobile": [
    { name: "Sony A7R V" },
    { name: "Sigma Art", detail: "35mm f/1.4 + 90mm Macro" },
    { name: "Hexlight LED" },
    { name: "Véhicule suiveur", detail: "Équipé RS3" },
  ],
  "photographie-professionnelle": [
    { name: "Sony A7R V" },
    { name: "Sigma Art", detail: "24-70mm + 85mm" },
    { name: "Godox AD400 Pro" },
    { name: "Calibration X-Rite" },
  ],
  "interview-temoignage": [
    { name: "Setup 2-3 caméras", detail: "Sony FX3" },
    { name: "Éclairage Aputure" },
    { name: "Prompteur" },
    { name: "Micro-cravate DPA 4060" },
  ],
  "voix-off-sound-design": [
    { name: "Studio traité acoustiquement" },
    { name: "Neumann TLM 103" },
    { name: "Apollo Twin MKII" },
    { name: "Logic Pro X" },
  ],
  "presentation-entreprise": [
    { name: "Sony FX6" },
    { name: "Ronin RS3 Pro" },
    { name: "Drone", detail: "Option" },
    { name: "Éclairage Aputure complet" },
  ],
};

const DELIVERY_BY_SERVICE: Record<string, { delay: string; priceFrom: string; express?: string }> = {
  "montage-video": { delay: "7 jours ouvrés", priceFrom: "À partir de 500 € HT", express: "Option express 48h" },
  "production-corporate": { delay: "3 à 6 semaines", priceFrom: "À partir de 1 500 € HT" },
  "motion-design": { delay: "2 à 4 semaines", priceFrom: "À partir de 800 € HT" },
  "pub-reseaux-sociaux": { delay: "5 à 7 jours ouvrés", priceFrom: "À partir de 400 € HT", express: "Option express 48h" },
  "shooting-automobile": { delay: "5 à 7 jours ouvrés", priceFrom: "À partir de 350 € HT", express: "Option express 48h" },
  "photographie-professionnelle": { delay: "5 à 7 jours ouvrés", priceFrom: "À partir de 250 € HT", express: "Livraison express 48h" },
  "interview-temoignage": { delay: "1 à 2 semaines", priceFrom: "À partir de 800 € HT" },
  "voix-off-sound-design": { delay: "Quelques jours à 2 semaines", priceFrom: "À partir de 300 € HT" },
  "presentation-entreprise": { delay: "4 à 8 semaines", priceFrom: "À partir de 2 000 € HT" },
};

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const jsonLd = buildServiceJsonLd(service);

  const features = service.features as unknown as ServiceFeature[];
  const faqItems = service.faq as unknown as FAQItem[];
  const deliverables = (service.deliverables as unknown as ServiceDeliverable[]) ?? [];
  
  const dbEquipment = (service.equipment as unknown as EquipmentItem[]) ?? [];
  const equipment = dbEquipment.length > 0 ? dbEquipment : (EQUIPMENT_BY_SERVICE[slug] ?? []);

  const relatedSlugs = (service.relatedSlugs as unknown as string[]) ?? [];
  const delivery = DELIVERY_BY_SERVICE[slug];

  const [relatedArticles, relatedServices] = await Promise.all([
    getRelatedArticles(slug),
    getRelatedServices(relatedSlugs),
  ]);

  const tocSections = [
    { id: "problematique", label: "Notre approche" },
    { id: "prestation", label: "Prestations" },
    ...(equipment.length > 0 ? [{ id: "equipement", label: "Équipement" }] : []),
    ...(deliverables.length > 0 ? [{ id: "livrables", label: "Livrables" }] : []),
    { id: "delais", label: "Délais & tarifs" },
    ...(service.teamMembers.length > 0 ? [{ id: "equipe", label: "Équipe" }] : []),
    ...(service.zoneText ? [{ id: "zone", label: "Zone d'intervention" }] : []),
    { id: "reassurance", label: "Engagements" },
    { id: "rdv", label: "Rendez-vous" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <script
        nonce={nonce}
        suppressHydrationWarning
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <ServiceBreadcrumb serviceName={service.shortName} slug={slug} />
        <article>
          <header className="mb-10 md:mb-14">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {service.h1}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/70 md:text-xl">
              {service.introParagraph}
            </p>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-white/5">
              {service.coverImageUrl ? (
                <Image
                  src={service.coverImageUrl}
                  alt={service.coverImageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-6xl italic text-white/10">DF</span>
                </div>
              )}
            </div>
          </header>

          <ServiceTOC sections={tocSections} />

          <section id="problematique" aria-labelledby="problem-h2" className="mt-16 scroll-mt-24">
            <h2 id="problem-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {service.problemQuestion}
            </h2>
            <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-white/70">
              {service.problemAnswer}
            </p>
          </section>

          <ServiceCTA variant="inline" serviceName={service.shortName} />

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

          {equipment.length > 0 && <ServiceEquipment items={equipment} />}

          {deliverables.length > 0 && <ServiceDeliverables items={deliverables} />}

          {delivery && (
            <section id="delais" aria-labelledby="delais-h2" className="mt-16 scroll-mt-24">
              <h2 id="delais-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Délais & tarifs
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/[0.08] bg-df-surface p-5">
                  <p className="text-xs uppercase tracking-widest text-white/40">Délai standard</p>
                  <p className="mt-2 text-lg font-semibold text-white">{delivery.delay}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-df-surface p-5">
                  <p className="text-xs uppercase tracking-widest text-white/40">Budget indicatif</p>
                  <p className="mt-2 text-lg font-semibold text-df-gold">{delivery.priceFrom}</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-df-surface p-5">
                  <p className="text-xs uppercase tracking-widest text-white/40">Option express</p>
                  <p className="mt-2 text-lg font-semibold text-white">{delivery.express ?? "Sur demande"}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/devis"
                  className="inline-flex items-center justify-center rounded-full bg-df-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-df-gold/90"
                >
                  Demander un devis gratuit
                </Link>
              </div>
            </section>
          )}

          {service.teamMembers.length > 0 && (
            <ServiceTeam members={service.teamMembers} />
          )}

          {service.zoneText && (
            <ServiceZone text={(service.zoneText as string) ?? ""} />
          )}

          <ServiceReassurance />

          <section id="rdv" aria-labelledby="rdv-h2" className="mt-16 scroll-mt-24 rounded-2xl bg-df-surface border border-white/[0.08] p-8 md:p-12">
            <h2 id="rdv-h2" className="text-2xl font-semibold text-white">Prendre rendez-vous</h2>
            <p className="mt-3 text-white/70 max-w-2xl">
              Discutons de votre projet. Répondez à quelques questions sur votre besoin, et recevez un devis
              personnalisé sous 24h.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/devis"
                className="inline-flex items-center justify-center rounded-full bg-df-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-df-gold/90"
              >
                Demander un devis gratuit
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              >
                Nous contacter directement
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/40">Réponse garantie sous 24h ouvrées · Devis sans engagement</p>
          </section>

          <section id="faq" aria-labelledby="faq-h2" className="mt-16 scroll-mt-24">
            <h2 id="faq-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Questions fréquentes
            </h2>
            <ServiceFAQ items={faqItems} />
          </section>

          {relatedArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Articles liés</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group block rounded-xl bg-white/5 p-5 ring-1 ring-white/[0.08] transition hover:ring-df-gold/25"
                  >
                    <h3 className="font-semibold text-white group-hover:text-df-gold transition">{article.title}</h3>
                    <p className="mt-2 text-sm text-white/60 line-clamp-2">{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {relatedServices.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Services complémentaires</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.map((rs) => (
                  <Link
                    key={rs.slug}
                    href={`/services/${rs.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-df-surface p-5 transition hover:border-df-gold/25"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-df-gold/70">{rs.category}</p>
                    <h3 className="mt-1 font-semibold text-white group-hover:text-df-gold transition">{rs.shortName}</h3>
                    <p className="mt-2 text-sm text-white/50 line-clamp-2">{rs.metaDescription}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <ServiceCTA variant="block" serviceName={service.shortName} />
          <ServiceLocalLinks serviceSlug={slug} />
        </article>
      </main>
    </>
  );
}
