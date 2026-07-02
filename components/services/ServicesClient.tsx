"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import gsap from "gsap";

interface Service {
  slug: string;
  shortName: string;
  name: string;
  metaDescription: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  category: string;
  sortOrder: number;
  iconName: string | null;
  serviceType: string;
  priceRange: string;
}

interface Props {
  services: Service[];
}

const CATEGORY_LABELS: Record<string, { label: string; tag: string; desc: string }> = {
  video: {
    label: "Production Vidéo",
    tag: "01",
    desc: "Films d'entreprise, corporate, interviews et clips artistiques étalonnés sur DaVinci Resolve.",
  },
  photo: {
    label: "Photographie",
    tag: "02",
    desc: "Reportages professionnels, shootings automobiles de prestige et packshots e-commerce haute définition.",
  },
  motion: {
    label: "Motion Design",
    tag: "03",
    desc: "Animations graphiques 2D/3D et storyboards sur mesure pour vulgariser vos concepts complexes.",
  },
  audio: {
    label: "Post-Production Audio",
    tag: "04",
    desc: "Voix-off de qualité broadcast, sound design immersif et mixage aux normes de diffusion.",
  },
};

const CATEGORY_ORDER = ["video", "photo", "motion", "audio"];

/* ── Ligne service (lien vers /services/[slug]) ────────────────────── */
function ServiceRow({
  service,
  withTopBorder,
  onEnter,
  onLeave,
}: {
  service: Service;
  withTopBorder: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group flex min-h-[44px] items-center justify-between gap-4 rounded-[10px] px-4 py-[0.9rem] transition-colors duration-200 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-df-gold ${
        withTopBorder ? "border-t border-white/5" : ""
      }`}
    >
      <span className="min-w-0">
        <span className="block text-[1.03rem] font-semibold leading-snug text-[#F4F4F5]">
          {service.name}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-white/50 line-clamp-1">
          {service.metaDescription}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-3.5">
        <span className="text-[0.72rem] font-semibold tracking-[0.16em] text-white/50 [font-feature-settings:'tnum']">
          {service.priceRange}
        </span>
        <ArrowRight
          className="h-4 w-4 text-df-gold transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export default function ServicesClient({ services }: Props) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Group services
  const grouped = CATEGORY_ORDER.reduce<Record<string, Service[]>>((acc, cat) => {
    const items = services.filter((s) => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Mouse tracking inside container
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  // GSAP Entrance Animations
  useEffect(() => {
    // Fade in sections smoothly
    gsap.fromTo(
      ".animate-fade-in",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, []);

  // Cover image d'une catégorie = première image de couverture disponible
  const categoryCover = (items: Service[]) => items.find((s) => s.coverImageUrl) ?? null;

  const videoItems = grouped["video"];
  const photoItems = grouped["photo"];
  const motionItems = grouped["motion"];
  const audioItems = grouped["audio"];

  /* Grande carte catégorie (cover + liste de services) */
  const renderBigCard = (catKey: "video" | "photo", items: Service[]) => {
    const meta = CATEGORY_LABELS[catKey];
    if (!meta) return null;
    const cover = categoryCover(items);
    return (
      <section
        aria-labelledby={`cat-${catKey}`}
        className="animate-fade-in flex flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0A0A1C]"
      >
        <div className="relative min-h-[200px] flex-none bg-[#2E4239] md:min-h-[240px] md:flex-1">
          {cover?.coverImageUrl && (
            <Image
              src={cover.coverImageUrl}
              alt={cover.coverImageAlt || meta.label}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          )}
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,28,0.2)_0%,rgba(10,10,28,0.9)_100%)]"
            aria-hidden="true"
          />
          <div className="absolute bottom-5 left-5 flex items-baseline gap-3.5 md:left-7">
            <span className="text-[clamp(1.25rem,2vw,1.625rem)] font-extrabold text-df-gold [font-feature-settings:'tnum']">
              {meta.tag}
            </span>
            <h2
              id={`cat-${catKey}`}
              className="font-display text-[clamp(1.35rem,2.6vw,1.875rem)] font-extrabold uppercase tracking-[-0.015em] text-[#F4F4F5]"
            >
              {meta.label}
            </h2>
          </div>
          <span className="absolute bottom-6 right-6 hidden text-xs font-semibold uppercase tracking-[0.12em] text-white/70 sm:block">
            {items.length} service{items.length > 1 ? "s" : ""}
          </span>
        </div>
        <p className="border-b border-white/5 px-4 pb-3 pt-4 text-sm leading-relaxed text-white/55 md:px-7">
          {meta.desc}
        </p>
        <div className="flex flex-col p-3">
          {items.map((s, i) => (
            <ServiceRow
              key={s.slug}
              service={s}
              withTopBorder={i > 0}
              onEnter={() => setHoveredImage(s.coverImageUrl)}
              onLeave={() => setHoveredImage(null)}
            />
          ))}
        </div>
      </section>
    );
  };

  /* Petite carte catégorie (numéro + titre + service unique) */
  const renderSmallCard = (catKey: "motion" | "audio", items: Service[]) => {
    const meta = CATEGORY_LABELS[catKey];
    if (!meta) return null;
    return (
      <section
        aria-labelledby={`cat-${catKey}`}
        className="animate-fade-in flex flex-col gap-3.5 rounded-[18px] border border-white/[0.08] bg-[#0A0A1C] p-6"
      >
        <span className="text-[1.375rem] font-extrabold text-df-gold [font-feature-settings:'tnum']">
          {meta.tag}
        </span>
        <h2
          id={`cat-${catKey}`}
          className="font-display text-[1.3125rem] font-extrabold uppercase leading-[1.1] tracking-[-0.01em] text-[#F4F4F5]"
        >
          {meta.label}
        </h2>
        <p className="text-[0.84rem] leading-relaxed text-white/55">{meta.desc}</p>
        <div className="mt-auto flex flex-col gap-2">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              onMouseEnter={() => setHoveredImage(s.coverImageUrl)}
              onMouseLeave={() => setHoveredImage(null)}
              className="group flex min-h-[44px] items-center justify-between gap-3 rounded-[10px] border border-white/[0.06] px-3.5 py-3 transition-colors duration-200 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-df-gold"
            >
              <span className="min-w-0">
                <span className="block text-[0.91rem] font-semibold leading-tight text-[#F4F4F5]">
                  {s.name}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-white/50 line-clamp-1">
                  {s.metaDescription}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="text-[0.72rem] font-semibold tracking-[0.16em] text-white/50 [font-feature-settings:'tnum']">
                  {s.priceRange}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-df-gold transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-screen bg-[#0E0E22] text-white"
    >
      {/* Floating Image Preview */}
      <div
        className="pointer-events-none absolute z-50 hidden h-48 w-80 overflow-hidden rounded-xl border border-white/10 bg-[#1A1A2E] shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:block"
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: `translate(-50%, -50%) scale(${hoveredImage ? 1 : 0.85})`,
          opacity: hoveredImage ? 0.95 : 0,
          transition: "left 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease-out",
        }}
      >
        {hoveredImage && (
          <Image
            src={hoveredImage}
            alt="Preview"
            fill
            className="object-cover"
            sizes="320px"
          />
        )}
      </div>

      <main className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:px-16">
        {/* Breadcrumb */}
        <div className="animate-fade-in mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-df-gold transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-df-gold">Services</span>
        </div>

        {/* Hero */}
        <header className="animate-fade-in mb-14 md:mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-df-gold" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-df-gold">
              Notre savoir-faire
            </span>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h1 className="font-display text-[clamp(2.6rem,7vw,5.25rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.03em] text-[#F4F4F5]">
              Ce qu&apos;on cadre. <br />
              <span className="text-df-gold">Vraiment bien.</span>
            </h1>
            <p className="mb-1 max-w-[44ch] text-base leading-relaxed text-white/60 md:text-[1.0625rem]">
              De la direction artistique initiale à la livraison finale étalonnée. Nous combinons l&apos;exigence artistique d&apos;un studio de production et la réactivité d&apos;un interlocuteur freelance dédié.
            </p>
          </div>
        </header>

        {/* Bento catégories */}
        <div className="flex flex-col gap-5">
          {/* Rangée haute : Production vidéo + Photographie */}
          {(videoItems || photoItems) && (
            <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_1fr]">
              {videoItems && renderBigCard("video", videoItems)}
              {photoItems && renderBigCard("photo", photoItems)}
            </div>
          )}

          {/* Rangée basse : Motion design + Post-prod audio + encart devis */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.15fr]">
            {motionItems && renderSmallCard("motion", motionItems)}
            {audioItems && renderSmallCard("audio", audioItems)}
            <section
              aria-labelledby="devis-hybride"
              className="animate-fade-in flex flex-col items-start justify-between gap-5 rounded-[18px] border border-df-gold/25 bg-df-gold/5 p-6 md:col-span-2 md:p-7 lg:col-span-1"
            >
              <div className="flex flex-col gap-1.5">
                <h2
                  id="devis-hybride"
                  className="font-display text-lg font-extrabold uppercase tracking-[-0.01em] text-[#F4F4F5]"
                >
                  Un projet hybride ?
                </h2>
                <p className="text-[0.84rem] leading-relaxed text-white/60">
                  Devis gratuit sous 24h, 2 retours inclus.
                </p>
              </div>
              <Link
                href="/devis"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-df-gold px-7 py-3.5 text-sm font-bold text-[#1A1408] shadow-[0_8px_22px_-8px_rgba(243,107,31,0.6)] transition hover:bg-df-gold/90 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-df-gold"
              >
                Demander un devis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>
          </div>
        </div>

        {/* Pôles d'expertise (Editorial Grid) */}
        <section className="animate-fade-in mt-28 border-t border-white/[0.08] pt-16">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-px w-8 bg-df-gold" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-df-gold">
              Pôles d&apos;expertise
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/agence-communication-orleans"
              className="group relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0A0A1C] p-8 transition hover:border-df-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-df-gold"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-df-gold/5 blur-3xl group-hover:bg-df-gold/10 transition-colors" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-df-gold">Pôle Conseil &amp; Stratégie</span>
              <h3 className="font-display mt-3 text-lg font-extrabold uppercase tracking-[-0.01em] text-white group-hover:text-df-gold transition-colors md:text-xl">
                Agence de communication à Orléans
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Stratégie visuelle, création de contenus vidéo réguliers, gestion publicitaire sur les réseaux sociaux et événementiel : l&apos;accompagnement à 360° de votre marque.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-df-gold">
                <span>En savoir plus</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </Link>

            <Link
              href="/photographe-evenementiel"
              className="group relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0A0A1C] p-8 transition hover:border-df-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-df-gold"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#16a34a]/5 blur-3xl group-hover:bg-[#16a34a]/10 transition-colors" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#4ade80]">Pôle Reportage &amp; Live</span>
              <h3 className="font-display mt-3 text-lg font-extrabold uppercase tracking-[-0.01em] text-white group-hover:text-[#4ade80] transition-colors md:text-xl">
                Photographe événementiel Orléans &amp; Tours
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Séminaires, conventions, soirées de gala et salons professionnels : reportage photo dynamique et aftermovie vidéo cinématographique de vos événements d&apos;entreprise.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#4ade80]">
                <span>En savoir plus</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </section>

        {/* Le Processus (Minimal Timeline) */}
        <section className="animate-fade-in mt-28 border-t border-white/[0.08] pt-16">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-px w-8 bg-df-gold" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-df-gold">
              Notre méthode
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Échange & Stratégie",
                text: "Nous cadrons vos besoins, définissons le brief créatif, le format d'export et planifions la logistique.",
              },
              {
                step: "02",
                title: "Production & Tournage",
                text: "Captation cinéma 4K dans vos locaux ou production graphique en motion design. Nous gérons tout de A à Z.",
              },
              {
                step: "03",
                title: "Post-Production & Restitution",
                text: "Montage rythmé, étalonnage DaVinci Resolve, sound design complet et livraison finale optimisée sous 14 jours.",
              },
            ].map((item) => (
              <div key={item.step} className="group relative border-l border-white/[0.08] pl-6 hover:border-df-gold transition-colors duration-300">
                <span className="block text-sm font-extrabold text-df-gold [font-feature-settings:'tnum']">
                  {item.step}
                </span>
                <h3 className="font-display mt-2 text-sm font-extrabold uppercase tracking-wider text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Intervention zone */}
        <section className="animate-fade-in mt-16 rounded-[18px] border border-white/[0.08] bg-[#0A0A1C] p-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-df-gold" aria-hidden="true" />
            <p className="text-sm text-white/60 leading-relaxed">
              <span className="font-semibold text-white">Zone d&apos;intervention :</span> Orléans, Tours, Blois, Chartres, Bourges — l&apos;ensemble de la région Centre-Val de Loire.
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="animate-fade-in relative mt-28 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0A0A1C] p-8 text-center md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,107,31,0.05)_0%,transparent_70%)]" aria-hidden="true" />
          <h2 className="font-display text-[clamp(1.35rem,3vw,1.875rem)] font-extrabold uppercase tracking-[-0.015em] text-white">
            Prêt à cadrer votre projet ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/55 leading-relaxed">
            Obtenez une simulation budgétaire gratuite pour votre projet en moins de 2 minutes. Devis détaillé sous 24h ouvrées.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/devis"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-df-gold px-8 py-3.5 text-sm font-bold text-[#1A1408] shadow-[0_8px_22px_-8px_rgba(243,107,31,0.6)] transition hover:bg-df-gold/90 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-df-gold"
            >
              Simuler mon devis
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-df-gold"
            >
              Nous contacter
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
