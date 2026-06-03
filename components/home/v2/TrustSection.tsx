"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MapPin, CheckCircle, Video, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Partner {
  name: string;
  location: string;
}

const PARTNERS: Partner[] = [
  { name: "Pixel 404", location: "Orléans" },
  { name: "CK Clean Auto", location: "Saran" },
  { name: "Bistrot Croix Morin", location: "Orléans" },
  { name: "Métropole d'Orléans", location: "Loiret" },
  { name: "Concession Verneuil", location: "Tours" },
  { name: "Maison Lalou", location: "Sancerre" },
  { name: "Atelier Joaillier", location: "Tours" },
  { name: "Roastery #4", location: "Orléans" },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(".df-trust-anim", { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          ".df-trust-anim",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Infinite scroll animation for partner logos
        const track = document.querySelector(".df-trust-track");
        if (track) {
          const width = track.scrollWidth / 2;
          gsap.to(".df-trust-track", {
            x: -width,
            duration: 20,
            ease: "none",
            repeat: -1,
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    },
    { dependencies: [reduced], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/[0.06] bg-[#0E0E22] py-20 overflow-hidden"
      aria-label="Confiance locale et chiffres clés"
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {/* Stat 1 */}
          <div className="df-trust-anim flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="rounded-xl bg-[#F36B1F]/10 p-3 text-[#F36B1F]">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <span className="block font-display text-3xl font-bold text-white">+50</span>
              <span className="block mt-1 text-xs text-white/50 font-semibold uppercase tracking-wider">Vidéos réalisées</span>
              <span className="block mt-1 text-xs text-white/40">Partout en Région Centre-Val de Loire.</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="df-trust-anim flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="rounded-xl bg-[#F36B1F]/10 p-3 text-[#F36B1F]">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="block font-display text-3xl font-bold text-white">100%</span>
              <span className="block mt-1 text-xs text-white/50 font-semibold uppercase tracking-wider">Clients satisfaits</span>
              <span className="block mt-1 text-xs text-white/40">Accompagnement réactif et 2 retours inclus.</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="df-trust-anim flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="rounded-xl bg-[#F36B1F]/10 p-3 text-[#F36B1F]">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <span className="block font-display text-3xl font-bold text-white">Loiret &amp; 37</span>
              <span className="block mt-1 text-xs text-white/50 font-semibold uppercase tracking-wider">Intervention locale</span>
              <span className="block mt-1 text-xs text-white/40">Présence physique à Orléans &amp; Tours.</span>
            </div>
          </div>
        </div>

        {/* Section title for partners */}
        <div className="df-trust-anim text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F36B1F]">
            Ancrage régional
          </span>
          <h3 className="mt-2 font-display text-xl uppercase tracking-tight text-white/70">
            Ils nous font confiance pour leur image
          </h3>
        </div>

        {/* Scrolling Partner Row */}
        <div className="df-trust-anim relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-[#0E0E22] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-[#0E0E22] after:to-transparent">
          <div className="df-trust-track flex w-max gap-8 py-4">
            {/* Render partners list twice for seamless infinite scroll */}
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.01] px-5 py-3 shadow-sm transition hover:border-[#F36B1F]/20 hover:bg-white/[0.03]"
              >
                <Award className="h-3.5 w-3.5 text-[#F36B1F]/70" />
                <span className="text-xs font-bold text-white/80">{partner.name}</span>
                <span className="text-[10px] text-white/40">({partner.location})</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
