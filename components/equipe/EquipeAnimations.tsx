"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function EquipeAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ── Hero — sequential reveal ──────────────────────────────────
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from('[data-anim="eyebrow"]', {
          opacity: 0,
          x: -20,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          '[data-anim="hero-title"]',
          { opacity: 0, y: 52, duration: 1, ease: "expo.out" },
          "-=0.3"
        )
        .from(
          '[data-anim="hero-meta"]',
          { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" },
          "-=0.6"
        );

      // ── Member cards — stagger fade-up on scroll ──────────────────
      ScrollTrigger.batch('[data-anim="member"]', {
        start: "top 82%",
        onEnter: (elements) =>
          gsap.from(elements, {
            opacity: 0,
            y: 50,
            scale: 0.97,
            stagger: 0.12,
            duration: 0.85,
            ease: "power3.out",
          }),
      });

      // ── CTA band — fade-up on scroll ──────────────────────────────
      gsap.from('[data-anim="band"]', {
        scrollTrigger: {
          trigger: '[data-anim="band"]',
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 44,
        duration: 0.85,
        ease: "power3.out",
      });
    });

    // ── Reduced motion ────────────────────────────────────────────────
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.from(
        '[data-anim="eyebrow"], [data-anim="hero-title"], [data-anim="hero-meta"]',
        { opacity: 0, duration: 0.35, stagger: 0.05 }
      );

      ScrollTrigger.batch('[data-anim="member"]', {
        start: "top 85%",
        onEnter: (elements) =>
          gsap.from(elements, { opacity: 0, duration: 0.4 }),
      });

      gsap.from('[data-anim="band"]', {
        scrollTrigger: {
          trigger: '[data-anim="band"]',
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
