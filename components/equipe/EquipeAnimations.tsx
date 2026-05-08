"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function EquipeAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── Animations completes ────────────────────────────────────
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Hero — entree sequentielle cinematique ──────────────────
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from('[data-anim="hero-title"]', {
          opacity: 0,
          y: 52,
          duration: 1,
          ease: "expo.out",
        })
        .from(
          '[data-anim="hero-sub"]',
          { opacity: 0, y: 28, duration: 0.7, ease: "power3.out" },
          "-=0.6"
        )
        .from(
          '[data-anim="hero-anchors"] > *',
          {
            opacity: 0,
            y: 18,
            stagger: 0.1,
            duration: 0.55,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // ── Fondateurs — reveler chaque section au scroll ───────────
      const founderSections = gsap.utils.toArray<HTMLElement>(
        '[data-anim="founder-section"]'
      );

      founderSections.forEach((section) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });

        // Carte initiale : slide depuis la gauche + scale
        const card = section.querySelector('[data-anim="founder-card"]');
        if (card) {
          tl.from(card, {
            opacity: 0,
            x: -60,
            scale: 0.85,
            duration: 0.9,
            ease: "back.out(1.4)",
          });
        }

        // Nom + role : fade-up
        const info = section.querySelector('[data-anim="founder-info"]');
        if (info) {
          tl.from(
            info,
            { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" },
            "-=0.5"
          );
        }

        // Tags specs : stagger
        const specs = section.querySelectorAll(
          '[data-anim="founder-specs"] > *'
        );
        if (specs.length) {
          tl.from(
            specs,
            {
              opacity: 0,
              y: 14,
              stagger: 0.06,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.35"
          );
        }

        // Bloc bio : fade-up
        const bio = section.querySelector('[data-anim="founder-bio"]');
        if (bio) {
          tl.from(
            bio,
            { opacity: 0, y: 28, duration: 0.7, ease: "power3.out" },
            "-=0.3"
          );
        }

        // Titre "Realisations" : fade-up
        const galleryTitle = section.querySelector(
          '[data-anim="founder-gallery-title"]'
        );
        if (galleryTitle) {
          tl.from(
            galleryTitle,
            { opacity: 0, y: 20, duration: 0.55, ease: "power2.out" },
            "-=0.2"
          );
        }

        // Cartes medias : batch stagger
        const galleryItems = section.querySelectorAll(
          '[data-anim="founder-gallery"] > *'
        );
        if (galleryItems.length) {
          tl.from(
            galleryItems,
            {
              opacity: 0,
              y: 34,
              scale: 0.96,
              stagger: 0.08,
              duration: 0.65,
              ease: "power3.out",
            },
            "-=0.25"
          );
        }
      });

      // ── CTA — fade-up au scroll ────────────────────────────────
      gsap.from('[data-anim="cta"]', {
        scrollTrigger: {
          trigger: '[data-anim="cta"]',
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 44,
        duration: 0.85,
        ease: "power3.out",
      });
    });

    // ── Version reduite (prefers-reduced-motion) ─────────────────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Hero : simple fade
      gsap.from(
        '[data-anim="hero-title"], [data-anim="hero-sub"], [data-anim="hero-anchors"]',
        { opacity: 0, duration: 0.35, stagger: 0.05 }
      );

      // Fondateurs : simple opacity au scroll
      ScrollTrigger.batch('[data-anim="founder-section"]', {
        start: "top 85%",
        onEnter: (elements) =>
          gsap.from(elements, { opacity: 0, duration: 0.4 }),
      });

      // CTA : simple fade
      gsap.from('[data-anim="cta"]', {
        scrollTrigger: {
          trigger: '[data-anim="cta"]',
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        duration: 0.35,
      });
    });
  });

  return null;
}
