"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MonitorStage from "./MonitorStage";
import { scenes } from "@/lib/home/scenes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Hero V2 — Frame Room Entry.
 * Composition asymétrique : baseline manifeste à gauche, moniteur de contrôle à droite.
 * Entrée scénique : eyebrow → baseline word-stagger → sub → CTA + diaphragme moniteur en parallèle.
 */
export default function FrameRoomEntry() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const heroScene = scenes[0]!;

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const ease = "expo.out";
        const tl = gsap.timeline({ defaults: { ease } });

        if (reduced) {
          tl.fromTo(
            ".df-fre-anim",
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
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
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
            ".df-fre-monitor",
            { clipPath: "inset(20% 20% 20% 20% round 18px)", opacity: 0.4 },
            { clipPath: "inset(0% 0% 0% 0% round 18px)", opacity: 1, duration: 0.7 },
            0.3
          );
      }, rootRef);

      return () => ctx.revert();
    },
    { dependencies: [reduced], scope: rootRef }
  );

  return (
    <section ref={rootRef} className="df-fre" aria-label="Hero Splice">
      <div className="df-fre-grid">
        <div className="df-fre-text">
          <div className="df-fre-eyebrow df-fre-anim">
            <span className="df-rec-dot" aria-hidden="true" />
            Studio production · Orléans · Tours
          </div>

          <h1 className="df-fre-baseline">
            <span className="df-fre-line df-fre-anim">On filme.</span>
            <span className="df-fre-line df-fre-anim">On cadre. <em>On sublime.</em></span>
          </h1>

          <p className="df-fre-sub df-fre-anim">
            Pubs sociales, shootings automobile, films de marque. À Orléans, à Tours, partout en France.
          </p>

          <div className="df-fre-cta-cluster df-fre-anim">
            <Link href="/devis" className="df-btn df-btn-primary df-fre-cta">
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
              <span>Pilotage du studio</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="df-fre-monitor df-fre-anim">
          <MonitorStage
            src={heroScene.src}
            poster={heroScene.poster}
            format={heroScene.format}
            tagLine={`Scene 01 - ${heroScene.tag}`}
          />
        </div>
      </div>
    </section>
  );
}
