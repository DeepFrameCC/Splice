import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Cpu } from "lucide-react";
import JsonLd from "@/components/JsonLd";

import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedArticles,
  getRelatedServices,
} from "@/lib/services/queries";
import { buildServiceJsonLd } from "@/lib/services/schema-service";
import { absoluteUrl } from "@/lib/seo";
import type { ServiceFeature, FAQItem, ServiceDeliverable, EquipmentItem } from "@/lib/services/types";
import { ServiceBreadcrumb } from "@/components/services/ServiceBreadcrumb";
import { ServiceCoverImage } from "@/components/services/ServiceCoverImage";
import { CtaTrackedLink } from "@/components/marketing/CtaTrackedLink";

const MEMBER_DETAILS: Record<string, { name: string; role: string; initials: string }> = {
  TY: {
    name: "Tracy",
    role: "Monteur & Motion Designer",
    initials: "TR"
  },
  LOUISIA: {
    name: "Louisia",
    role: "Photographe",
    initials: "LO"
  }
};

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
  const url = absoluteUrl(`/services/${slug}`);
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
      siteName: "Splice Studio",
      locale: "fr_FR",
      type: "article",
      images: [{ url: service.coverImageUrl || "", width: 1200, height: 630, alt: service.coverImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [service.coverImageUrl || ""],
    },
  };
}

// Fallback only — the live values come from the seeded DB (`service.equipment`).
// Kept honest so a missing/empty DB record can never resurface fake gear.
const EQUIPMENT_BY_SERVICE: Record<string, { name: string; detail?: string }[]> = {
  "montage-video": [
    { name: "Adobe Premiere Pro CC" },
    { name: "DaVinci Resolve Studio" },
    { name: "CapCut Pro" },
    { name: "Logic Pro X" },
    { name: "Adobe Audition CC" },
  ],
  "production-corporate": [
    { name: "Sony ZV-1", detail: "Caméra hybride 4K" },
    { name: "iPhone 14", detail: "B-roll et plans complémentaires" },
    { name: "Micro DJI", detail: "Son sans fil" },
    { name: "DaVinci Resolve Studio" },
    { name: "CapCut Pro" },
  ],
  "motion-design": [
    { name: "After Effects" },
    { name: "Adobe Premiere Pro CC" },
    { name: "DaVinci Resolve Studio" },
    { name: "Adobe Audition CC" },
  ],
  "pub-reseaux-sociaux": [
    { name: "Sony ZV-1" },
    { name: "iPhone 14", detail: "Tournage vertical natif" },
    { name: "Micro DJI" },
    { name: "Adobe Premiere Pro CC" },
  ],
  "shooting-automobile": [
    { name: "Sony ZV-1", detail: "Photo et vidéo 4K" },
    { name: "iPhone 14" },
    { name: "DaVinci Resolve Studio", detail: "Étalonnage des teintes" },
  ],
  "photographie-professionnelle": [
    { name: "Sony ZV-1" },
    { name: "iPhone 14" },
  ],
  "photographie-google-business": [
    { name: "Sony ZV-1" },
    { name: "iPhone 14" },
  ],
  "interview-temoignage": [
    { name: "Sony ZV-1" },
    { name: "iPhone 14", detail: "Second angle" },
    { name: "Micro DJI" },
    { name: "DaVinci Resolve Studio" },
  ],
  "voix-off-sound-design": [
    { name: "Micro DJI" },
    { name: "Logic Pro X" },
    { name: "Adobe Audition CC" },
  ],
  "presentation-entreprise": [
    { name: "Sony ZV-1" },
    { name: "iPhone 14" },
    { name: "Micro DJI" },
    { name: "DaVinci Resolve Studio" },
    { name: "CapCut Pro" },
  ],
};

