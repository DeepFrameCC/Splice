"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ClipboardList, Camera, Film, BarChart3, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  id: string;
  num: string;
  title: string;
  desc: string;
  metric: string;
  icon: React.ComponentType<any>;
  details: string[];
}

const STEPS: Step[] = [
  {
    id: "step-1",
    num: "01",
    title: "Cadrage Stratégique",
    desc: "Définition des indicateurs de performance (KPIs) de la vidéo (notoriété, conversion, recrutement) et rédaction d'un script détaillé.",
    metric: "Cadrage & Planification",
    icon: ClipboardList,
    details: ["Script complet rédigé", "Storyboard & Moodboard", "Cibles & objectifs de conversion"],
  },
  {
    id: "step-2",
    num: "02",
    title: "Tournage Agile",
    desc: "Déploiement de matériel cinéma de pointe (Sony FX3/FX6 4K, captation drone homologuée, lumières LED Aputure) avec une équipe resserrée et réactive.",
    metric: "Production Premium",
    icon: Camera,
    details: ["Caméras Cinéma 4K", "Drone homologué DGAC", "Directeurs artistiques sur place"],
  },
  {
    id: "step-3",
    num: "03",
    title: "Post-Production",
    desc: "Montage dynamique, étalonnage couleur professionnel, sound design immersif et habillage graphique sur mesure (motion design).",
    metric: "2 allers-retours inclus",
    icon: Film,
    details: ["Montage rythmé multi-format", "Étalonnage & Sound design", "Habillage motion design"],
  },
  {
    id: "step-4",
    num: "04",
    title: "Impact & Repurposing",
    desc: "Conseils stratégiques pour la diffusion, recyclage de formats (vidéos sources déclinées en Reels/TikToks) et analyse de performance.",
    metric: "Recyclage multi-réseau",
    icon: BarChart3,
    details: ["Formats 9:16 verticaux inclus", "Adaptation réseaux sociaux", "Analyse de complétion"],
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(".df-process-anim", { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          ".df-process-anim-header",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          ".df-process-card",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".df-process-grid",
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [reduced], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/[0.06] bg-df-night py-24"
      aria-label="Notre processus de travail"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="df-process-anim-header mb-16 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F36B1F]">
            Méthodologie
          </span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-5xl">
            Notre processus en 4 étapes<span className="text-[#F36B1F]">.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
            Nous combinons la vision stratégique d&apos;une agence et l&apos;agilité d&apos;un studio créatif pour assurer l&apos;impact de vos campagnes, de la conception à la diffusion.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="df-process-grid grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="df-process-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-sm transition-all duration-300 hover:border-[#F36B1F]/30 hover:bg-white/[0.04]"
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#F36B1F] to-[#FF7A00] transition-all duration-300 group-hover:w-full" />

                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-light text-white/20 transition-colors duration-300 group-hover:text-[#F36B1F]/30">
                      {step.num}
                    </span>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-white/70 transition-all duration-300 group-hover:border-[#F36B1F]/30 group-hover:text-[#F36B1F]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display mt-6 text-xl uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-[#F36B1F]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/55">
                    {step.desc}
                  </p>
                </div>

                <div>
                  <div className="my-5 h-[1px] bg-white/[0.06]" />

                  {/* Metric / Reassurance */}
                  <div className="mb-4">
                    <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-semibold text-[#F36B1F]/90">
                      {step.metric}
                    </span>
                  </div>

                  {/* Details Bullet Points */}
                  <ul className="space-y-2 text-[10px] text-white/45">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-[#F36B1F]/60" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
