"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface RibbonCell {
  slug: string;
  poster: string;
  tag: string;
  /** Accessible link name — must be unique so identical tags don't collide. */
  label: string;
  ratio: "16/9" | "9/16" | "4/3";
}

/**
 * Ribbon data — mixed-ratio cells from available project posters.
 * Order crafted for visual rhythm (alternate wide/tall/square).
 */
const CDN = "https://media.splicestudio.fr";

const ribbonCells: RibbonCell[] = [
  { slug: "bistrot-orleans", poster: `${CDN}/thumb/thumb-bistrot-orleans.jpg`, tag: "Pub locale", label: "Pub locale — Bistrot Orléans", ratio: "9/16" },
  { slug: "porsche-hexlight", poster: "/photos/porsche-hexlight.webp", tag: "Shooting auto", label: "Shooting auto — Porsche Hexlight", ratio: "4/3" },
  { slug: "interview-cklean-auto", poster: `${CDN}/thumb/thumb-interview-cklean-auto.jpg`, tag: "Interview", label: "Interview — CK Clean Auto", ratio: "4/3" },
  { slug: "porsche-studio", poster: "/photos/porsche-studio-1.webp", tag: "Shooting auto", label: "Shooting auto — Porsche Studio", ratio: "16/9" },
];

const CELL_HEIGHT = 280;
const RATIO_MAP = { "16/9": 16 / 9, "9/16": 9 / 16, "4/3": 4 / 3 };

/**
 * Director's Cut Ribbon — horizontal scroll rail of mixed-ratio project posters.
 * Snap scroll, magnify on hover, floating tag. No hover-play (differentiates from SceneSelector).
 * Links to /galerie.
 */
export default function DirectorsCutRibbon() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(".df-dcr-anim", { opacity: 1 });
          return;
        }

        gsap.fromTo(
          ".df-dcr-anim",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
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
      className="df-dcr"
      aria-label="Travaux récents Splice"
    >
      <div className="df-dcr-head df-dcr-anim">
        <span className="df-dcr-eyebrow">Travaux récents</span>
      </div>

      <div className="df-dcr-track df-scroll-hidden df-dcr-anim">
        {ribbonCells.map((cell) => {
          const width = Math.round(CELL_HEIGHT * RATIO_MAP[cell.ratio]);

          return (
            <Link
              key={cell.slug}
              href={`/galerie?ref=${cell.slug}`}
              className="df-dcr-cell"
              style={{ width, height: CELL_HEIGHT }}
              aria-label={cell.label}
            >
              <Image
                src={cell.poster}
                alt={cell.label}
                width={width * 2}
                height={CELL_HEIGHT * 2}
                className="df-dcr-poster"
                sizes="(max-width: 768px) 60vw, 500px"
                loading="lazy"
              />
              <div className="df-dcr-grain" aria-hidden="true" />
              <span className="df-dcr-tag">{cell.tag}</span>
            </Link>
          );
        })}
      </div>

      <div className="df-dcr-foot df-dcr-anim">
        <Link href="/galerie" className="df-dcr-link">
          Voir toute la galerie →
        </Link>
      </div>
    </section>
  );
}
