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

export default function CrewStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });
  const reduced = useReducedMotion();

  // Update scroll progress bar position (sliding handle)
  const onScroll = React.useCallback(() => {
    const el = trackRef.current;
    const bar = progressRef.current;
    if (!el || !bar) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      bar.style.transform = "translateX(0px)";
      return;
    }
    const pct = el.scrollLeft / maxScroll;
    const trackWidth = bar.parentElement?.clientWidth || 140;
    const barWidth = bar.clientWidth || 40;
    const maxTranslate = trackWidth - barWidth;
    const tx = pct * maxTranslate;
    bar.style.transform = `translateX(${Math.min(maxTranslate, Math.max(0, tx))}px)`;
  }, []);

  React.useEffect(() => {
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  }, [onScroll]);

  // Click navigation for the gallery slider
  const scrollDirection = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".df-cs-card");
    const firstCard = cards[0];
    if (!firstCard) return;
    
    // Find width of a single card
    const cardWidth = firstCard.clientWidth;
    const gap = 20; 
    const scrollAmount = cardWidth + gap;
    
    el.scrollTo({
      left: el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  // Glisser-déposer à la souris pour faire défiler (le tactile utilise le scroll natif).
  // On ne capture le pointeur QU'À partir du moment où un vrai drag démarre : sinon
  // le navigateur synthétise le `click` sur la piste capturée au lieu du <Link>,
  // ce qui avale la navigation.
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.down) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    // Seuil volontairement large : un clic avec micro-tremblement reste un clic.
    if (!drag.current.moved && Math.abs(dx) > 8) {
      drag.current.moved = true;
      el.setPointerCapture(e.pointerId); // capture seulement une fois le drag confirmé
    }
    if (drag.current.moved) el.scrollLeft = drag.current.scrollLeft - dx;
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    drag.current.down = false;
    if (trackRef.current?.hasPointerCapture?.(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }
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
          onScroll={onScroll}
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
        <div className="df-cs-controls">
          <span className="df-cs-drag-hint" aria-hidden="true">
            ↔ Glissez pour explorer
          </span>
          <div className="df-cs-slider-nav">
            <button
              onClick={() => scrollDirection("left")}
              className="df-cs-arrow"
              aria-label="Défiler vers la gauche"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div className="df-cs-progress-track" aria-hidden="true">
              <div ref={progressRef} className="df-cs-progress-bar" />
            </div>
            <button
              onClick={() => scrollDirection("right")}
              className="df-cs-arrow"
              aria-label="Défiler vers la droite"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
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
