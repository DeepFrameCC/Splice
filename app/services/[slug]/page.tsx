import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Euro, Zap, Sparkles, ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";

import {
  getServiceBySlug,
  getAllServiceSlugs,
  getRelatedArticles,
  getRelatedServices,
} from "@/lib/services/queries";
import { buildServiceJsonLd } from "@/lib/services/schema-service";
import { absoluteUrl } from "@/lib/seo";
import type { ServiceFeature, FAQItem, ServiceDeliverable, EquipmentItem, Equipment } from "@/lib/services/types";

import { ServiceBreadcrumb } from "@/components/services/ServiceBreadcrumb";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceReassurance } from "@/components/services/ServiceReassurance";
import { ServiceTeam } from "@/components/services/ServiceTeam";
import { ServiceEquipment } from "@/components/services/ServiceEquipment";
import { ServiceDeliverables } from "@/components/services/ServiceDeliverables";
import { ServiceZone } from "@/components/services/ServiceZone";
import { ServiceLocalLinks } from "@/components/services/ServiceLocalLinks";
import { ServiceCoverImage } from "@/components/services/ServiceCoverImage";

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
      siteName: "Splice",
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
  "montage-video": { delay: "7 jours ouvrés", priceFrom: "Dès 29 € (Pack) ou 45 €/mois", express: "Option express 48h" },
  "production-corporate": { delay: "3 à 6 semaines", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "motion-design": { delay: "2 à 4 semaines", priceFrom: "Dès 29 € (Pack) ou 45 €/mois", express: "Sur demande" },
  "pub-reseaux-sociaux": { delay: "5 à 7 jours ouvrés", priceFrom: "Dès 29 € (Pack) ou 45 €/mois", express: "Option express 48h" },
  "shooting-automobile": { delay: "5 à 7 jours ouvrés", priceFrom: "Dès 15 € (Photos) ou 29 € (Vidéo)", express: "Option express 48h" },
  "photographie-professionnelle": { delay: "5 à 7 jours ouvrés", priceFrom: "Dès 15 € (5 photos)", express: "Option express 48h" },
  "interview-temoignage": { delay: "1 à 2 semaines", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "voix-off-sound-design": { delay: "Quelques jours", priceFrom: "Dès 12 € (Option) ou 29 € (Pack)", express: "Option express 48h" },
  "presentation-entreprise": { delay: "4 à 8 semaines", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "clip-musical": { delay: "2 à 4 semaines", priceFrom: "Dès 29 € (Montage) ou Devis", express: "Sur demande" },
  "drone-prise-de-vue-aerienne": { delay: "3 à 5 jours ouvrés", priceFrom: "Dès 15 € (Photos) ou Devis", express: "Option express 48h" },
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
      {/* FAQPage structured data for Google rich snippets */}
      {faqItems.length > 0 && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }} />
      )}
      
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-16">
        <article className="space-y-16 md:space-y-24">
          
          {/* 1. Header Hero Grid (Desktop 2-columns) */}
          <header className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <ServiceBreadcrumb serviceName={service.shortName} slug={slug} />
              
              <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                {service.h1}
              </h1>
              
              <p className="mt-6 text-pretty text-lg leading-relaxed text-white/60 md:text-xl">
                {service.introParagraph}
              </p>

              {/* Quick Info Bar */}
              {delivery && (
                <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-md">
                  {/* Top row: Délai & Express */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Délai</span>
                      </div>
                      <span className="mt-1 text-xs sm:text-sm font-bold text-white">{delivery.delay}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/[0.08] pl-3 sm:pl-4">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Zap className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Express</span>
                      </div>
                      <span className="mt-1 text-xs sm:text-sm font-bold text-white/80">{delivery.express ?? "Sur demande"}</span>
                    </div>
                  </div>

                  {/* Bottom row (en bas): Tarif */}
                  <div className="border-t border-white/[0.08] pt-3 flex flex-col">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Euro className="h-3.5 w-3.5 text-df-gold" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-df-gold">Tarif</span>
                    </div>
                    <span className="mt-1 text-sm sm:text-base font-extrabold text-df-gold">{delivery.priceFrom}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 border border-white/[0.08] shadow-[0_0_50px_-12px_rgba(212,175,55,0.15)] group">
              <ServiceCoverImage
                src={service.coverImageUrl || ""}
                alt={service.coverImageAlt}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </header>

          {/* 2. Glassmorphic "Notre Approche" Card */}
          <section className="scroll-mt-24">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 md:p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-df-gold/10 blur-3xl" />
              <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-df-gold/10 text-df-gold">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {service.problemQuestion}
                  </h2>
                  <p className="mt-4 text-pretty leading-relaxed text-white/70 text-base md:text-lg">
                    {service.problemAnswer}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Prestations Features Grid */}
          <section className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-df-gold">Nos Services</p>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                  Prestations {service.shortName}
                </h2>
              </div>
              <div className="h-px flex-1 bg-white/[0.08] mx-8 hidden md:block" />
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <div 
                  key={feature.h3}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-df-gold/30 hover:bg-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
                >
                  <span className="absolute right-4 top-4 text-xs font-mono font-bold text-white/10 group-hover:text-df-gold/20 transition-colors duration-300">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-df-gold transition-colors duration-300 pr-8">
                    {feature.h3}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60 group-hover:text-white/80 transition-colors duration-300">
                    {feature.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Deliverables & Equipment Dashboard (Side-by-Side 2-column) */}
          {(deliverables.length > 0 || equipment.length > 0) && (
            <div className="grid gap-8 md:grid-cols-2 items-stretch [&>section]:mt-0 [&>section>h2]:text-xl [&>section>h2]:font-bold [&>section>h2]:text-white [&>section>div]:mt-6 [&>section>div]:md:grid-cols-1">
              <div>
                {deliverables.length > 0 && (
                  <ServiceDeliverables items={deliverables} />
                )}
              </div>
              <div>
                {equipment.length > 0 && (
                  <ServiceEquipment items={equipment} />
                )}
              </div>
            </div>
          )}

          {/* 5. Team & Intervention Zone (Side-by-Side 2-column) */}
          {(service.teamMembers.length > 0 || service.zoneText) && (
            <div className="grid gap-8 md:grid-cols-2 items-stretch [&>section]:mt-0 [&>section>h2]:text-xl [&>section>h2]:font-bold [&>section>h2]:text-white [&>section>div]:mt-6">
              <div>
                {service.teamMembers.length > 0 && (
                  <ServiceTeam members={service.teamMembers} />
                )}
              </div>
              <div>
                {service.zoneText && (
                  <ServiceZone text={(service.zoneText as string) ?? ""} />
                )}
              </div>
            </div>
          )}

          {/* 6. Engagements (ServiceReassurance) */}
          <ServiceReassurance />

          {/* 7. Bottom Premium Call-to-Action Card */}
          <section id="rdv" aria-labelledby="rdv-h2" className="scroll-mt-24 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 md:p-14 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_10px_50px_-12px_rgba(0,0,0,0.5)]">
            <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-df-gold/5 blur-3xl" />
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-df-gold/5 blur-3xl" />
            
            <div className="relative max-w-2xl mx-auto flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-df-gold/10 text-df-gold mb-6 animate-[bounce_1s_ease-in-out_1]">
                <Sparkles className="h-6 w-6" />
              </div>
              
              <h2 id="rdv-h2" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Prêt à lancer votre projet ?
              </h2>
              
              <p className="mt-4 text-white/60 text-base md:text-lg leading-relaxed">
                Discutons de votre besoin. Remplissez notre assistant de devis en 2 minutes ou planifiez un appel avec notre équipe. Réponse garantie sous 24h.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  href="/devis"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-df-gold px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-df-gold/90 hover:scale-[1.02] shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                >
                  <span>Lancer le simulateur de devis</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05]"
                >
                  Nous contacter
                </Link>
              </div>
              
              <p className="mt-6 text-xs text-white/40 tracking-wide font-medium uppercase">
                Gratuit · Sans engagement · Étude personnalisée sous 24h
              </p>
            </div>
          </section>

          {/* 8. Questions fréquentes */}
          <section id="faq" aria-labelledby="faq-h2" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-df-gold">Questions fréquentes</p>
                <h2 id="faq-h2" className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                  FAQ {service.shortName}
                </h2>
              </div>
              <div className="h-px flex-1 bg-white/[0.08] mx-8 hidden md:block" />
            </div>
            <div className="max-w-3xl">
              <ServiceFAQ items={faqItems} />
            </div>
          </section>

          {/* 9. Articles liés */}
          {relatedArticles.length > 0 && (
            <section className="scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-df-gold font-mono">Ressources & Guides</p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    Articles complémentaires
                  </h2>
                </div>
                <div className="h-px flex-1 bg-white/[0.08] mx-8 hidden md:block" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-df-gold/30 hover:bg-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <h3 className="font-bold text-white group-hover:text-df-gold transition-colors duration-300 text-lg leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm text-white/50 group-hover:text-white/75 transition-colors duration-300 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-df-gold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      <span>Lire l&apos;article</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 10. Services complémentaires */}
          {relatedServices.length > 0 && (
            <section className="scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-df-gold font-mono">Expertises</p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    Services associés
                  </h2>
                </div>
                <div className="h-px flex-1 bg-white/[0.08] mx-8 hidden md:block" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.map((rs) => (
                  <Link
                    key={rs.slug}
                    href={`/services/${rs.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-df-gold/30 hover:bg-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-df-gold/75 bg-df-gold/10 px-2 py-0.5 rounded-full">
                        {rs.category}
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-white group-hover:text-df-gold transition-colors duration-300 pr-6">
                        {rs.shortName}
                      </h3>
                      <p className="mt-2 text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 line-clamp-2 leading-relaxed">
                        {rs.metaDescription}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-bold text-df-gold">
                      <span>Découvrir l&apos;offre</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 11. SEO Silo Links */}
          <ServiceLocalLinks serviceSlug={slug} />
          
        </article>
      </main>
    </>
  );
}
