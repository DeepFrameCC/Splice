"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scenes } from "@/lib/home/scenes";

gsap.registerPlugin(ScrollTrigger);

interface ServiceCard {
  id: string;
  name: string;
  desc: string;
  href: string;
  /** Slug d'une scène de lib/home/scenes — on réutilise son POSTER (pas la vidéo). */
  mediaSlug: string;
}

const SERVICES: ServiceCard[] = [
  {
    id: "01",
    name: "Pub sociale",
    desc: "Reels & TikToks qui ne se zappent pas. Production récurrente, multi-réseaux.",
    href: "/services/pub-reseaux-sociaux",
    mediaSlug: "presentation-louisia",
  },
  {
    id: "02",
    name: "Shooting auto",
    desc: "Photo & vidéo automobile, en studio mobile ou en décor.",
    href: "/services/shooting-automobile",
    mediaSlug: "luxury-edit",
  },
  {
    id: "03",
    name: "Événementiel",
    desc: "Aftermovie, multicam, captation live. Un film sur mesure, livré chaud.",
    href: "/photographe-evenementiel",
    mediaSlug: "fetes-johanniques-orleans",
  },
  {
    id: "04",
    name: "Photographie",
    desc: "Portraits d'équipe, reportages métier, packshots produits & fiches Google.",
    href: "/services/photographie-professionnelle",
    mediaSlug: "portrait-fleuri",
  },
];

const sceneBySlug = Object.fromEntries(scenes.map((s) => [s.slug, s]));

/**
 * Carte bento avec tilt 3D + reflet (glare) + cartouche verre au survol.
 * Transcription React du script data-tilt de la maquette accueil.html.
 * Désactivé si prefers-reduced-motion (le contenu reste 100 % accessible :
 * le cartouche verre s'affiche aussi au focus clavier via CSS).
 */
function TiltCard({
  href,
  ariaLabel,
  className = "",
  reduced,
  children,
}: {
  href: string;
  ariaLabel: string;
  className?: string;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = ref.current;
    if (!card || reduced) return;
    const r = card.getBoundingClientRect();
    const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    card.style.transition = "transform 0.12s ease-out";
    card.style.transform = `perspective(1100px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 7).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    const glare = card.querySelector<HTMLElement>("[data-glare]");
    if (glare) {
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(460px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.18), rgba(255,255,255,0) 62%)`;
    }
    const glass = card.querySelector<HTMLElement>("[data-glassbg]");
    if (glass) glass.style.opacity = "1";
    const cap = card.querySelector<HTMLElement>("[data-caption]");
    if (cap) cap.style.transform = "translateZ(42px)";
  }

  function onMouseLeave() {
    const card = ref.current;
    if (!card) return;
    card.style.transition = "transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)";
    card.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    const glare = card.querySelector<HTMLElement>("[data-glare]");
    if (glare) glare.style.opacity = "0";
    const glass = card.querySelector<HTMLElement>("[data-glassbg]");
    if (glass) glass.style.opacity = "0";
    const cap = card.querySelector<HTMLElement>("[data-caption]");
    if (cap) cap.style.transform = "translateZ(0px)";
  }

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      className={`df-bt-card ${className}`.trim()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}

export default function CrewStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(".df-cs-anim", { opacity: 1 });
          return;
        }
        gsap.fromTo(
          ".df-cs-anim",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
    <section ref={sectionRef} className="df-cs" aria-label="Services Splice Studio">
      {/* ── Header ── */}
      <div className="df-cs-head">
        <div className="df-cs-anim">
          <span className="df-cs-eyebrow">Services</span>
          <h2 className="df-cs-h2" style={{ marginTop: "clamp(24px, 3vw, 40px)" }}>
            <span className="sr-only">
              Nos services de production vidéo &amp; photographie professionnelle à Orléans &amp; Tours.{" "}
            </span>
            Ce qu&apos;on cadre, <em>vraiment bien</em>
            <span style={{ color: "#F36B1F" }}>.</span>
          </h2>
          <p className="df-cs-intro">
            On vous accompagne de la première idée à la livraison. Quatre services,
            une même exigence : des images qui vous ressemblent.
          </p>
        </div>
      </div>

      {/* ── Bento tilt 3D + cartouche verre ── */}
      <div className="df-cs-bento df-cs-anim">
        {SERVICES.map((s, i) => {
          const media = sceneBySlug[s.mediaSlug];
          return (
            <TiltCard
              key={s.id}
              href={s.href}
              ariaLabel={`Voir le service ${s.name}`}
              className={i === 0 ? "df-bt-tall" : ""}
              reduced={reduced}
            >
              <div className="df-bt-media">
                {media && (
                  <Image
                    src={media.poster}
                    alt={s.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 420px"
                    className="df-bt-img"
                    draggable={false}
                  />
                )}
                <div className="df-bt-veil" aria-hidden="true" />
                <div className="df-bt-glare" data-glare aria-hidden="true" />
              </div>
              <div className="df-bt-cap" data-caption>
                <div className="df-bt-glass" data-glassbg aria-hidden="true" />
                <div className="df-bt-cap-inner">
                  <span className="df-bt-num">{s.id}</span>
                  <span className="df-bt-name">{s.name}</span>
                  <span className="df-bt-desc">{s.desc}</span>
                </div>
              </div>
            </TiltCard>
          );
        })}

        {/* 5e tuile — lien vers tous les services */}
        <TiltCard href="/services" ariaLabel="Voir tous les services" className="df-bt-more" reduced={reduced}>
          <div className="df-bt-glare df-bt-glare-solo" data-glare aria-hidden="true" />
          <span className="df-bt-plus" aria-hidden="true">+</span>
          <div className="df-bt-more-row" data-caption>
            <span className="df-bt-more-label">Voir tous<br />les services</span>
            <span className="df-bt-more-arrow" aria-hidden="true">→</span>
          </div>
        </TiltCard>
      </div>

      {/* ── Footer slim ── */}
      <div className="df-cs-foot df-cs-anim">
        <span className="df-cs-foot-meta">Studio audiovisuel · Orléans + Tours</span>
      </div>
    </section>
  );
}
