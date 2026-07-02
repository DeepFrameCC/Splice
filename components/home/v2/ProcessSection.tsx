"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  id: string;
  num: string;
  title: string;
  desc: string;
  metric: string;
  details: string[];
}

const STEPS: Step[] = [
  {
    id: "step-1",
    num: "01",
    title: "Brief & découverte",
    desc: "On échange ensemble pour comprendre votre projet, vos objectifs et votre cible, puis on définit le cadre précis de la prestation.",
    metric: "Cadrage du projet",
    details: ["Échange sur vos objectifs", "Définition de votre cible", "Cadre de la prestation validé"],
  },
  {
    id: "step-2",
    num: "02",
    title: "Tournage & capture",
    desc: "On se déplace sur site ou on travaille à distance selon la prestation. On filme, photographie ou enregistre avec notre matériel.",
    metric: "Sur site ou à distance",
    details: ["Déplacement ou travail à distance", "Vidéo, photo ou audio", "Captation avec notre matériel"],
  },
  {
    id: "step-3",
    num: "03",
    title: "Montage & post-production",
    desc: "Montage vidéo sur DaVinci Resolve, étalonnage colorimétrique et sound design. Motion graphics sur After Effects si le projet le demande.",
    metric: "DaVinci Resolve & After Effects",
    details: ["Montage & étalonnage DaVinci Resolve", "Sound design soigné", "Motion graphics After Effects"],
  },
  {
    id: "step-4",
    num: "04",
    title: "Livraison & retours",
    desc: "Export aux formats de chaque plateforme (YouTube, Instagram, TikTok, LinkedIn), retours via notre plateforme sécurisée et fichiers SRT inclus.",
    metric: "Multi-plateformes, SRT inclus",
    details: ["Export YouTube, Instagram, TikTok, LinkedIn", "Retours sur plateforme sécurisée", "Fichiers de sous-titres SRT inclus"],
  },
];

/**
 * ProcessSection — timeline horizontale 4 étapes (maquette accueil.html) :
 * ligne 1px, points 11px orange (plein pour l'étape 01, creux ensuite),
 * titres « 01 · Brief & découverte ». Contenu inchangé.
 */
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
      className="relative border-t border-white/[0.06] bg-[#0A0A1C] py-24"
      aria-label="Notre processus de travail"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="df-process-anim-header mb-14 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F36B1F]">
            Méthodologie
          </span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[-0.025em] text-white md:text-5xl">
            Notre processus en 4 étapes<span className="text-[#F36B1F]">.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 lg:mx-0">
            De la première prise de contact à la livraison finale, voici comment on travaille sur chaque projet vidéo ou photo, sans jargon ni mauvaise surprise.
          </p>
        </div>

        {/* Timeline horizontale */}
        <div className="df-process-grid relative grid gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* Ligne de la timeline (desktop) */}
          <div className="absolute left-0 right-0 top-[5px] hidden h-px bg-white/[0.12] lg:block" aria-hidden="true" />

          {STEPS.map((step, i) => (
            <div key={step.id} className="df-process-card relative flex flex-col gap-4 pt-6">
              {/* Point de timeline : plein (étape 01) ou creux */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 box-border h-[11px] w-[11px] rounded-full ${
                  i === 0 ? "bg-[#F36B1F]" : "border-2 border-[#F36B1F] bg-[#0A0A1C]"
                }`}
              />

              <h3 className="text-[clamp(18px,1.6vw,21px)] font-bold tracking-[-0.01em] text-[#F4F4F5]">
                <span className="tabular-nums">{step.num}</span> · {step.title}
              </h3>

              <p className="text-sm leading-[1.55] text-white/[0.58]">
                {step.desc}
              </p>

              <div className="mt-auto flex flex-col gap-4">
                {/* Metric / Reassurance */}
                <div>
                  <span className="inline-block rounded-full border border-[#F36B1F]/20 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-[#F36B1F]">
                    {step.metric}
                  </span>
                </div>

                {/* Details Bullet Points */}
                <ul className="space-y-2 text-xs text-white/50">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3 w-3 shrink-0 text-[#F36B1F]/70" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
