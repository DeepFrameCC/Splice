"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function LandingAnimations() {
  useGSAP(() => {
    // Respecter prefers-reduced-motion
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Hero — entrée cinématique ────────────────────────────────
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from(".df-hero-meta",  { opacity: 0, y: 18, duration: 0.6, ease: "power2.out" })
        .from(".df-hero-title", { opacity: 0, y: 52, duration: 1.0, ease: "expo.out" }, "-=0.3")
        .from(".df-hero-sub",   { opacity: 0, y: 28, duration: 0.7, ease: "power3.out" }, "-=0.6")
        .from(".df-hero-cta > *", { opacity: 0, y: 18, stagger: 0.12, duration: 0.5, ease: "power2.out" }, "-=0.5")
        .from(".df-hero-frame", { opacity: 0, scale: 0.96, x: 30, duration: 0.9, ease: "power3.out" }, "-=0.9");

      // ── Hero frame — parallaxe au scroll ────────────────────────
      gsap.to(".df-hero-frame", {
        y: 90,
        ease: "none",
        scrollTrigger: {
          trigger: ".df-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });

      // ── Video Reel Band ─────────────────────────────────────────
      const vrTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".df-vr",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      vrTl
        .from(".df-vr-eyebrow", { opacity: 0, y: 16, duration: 0.6, ease: "power2.out" })
        .from(".df-vr-title",   { opacity: 0, y: 48, duration: 1.0, ease: "expo.out" }, "-=0.3")
        .from(".df-vr-btn",     { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.5");

      // Parallaxe légère : le fond monte plus vite que le contenu
      gsap.to(".df-vr-placeholder, .df-vr-video", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ".df-vr",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // ── About ───────────────────────────────────────────────────
      gsap.from(".df-about-grid > *", {
        scrollTrigger: { trigger: ".df-about-grid", start: "top 78%", toggleActions: "play none none none" },
        opacity: 0,
        y: 40,
        stagger: 0.18,
        duration: 0.85,
        ease: "power3.out",
      });

      gsap.from(".df-stats > div", {
        scrollTrigger: { trigger: ".df-stats", start: "top 82%", toggleActions: "play none none none" },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.65,
        ease: "power2.out",
      });

      // ── Services ────────────────────────────────────────────────
      gsap.from(".df-service", {
        scrollTrigger: { trigger: ".df-services-grid", start: "top 78%", toggleActions: "play none none none" },
        opacity: 0,
        y: 48,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });

      // ── Projets — batch au scroll ────────────────────────────────
      ScrollTrigger.batch(".df-project", {
        start: "top 88%",
        onEnter: (elements) =>
          gsap.from(elements, {
            opacity: 0,
            y: 34,
            stagger: 0.07,
            duration: 0.72,
            ease: "power2.out",
          }),
      });

      // ── Témoignages ─────────────────────────────────────────────
      gsap.from(".df-testimonial", {
        scrollTrigger: { trigger: ".df-testimonials-grid", start: "top 80%", toggleActions: "play none none none" },
        opacity: 0,
        y: 32,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
      });

      // ── Tarifs ──────────────────────────────────────────────────
      gsap.from(".df-plan", {
        scrollTrigger: { trigger: ".df-pricing-grid", start: "top 80%", toggleActions: "play none none none" },
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.8,
        ease: "back.out(1.1)",
      });

      // ── CTA devis — fond parallaxe léger ────────────────────────
      gsap.from(".df-quote-card", {
        scrollTrigger: { trigger: ".df-quote-card", start: "top 82%", toggleActions: "play none none none" },
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
      });
    });

    // Version réduite si prefers-reduced-motion activé
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.from(
        ".df-hero-title, .df-hero-sub, .df-hero-meta, .df-hero-cta > *, .df-hero-frame",
        { opacity: 0, duration: 0.4, stagger: 0.05 }
      );
    });
  });

  return null;
}
