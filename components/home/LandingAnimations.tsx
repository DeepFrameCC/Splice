"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Animations scroll de la landing V2.
 * Seule la révélation des témoignages vit encore ici (cible .df-testimonial /
 * .df-testimonials-grid — voir TestimonialsSlider). Les anciennes cibles
 * .df-hero / .df-vr / .df-about / .df-services / .df-plan ont disparu avec la
 * refonte Outfit : leurs timelines ont été supprimées pour éviter de créer
 * des ScrollTriggers orphelins à chaque visite.
 */
export default function LandingAnimations() {
  useGSAP(() => {
    // Respecter prefers-reduced-motion
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Témoignages ─────────────────────────────────────────────
      gsap.from(".df-testimonial", {
        scrollTrigger: { trigger: ".df-testimonials-grid", start: "top 80%", toggleActions: "play none none none" },
        opacity: 0,
        y: 32,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
      });
    });

    // Version réduite si prefers-reduced-motion activé
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.from(".df-testimonial", { opacity: 0, duration: 0.4, stagger: 0.05 });
    });
  });

  return null;
}