const DELIVERY_BY_SERVICE: Record<string, { delay: string; priceFrom: string; express?: string }> = {
  "montage-video": { delay: "7 à 14 jours", priceFrom: "Dès 29 € (Pack) ou 45 €/mois", express: "Option express 48h" },
  "production-corporate": { delay: "7 à 14 jours", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "motion-design": { delay: "7 à 14 jours", priceFrom: "Dès 29 € (Pack) ou 45 €/mois", express: "Sur demande" },
  "pub-reseaux-sociaux": { delay: "7 à 14 jours", priceFrom: "Dès 29 € (Pack) ou 45 €/mois", express: "Option express 48h" },
  "shooting-automobile": { delay: "7 à 14 jours", priceFrom: "Dès 15 € (Photos) ou 29 € (Vidéo)", express: "Option express 48h" },
  "photographie-professionnelle": { delay: "7 à 14 jours", priceFrom: "Dès 15 € (5 photos)", express: "Option express 48h" },
  "photographie-google-business": { delay: "7 à 14 jours", priceFrom: "Dès 190 € (15 photos)", express: "Option express 48h" },
  "interview-temoignage": { delay: "7 à 14 jours", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "voix-off-sound-design": { delay: "7 à 14 jours", priceFrom: "Dès 12 € (Option) ou 29 € (Pack)", express: "Option express 48h" },
  "presentation-entreprise": { delay: "7 à 14 jours", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "clip-musical": { delay: "7 à 14 jours", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "drone-prise-de-vue-aerienne": { delay: "7 à 14 jours", priceFrom: "Dès 15 € (Photos) ou Devis", express: "Option express 48h" },
};

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

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

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="df-site">
        <div className="df-root">
          <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">

            {/* Breadcrumbs */}
            <div className="mb-8">
              <ServiceBreadcrumb serviceName={service.shortName} slug={slug} />
            </div>

            {/* Hero Section (Lookbook Poster style) */}
            <header className="grid gap-12 lg:grid-cols-12 lg:items-start border-b border-white/[0.06] pb-16">
              <div className="lg:col-span-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-[1px] w-8 bg-df-gold" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
                    Service professionnel
                  </span>
                </div>

                <h1 className="font-display text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl leading-[0.95]">
                  {service.name.split(" ").map((w, idx) => (
                    <span key={idx}>
                      {idx > 0 && " "}
                      {idx % 3 === 2 ? <em>{w}</em> : w}
                    </span>
                  ))}
                </h1>

                <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg">
                  {service.introParagraph}
                </p>

                {/* Minimalist Cine Slate Info Grid */}
                {delivery && (
                  <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Délai</span>
                      <span className="mt-1 text-sm font-semibold text-white">{delivery.delay}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/[0.08] pl-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tarif de départ</span>
                      <span className="mt-1 text-sm font-bold text-df-gold">{delivery.priceFrom}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/[0.08] pl-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Livraison express</span>
                      <span className="mt-1 text-sm font-semibold text-white/80">{delivery.express ?? "Sur demande"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Frame (Right Side) */}
              <div className="lg:col-span-5 relative w-full aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.08] bg-white/5 shadow-2xl group">
                <ServiceCoverImage
                  src={service.coverImageUrl || ""}
                  alt={service.coverImageAlt}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E22]/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white/90 border border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F36B1F]" />
                  Qualité studio certifiée
                </div>
              </div>
            </header>

            {/* Asymmetric Core Sections */}
            <div className="mt-20 space-y-24">

              {/* Note d'intention — Styled as manifesto */}
              <section className="df-frs" aria-label="Note d'intention">
                <div className="df-frs-grid max-w-none">
                  <div className="df-frs-rail">
                    <span className="df-frs-rail-num">N°01</span>
                    <span className="df-frs-rail-line" />
                    <span className="df-frs-rail-label">Note d&apos;intention</span>
                  </div>
                  <div className="df-frs-main">
                    <h2 className="df-frs-headline leading-tight">
                      {service.problemQuestion}
                    </h2>
                    <p className="df-frs-credo text-white/70 mt-6 text-sm md:text-base leading-relaxed">
                      {service.problemAnswer}
                    </p>
                  </div>
                </div>
              </section>

              {/* Nos Prestations — Features list */}
              <section className="df-frs border-t border-white/[0.06] pt-16" aria-label="Prestations">
                <div className="df-frs-grid max-w-none">
                  <div className="df-frs-rail">
                    <span className="df-frs-rail-num">N°02</span>
                    <span className="df-frs-rail-line" />
                    <span className="df-frs-rail-label">Notre Offre</span>
                  </div>
                  <div className="df-frs-main w-full">
                    <div className="divide-y divide-white/[0.06] w-full">
                      {features.map((feature, idx) => (
                        <div key={feature.h3} className="py-8 first:pt-0 last:pb-0">
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-sm text-df-gold font-semibold select-none">
                              {(idx + 1).toString().padStart(2, "0")}.
                            </span>
                            <h3
                              style={{ fontFamily: "var(--font-sans)" }}
                              className="text-lg md:text-xl font-medium text-white tracking-normal normal-case"
                            >
                              {feature.h3}
                            </h3>
                          </div>
                          <p className="mt-3 text-sm md:text-base text-white/60 leading-relaxed max-w-3xl font-light">
                            {feature.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Technical Details (Livrables & Matériel) */}
              {(deliverables.length > 0 || equipment.length > 0) && (
                <section className="df-frs border-t border-white/[0.06] pt-16" aria-label="Livrables et Matériel">
                  <div className="df-frs-grid max-w-none">
                    <div className="df-frs-rail">
                      <span className="df-frs-rail-num">N°03</span>
                      <span className="df-frs-rail-line" />
                      <span className="df-frs-rail-label">Détails techniques</span>
                    </div>
                    <div className="df-frs-main grid gap-12 sm:grid-cols-2 w-full">
                      {deliverables.length > 0 && (
                        <div>
                          <h3
                            style={{ fontFamily: "var(--font-sans)" }}
                            className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6"
                          >
                            Livrables inclus
                          </h3>
                          <ul className="space-y-4">
                            {deliverables.map((item) => (
                              <li key={item.label} className="flex items-start gap-3">
                                <Check className="h-4 w-4 text-df-gold shrink-0 mt-1" />
                                <div>
                                  <span className="text-base font-normal text-white block">{item.label}</span>
                                  {item.detail && <span className="text-sm text-white/45 block mt-1 font-light">{item.detail}</span>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {equipment.length > 0 && (
                        <div>
                          <h3
                            style={{ fontFamily: "var(--font-sans)" }}
                            className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6"
                          >
                            Matériel &amp; Outils
                          </h3>
                          <ul className="space-y-4">
                            {equipment.map((item) => (
                              <li key={item.name} className="flex items-start gap-3">
                                <Cpu className="h-4 w-4 text-white/30 shrink-0 mt-1" />
                                <div>
                                  <span className="text-base font-normal text-white block">{item.name}</span>
                                  {item.detail && <span className="text-sm text-white/45 block mt-1 font-light">{item.detail}</span>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Équipe & Logistique */}
              {(service.teamMembers.length > 0 || service.zoneText) && (
                <section className="df-frs border-t border-white/[0.06] pt-16" aria-label="Organisation">
                  <div className="df-frs-grid max-w-none">
                    <div className="df-frs-rail">
                      <span className="df-frs-rail-num">N°04</span>
                      <span className="df-frs-rail-line" />
                      <span className="df-frs-rail-label">Organisation</span>
                    </div>
                    <div className="df-frs-main grid gap-12 sm:grid-cols-2 w-full">
                      {service.teamMembers.length > 0 && (
                        <div>
                          <h3
                            style={{ fontFamily: "var(--font-sans)" }}
                            className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6"
                          >
                            Contacts dédiés
                          </h3>
                          <div className="flex flex-col gap-4 max-w-sm">
                            {service.teamMembers.map((memberKey) => {
                              const details = MEMBER_DETAILS[memberKey.toUpperCase()] || {
                                name: memberKey,
                                role: "Membre de l'équipe",
                                initials: memberKey.substring(0, 2).toUpperCase()
                              };
                              return (
                                <div key={memberKey} className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl w-full">
                                  <div className="h-10 w-10 rounded-full bg-df-gold/10 flex items-center justify-center text-df-gold font-bold text-sm tracking-wider shrink-0 select-none">
                                    {details.initials}
                                  </div>
                                  <div>
                                    <span className="text-base font-normal text-white block">{details.name}</span>
                                    <span className="text-sm text-white/40 block mt-0.5 font-light">{details.role}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {service.zoneText && (
                        <div>
                          <h3
                            style={{ fontFamily: "var(--font-sans)" }}
                            className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6"
                          >
                            Zone d&apos;intervention
                          </h3>
                          <p className="text-base text-white/60 leading-relaxed font-light">
                            {service.zoneText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* FAQ Accordion */}
              {faqItems.length > 0 && (
                <section className="df-frs border-t border-white/[0.06] pt-16" aria-label="FAQ">
                  <div className="df-frs-grid max-w-none">
                    <div className="df-frs-rail">
                      <span className="df-frs-rail-num">N°05</span>
                      <span className="df-frs-rail-line" />
                      <span className="df-frs-rail-label">FAQ</span>
                    </div>
                    <div className="df-frs-main divide-y divide-white/[0.06] w-full">
                      {faqItems.map((item) => (
                        <details key={item.question} className="group py-5 first:pt-0 last:pb-0">
                          <summary
                            style={{ fontFamily: "var(--font-sans)" }}
                            className="flex cursor-pointer items-center justify-between text-base md:text-lg font-medium text-white transition hover:text-df-gold select-none"
                          >
                            <span>{item.question}</span>
                            <span className="ml-4 shrink-0 text-df-gold/60 transition duration-300 group-open:rotate-45 font-mono text-base">+</span>
                          </summary>
                          <div
                            className="mt-4 text-sm md:text-base leading-relaxed text-white/50 pl-4 border-l border-df-gold/20 prose-splice font-light"
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        </details>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Ressources (Articles & Services liés) */}
              {(relatedArticles.length > 0 || relatedServices.length > 0) && (
                <section className="df-frs border-t border-white/[0.06] pt-16" aria-label="Ressources">
                  <div className="df-frs-grid max-w-none">
                    <div className="df-frs-rail">
                      <span className="df-frs-rail-num">N°06</span>
                      <span className="df-frs-rail-line" />
                      <span className="df-frs-rail-label">Ressources</span>
                    </div>
                    <div className="df-frs-main space-y-12 w-full">
                      {relatedArticles.length > 0 && (
                        <div>
                          <h3
                            style={{ fontFamily: "var(--font-sans)" }}
                            className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6"
                          >
                            Articles utiles
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {relatedArticles.map((article) => (
                              <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className="group block border border-white/[0.04] bg-[#15152A] p-5 rounded-xl hover:border-df-gold/20 transition-all duration-300"
                              >
                                <h4
                                  style={{ fontFamily: "var(--font-sans)" }}
                                  className="text-base font-medium text-white group-hover:text-df-gold transition-colors leading-snug"
                                >
                                  {article.title}
                                </h4>
                                <p className="mt-2 text-xs text-white/40 leading-relaxed line-clamp-2 font-light">
                                  {article.excerpt}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {relatedServices.length > 0 && (
                        <div>
                          <h3
                            style={{ fontFamily: "var(--font-sans)" }}
                            className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6"
                          >
                            Services connexes
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {relatedServices.map((rs) => (
                              <Link
                                key={rs.slug}
                                href={`/services/${rs.slug}`}
                                className="group block border border-white/[0.04] bg-[#15152A] p-5 rounded-xl hover:border-df-gold/20 transition-all duration-300"
                              >
                                <div className="flex items-center justify-between">
                                  <h4
                                    style={{ fontFamily: "var(--font-sans)" }}
                                    className="text-base font-medium text-white group-hover:text-df-gold transition-colors"
                                  >
                                    {rs.shortName}
                                  </h4>
                                  <ArrowRight className="h-4 w-4 text-white/20 transform group-hover:translate-x-1 group-hover:text-df-gold transition-all" />
                                </div>
                                <p className="mt-2 text-xs text-white/40 leading-relaxed line-clamp-2 font-light">
                                  {rs.metaDescription}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Final CTA: LastFrame style */}
              <section className="df-lf mt-24" aria-label="Demander un devis Splice Studio">
                {/* Cine corners */}
                <div className="df-cine-corners df-lf-corners" aria-hidden="true">
                  <i /><i /><i /><i />
                </div>

                <div className="df-lf-inner">
                  <h2 className="df-lf-title">
                    Votre projet de <em>{service.shortName}</em>,
                    <br />
                    on s&apos;en occupe avec exigence.
                  </h2>

                  <CtaTrackedLink
                    href="/devis"
                    source="service_detail"
                    className="df-btn df-btn-primary df-btn-lg df-lf-cta"
                  >
                    Simuler mon devis →
                  </CtaTrackedLink>

                  <ul className="df-lf-reassurance text-white/70">
                    <li><Check className="df-lf-reassurance-ic text-df-gold" aria-hidden="true" /> Devis gratuit en ligne sous 24h</li>
                    <li><Check className="df-lf-reassurance-ic text-df-gold" aria-hidden="true" /> Chef de projet dédié &amp; 2 retours inclus</li>
                    <li><Check className="df-lf-reassurance-ic text-df-gold" aria-hidden="true" /> Étalonnage &amp; Mixage pro inclus</li>
                    <li><Check className="df-lf-reassurance-ic text-df-gold" aria-hidden="true" /> Rendu certifié 4K de haute qualité</li>
                  </ul>

                  <div className="df-lf-meta">
                    <a href="mailto:contact.splicestudio@gmail.com" className="df-lf-meta-link">contact.splicestudio@gmail.com</a>
                    <span className="df-lf-sep">·</span>
                    <Link href="/contact" className="df-lf-meta-link">Nous contacter</Link>
                  </div>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}
