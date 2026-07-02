"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { scenes } from "@/lib/home/scenes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Hero V2 — full-bleed (maquette accueil.html).
 * Média hero réel (scène 01) en fond, dégradé bleu nuit, badge glass « Orléans »,
 * baseline 900 en bas. Entrée scénique GSAP conservée :
 * eyebrow → baseline word-stagger → sub → CTA, le diaphragme moniteur devient
 * un fade du badge glass (le moniteur n'existe plus dans ce layout).
 */
export default function FrameRoomEntry() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const heroScene = scenes[0]!;

  // Reduced motion : on fige la vidéo de fond sur son poster.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) {
      v.pause();
    } else {
      void v.play().catch(() => {
        // Autoplay bloqué : le poster reste affiché, pas de blocage.
      });
    }
  }, [reduced]);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const ease = "expo.out";
        const tl = gsap.timeline({ defaults: { ease } });

        if (reduced) {
          // Le H1 (.df-fre-line) reste peint pour préserver le LCP : on ne fade
          // que les éléments non-LCP.
          tl.fromTo(
            ".df-fre-anim:not(.df-fre-line)",
            { opacity: 0 },
            { opacity: 1, duration: 0.25, stagger: 0.05 }
          );
          return;
        }

        tl
          .fromTo(
            ".df-fre-eyebrow",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
            0.1
          )
          .fromTo(
            ".df-fre-line",
            { y: 24 },
            { y: 0, duration: 0.6, stagger: 0.12 },
            0.24
          )
          .fromTo(
            ".df-fre-sub",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5 },
            0.6
          )
          .fromTo(
            ".df-fre-cta",
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" },
            0.72
          )
          .fromTo(
            ".df-fre-badge",
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
            0.4
          );
      }, rootRef);

      return () => ctx.revert();
    },
    { dependencies: [reduced], scope: rootRef }
  );

  return (
    <section ref={rootRef} className="df-fre" aria-label="Hero Splice Studio">
      {/* Média hero en fond (scène 01 réelle, poster = LCP préchargé) */}
      <div className="df-fre-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="df-fre-video"
          src={heroScene.src}
          poster={heroScene.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          <track kind="captions" srcLang="fr" src={heroScene.captions} label="Français" default />
        </video>
      </div>
      <div className="df-fre-scrim" aria-hidden="true" />

      <div className="df-fre-badge df-fre-anim">Orléans</div>

      <div className="df-fre-content">
        <div className="df-fre-eyebrow df-fre-anim">
          <span className="df-rec-dot" aria-hidden="true" />
          Studio de production audiovisuelle &amp; vidéaste · Orléans · Tours
        </div>

        <h1 className="df-fre-baseline">
          <span className="sr-only">
            Studio de production audiovisuelle et vidéaste à Orléans &amp; Tours.{" "}
          </span>
          <span className="df-fre-line df-fre-anim">On filme. On cadre.</span>
          <span className="df-fre-line df-fre-anim"><em>On sublime.</em></span>
        </h1>

        <div className="df-fre-row">
          <p className="df-fre-sub df-fre-anim">
            Pubs sociales, shootings automobile, films de marque. À Orléans, à Tours, partout en France.
          </p>

          <div className="df-fre-cta-cluster df-fre-anim">
            <Link href="/devis" className="df-btn df-btn-primary df-btn-lg df-fre-cta">
              Demander un devis →
            </Link>
            <a
              href="#scene-selector"
              className="df-fre-pilot df-fre-cta"
              onClick={(e) => {
                if (reduced) return;
                e.preventDefault();
                document.getElementById("scene-selector")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span>Découvrir le studio</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
