import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { MapPin, ArrowLeft } from "lucide-react";

import { getAllServices } from "@/lib/services/queries";
import { buildServicesHubJsonLd } from "@/lib/services/schema-service";
import { absoluteUrl } from "@/lib/seo";
import { ServiceCoverImage } from "@/components/services/ServiceCoverImage";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Services audiovisuels Orléans Tours | Splice",
  description:
    "Production vidéo, photographie professionnelle, motion design, pub réseaux sociaux à Orléans et Tours. Splice couvre toute la chaîne de production audiovisuelle en Centre-Val de Loire.",
  alternates: { canonical: absoluteUrl("/services") },
  openGraph: {
    title: "Nos services audiovisuels — Orléans · Tours | Splice",
    description:
      "Montage vidéo, production corporate, motion design, shooting automobile, photographie professionnelle et plus. Splice couvre toute la chaîne audiovisuelle à Orléans et Tours.",
    url: absoluteUrl("/services"),
    siteName: "Splice",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nos services audiovisuels — Orléans · Tours | Splice",
    description:
      "Montage vidéo, production corporate, motion design, shooting automobile, photographie professionnelle et plus.",
  },
};

export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, string> = {
  video: "Vidéo",
  photo: "Photo",
  motion: "Motion",
  audio: "Audio",
};

const CATEGORY_ORDER = ["video", "photo", "motion", "audio"];

export default async function ServicesHubPage() {
  const services = await getAllServices();
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const jsonLd = buildServicesHubJsonLd(services);

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof services>>((acc, cat) => {
    const items = services.filter((s) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
        {/* Retour à l'accueil */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/40 transition hover:text-df-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à l&apos;accueil
        </Link>

        {/* Hero */}
        <header className="mb-14">
          <h1 className="font-display text-3xl uppercase tracking-tight text-white md:text-5xl">
            Services audiovisuels
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            Production complète à Orléans &amp; Tours — vidéo, photo, motion, audio. Du brief au livrable, sous 14 jours en moyenne.
          </p>
        </header>

        {/* Grouped grid */}
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="mb-16">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-df-gold">
              {CATEGORY_LABELS[cat] ?? cat}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-df-surface shadow-sm transition hover:shadow-md hover:border-df-gold/25"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-df-surface">
                    <ServiceCoverImage src={s.coverImageUrl || ""} alt={s.coverImageAlt} />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white group-hover:text-df-gold transition">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-2">
                      {s.metaDescription}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-df-gold">
                      En savoir plus &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {services.length === 0 && (
          <p className="mt-12 text-center text-white/40">
            Aucun service disponible pour le moment.
          </p>
        )}

        {/* Zone d'intervention */}
        <section className="mt-20 rounded-2xl border border-white/[0.08] bg-df-surface p-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-df-gold" aria-hidden="true" />
            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">Zone d&apos;intervention :</span> Orléans, Tours, Blois, Chartres, Bourges — Centre-Val de Loire. Frais kilométriques 0,50 €/km A/R.
            </p>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Comment ça marche
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Échangeons",
                text: "Appelez-nous ou remplissez le formulaire de devis. Nous définissons ensemble vos objectifs, votre budget et votre retroplanning.",
              },
              {
                step: "02",
                title: "Production",
                text: "Tournage, animation ou post-production — notre équipe prend en charge la réalisation de A à Z avec une direction artistique soignée.",
              },
              {
                step: "03",
                title: "Livraison",
                text: "Vous recevez vos livrables optimisés pour le web, les réseaux sociaux, l'interne ou vos supports commerciaux dans les délais convenus.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/[0.08] bg-df-surface p-6"
              >
                <span className="text-2xl font-bold text-df-gold">
                  {item.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-16 rounded-2xl border border-white/[0.08] bg-df-surface p-8 text-center md:p-12">
          <h2 className="font-display text-2xl uppercase tracking-tight text-white md:text-3xl">
            Un projet en tête ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Devis personnalisé sous 24h ouvrées. Sans engagement.
          </p>
          <div className="mt-6">
            <Link
              href="/devis"
              className="inline-flex items-center justify-center rounded-full bg-df-gold px-8 py-3 text-sm font-semibold text-black transition hover:bg-df-gold/90"
            >
              Demander un devis
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
