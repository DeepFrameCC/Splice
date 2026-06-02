"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Compass, MapPin } from "lucide-react";
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

export default function ServicesClient({ services }: Props) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);

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

  return (
    <div ref={containerRef} onPointerMove={handlePointerMove} className="relative min-h-screen bg-[#0E0E22] text-white">
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

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <div className="animate-fade-in mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          <Link href="/" className="hover:text-df-gold transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <span className="text-df-gold">Services</span>
        </div>

        {/* Hero */}
        <header className="animate-fade-in mb-24 max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
              Notre savoir-faire
            </span>
          </div>
          <h1
            ref={titleRef}
            className="font-display text-4xl uppercase tracking-tight text-white md:text-7xl leading-[0.95]"
          >
            Ce qu&apos;on cadre. <br className="hidden md:inline" />
            <em>Vraiment bien.</em>
          </h1>
          <p
            ref={introRef}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
          >
            De la direction artistique initiale à la livraison finale étalonnée. Nous combinons l&apos;exigence artistique d&apos;un studio de production et la réactivité d&apos;un interlocuteur freelance dédié.
          </p>
        </header>

        {/* Categories Section (Asymmetric) */}
        <div className="space-y-24">
          {CATEGORY_ORDER.map((catKey) => {
            const items = grouped[catKey];
            const meta = CATEGORY_LABELS[catKey];
            if (!items || !meta) return null;

            return (
              <section
                key={catKey}
                className="animate-fade-in grid gap-8 border-t border-white/[0.06] pt-12 md:grid-cols-3"
              >
                {/* Left Side: Sticky Category Details */}
                <div className="md:sticky md:top-24 md:h-fit">
                  <span className="font-display text-2xl font-bold tracking-tight text-df-gold">
                    {meta.tag} /
                  </span>
                  <h2 className="font-display mt-2 text-xl font-medium uppercase tracking-wider text-white">
                    {meta.label}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-white/40 max-w-[240px]">
                    {meta.desc}
                  </p>
                </div>

                {/* Right Side: Services List */}
                <div className="space-y-1 md:col-span-2">
                  {items.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex flex-col justify-between border-b border-white/[0.04] py-6 transition-all hover:border-df-gold/30 sm:flex-row sm:items-center sm:py-7"
                      onMouseEnter={() => setHoveredImage(s.coverImageUrl)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      <div className="max-w-md">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-white group-hover:text-df-gold transition-colors duration-300 md:text-lg">
                            {s.name}
                          </h3>
                          <span className="text-[10px] font-mono tracking-widest text-white/20 uppercase">
                            {s.priceRange}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-white/50 line-clamp-1">
                          {s.metaDescription}
                        </p>
                      </div>

                      {/* Right Link arrow */}
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/30 group-hover:text-df-gold transition-all duration-300 sm:mt-0">
                        <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Explorer
                        </span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Pôles d'expertise (Editorial Grid) */}
        <section className="animate-fade-in mt-32 border-t border-white/[0.06] pt-16">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
              Pôles d&apos;expertise
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/agence-communication-orleans"
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15152A] p-8 shadow-sm transition hover:shadow-md hover:border-df-gold/20"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-df-gold/5 blur-3xl group-hover:bg-df-gold/10 transition-colors" />
              <span className="text-[10px] font-mono tracking-widest text-df-gold uppercase">Pôle Conseil &amp; Stratégie</span>
              <h3 className="font-display mt-3 text-lg font-medium uppercase text-white group-hover:text-df-gold transition-colors md:text-xl">
                Agence de communication à Orléans
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                Stratégie visuelle, création de contenus vidéo réguliers, gestion publicitaire sur les réseaux sociaux et événementiel : l&apos;accompagnement à 360° de votre marque.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-df-gold">
                <span>En savoir plus</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/photographe-evenementiel"
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15152A] p-8 shadow-sm transition hover:shadow-md hover:border-df-gold/20"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#16a34a]/5 blur-3xl group-hover:bg-[#16a34a]/10 transition-colors" />
              <span className="text-[10px] font-mono tracking-widest text-[#16a34a] uppercase">Pôle Reportage &amp; Live</span>
              <h3 className="font-display mt-3 text-lg font-medium uppercase text-white group-hover:text-[#16a34a] transition-colors md:text-xl">
                Photographe événementiel Orléans &amp; Tours
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                Séminaires, conventions, soirées de gala et salons professionnels : reportage photo dynamique et aftermovie vidéo cinématographique de vos événements d&apos;entreprise.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#16a34a]">
                <span>En savoir plus</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* Le Processus (Minimal Timeline) */}
        <section className="animate-fade-in mt-32 border-t border-white/[0.06] pt-16">
          <div className="mb-12 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-df-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
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
              <div key={item.step} className="group relative border-l border-white/[0.06] pl-6 hover:border-df-gold transition-colors duration-300">
                <span className="font-display text-sm font-bold text-df-gold block">
                  {item.step} /
                </span>
                <h3 className="mt-2 text-sm font-semibold text-white uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Intervention zone */}
        <section className="animate-fade-in mt-20 rounded-2xl border border-white/[0.06] bg-[#15152A] p-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-df-gold" aria-hidden="true" />
            <p className="text-xs text-white/60 leading-relaxed">
              <span className="font-semibold text-white">Zone d&apos;intervention :</span> Orléans, Tours, Blois, Chartres, Bourges — l&apos;ensemble de la région Centre-Val de Loire.
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="animate-fade-in mt-32 rounded-2xl border border-white/[0.06] bg-[#15152A] p-8 text-center md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(243,107,31,0.03) 0%, transparent 70%) pointer-events-none" />
          <h2 className="font-display text-xl uppercase tracking-tight text-white md:text-3xl">
            Prêt à cadrer votre projet ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs text-white/50 leading-relaxed">
            Obtenez une simulation budgétaire gratuite pour votre projet en moins de 2 minutes. Devis détaillé sous 24h ouvrées.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/devis"
              className="inline-flex items-center justify-center rounded-full bg-df-gold px-8 py-3 text-xs font-semibold text-black transition hover:bg-df-gold/90 hover:scale-[1.02]"
            >
              Simuler mon devis
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-xs font-semibold text-white transition hover:bg-white/5"
            >
              Nous contacter
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
