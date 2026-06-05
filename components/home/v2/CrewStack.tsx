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
    href: "/services/aftermovie-evenementiel",
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

export default function CrewStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });
  const reduced = useReducedMotion();

  // Glisser-déposer à la souris pour faire défiler (le tactile utilise le scroll natif).
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.down) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    drag.current.down = false;
    trackRef.current?.releasePointerCapture?.(e.pointerId);
  }
  // Empêche la navigation si le clic était en fait un glissement.
  function onCardClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (drag.current.moved) e.preventDefault();
  }

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
          <h2 className="df-cs-h2" style={{ marginTop: "clamp(28px, 4vw, 48px)" }}>
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

      {/* ── Galerie draggable de services ── */}
      <div className="df-cs-gallery-wrap df-cs-anim">
        <div
          ref={trackRef}
          className="df-cs-gallery"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {SERVICES.map((s) => {
            const media = sceneBySlug[s.mediaSlug];
            return (
              <Link
                key={s.id}
                href={s.href}
                className="df-cs-card"
                onClick={onCardClick}
                draggable={false}
                aria-label={`Voir le service ${s.name}`}
              >
                {media && (
                  <Image
                    src={media.poster}
                    alt={s.name}
                    fill
                    sizes="(max-width: 640px) 80vw, 380px"
                    className="df-cs-card-img"
                    draggable={false}
                  />
                )}
                <div className="df-cs-card-veil" aria-hidden="true" />
                <span className="df-cs-card-num">S/{s.id}</span>
                <div className="df-cs-card-cap">
                  <span className="df-cs-card-name">{s.name}</span>
                  <span className="df-cs-card-desc">{s.desc}</span>
                  <span className="df-cs-card-go">
                    Voir le service <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <span className="df-cs-drag-hint" aria-hidden="true">
          ↔ Glissez pour explorer
        </span>
      </div>

      {/* ── Footer slim ── */}
      <div className="df-cs-foot df-cs-anim">
        <span className="df-cs-foot-meta">Studio audiovisuel · Orléans + Tours</span>
        <Link href="/services" className="df-cs-foot-link">
          Voir tous les services <span>→</span>
        </Link>
      </div>
    </section>
  );
}
