"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ServiceData {
  id: string;
  titlePrefix: string;
  titleHighlight: string;
  code: string;
  abo: string;
  tc: string;
  blurb: string;
  spec: [string, string][];
  tags: string[];
  gradientKey: "glauque" | "auto" | "motion" | "event";
  href: string;
}

const SERVICES: Record<string, ServiceData> = {
  "01": {
    id: "01",
    titlePrefix: "Pub ",
    titleHighlight: "sociale.",
    code: "REELS · TIKTOK · VERTICAL",
    abo: "★ Abonnement · dès 45 €/mois",
    tc: "00:00:21:14",
    blurb: "Des reels et TikToks qui ne se zappent pas. Production récurrente, multi-format, recyclage <em>multi-réseaux</em>.",
    spec: [
      ["Formats", "9:16 · 1:1 · 16:9"],
      ["Cadence", "<b>4 reels / mois</b>"],
      ["Livraison", "72 h après tournage"],
      ["Engagement", "Trimestriel · sans reconduction"],
    ],
    tags: ["Reels", "TikTok", "Vertical", "Recyclage"],
    gradientKey: "glauque",
    href: "/services/pub-reseaux-sociaux",
  },
  "02": {
    id: "02",
    titlePrefix: "Shooting ",
    titleHighlight: "auto.",
    code: "ROLLING · PHOTO · DRONE",
    abo: "✦ À la carte · sur devis",
    tc: "00:01:38:04",
    blurb: "Photo et vidéo voiture, en studio mobile ou en décor. Pour <em>concessionnaires, importateurs, collectionneurs</em>.",
    spec: [
      ["Formats", "16:9 · 4:3 · Stills"],
      ["Type", "<b>Rolling + statique</b>"],
      ["Livraison", "5 j ouvrés"],
      ["Lieu", "Orléans · ± 200 km"],
    ],
    tags: ["Rolling", "Photo", "Drone", "Étalonnage"],
    gradientKey: "auto",
    href: "/services/shooting-automobile",
  },
  "03": {
    id: "03",
    titlePrefix: "Intro ",
    titleHighlight: "animée.",
    code: "MOTION · SIGNATURE · 5–20 s",
    abo: "◆ Motion · forfait unique",
    tc: "00:00:07:18",
    blurb: "5 à 20 secondes sur mesure pour signer tout ce que <em>vous diffusez</em>. Marque, podcast, intro YouTube, bumper.",
    spec: [
      ["Durée", "5 · 10 · 20 s"],
      ["Livraison", "<b>10 j ouvrés</b>"],
      ["Fichiers", "MP4 · transparent · audio sync"],
      ["Révisions", "2 cycles inclus"],
    ],
    tags: ["Motion", "After Effects", "Sound design", "Looping"],
    gradientKey: "motion",
    href: "/services/intro-animee",
  },
  "04": {
    id: "04",
    titlePrefix: "",
    titleHighlight: "Événementiel.",
    code: "LIVE · MULTICAM · AFTERMOVIE",
    abo: "◉ Sur devis · multicam",
    tc: "00:03:08:00",
    blurb: "Aftermovie, multicam, captation live. Un film sur mesure pour votre <em>événement</em>, livré chaud.",
    spec: [
      ["Caméras", "2 → 6"],
      ["Son", "<b>Léger · HF · ambiance</b>"],
      ["Aftermovie", "48 h post-event"],
      ["Live", "Streaming optionnel"],
    ],
    tags: ["Live", "Multicam", "Aftermovie", "Son léger"],
    gradientKey: "event",
    href: "/services/aftermovie-evenementiel",
  },
};


export default function CrewStack() {
  const [activeId, setActiveId] = useState<string>("01");
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
            stagger: 0.15,
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

  const activeService = (SERVICES[activeId] || SERVICES["01"]) as ServiceData;

  return (
    <section
      ref={sectionRef}
      className="df-cs"
      aria-label="Services Splice"
    >
      {/* ── Section Header ── */}
      <div className="df-cs-head">
        <div className="df-cs-anim">
          <span className="df-cs-eyebrow">Services</span>
          <h2 className="df-cs-h2" style={{ marginTop: "clamp(32px, 4vw, 56px)" }}>
            Ce qu&apos;on cadre, <em>vraiment bien</em>
            <span className="text-[#F36B1F]">.</span>
          </h2>
        </div>
        <aside className="df-cs-head-aside df-cs-anim">
          PGM STREAM · ON AIR
          <div className="df-cs-head-aside-row">
            <span className="df-rec-dot" aria-hidden="true" />
            <b>24 FPS</b> · 4K UHD
          </div>
        </aside>
      </div>

      {/* ── Editorial 2-Column Spread ── */}
      <div className="df-cs-editorial">
        
        {/* Left Column: Interactive Index */}
        <aside className="df-cs-ix df-cs-anim">
          <div className="df-cs-ix-head">
            <span>01 — Index</span>
            <span>
              <b>04</b> Services
            </span>
          </div>
          <ul className="df-cs-ix-list" id="ixList">
            {Object.values(SERVICES).map((s) => (
              <li
                key={s.id}
                className={`df-cs-ix-item ${activeId === s.id ? "is-on" : ""}`}
                onMouseEnter={() => setActiveId(s.id)}
                onFocus={() => setActiveId(s.id)}
                onClick={() => setActiveId(s.id)}
                tabIndex={0}
                role="button"
                aria-label={`Voir le service ${s.titlePrefix}${s.titleHighlight}`}
              >
                <span className="df-cs-ix-scn">S/{s.id}</span>
                <span
                  className="df-cs-ix-ttl"
                  dangerouslySetInnerHTML={{
                    __html: `${s.titlePrefix}<em>${s.titleHighlight}</em>`,
                  }}
                />
                <span className="df-cs-ix-tally" aria-hidden="true" />
              </li>
            ))}
          </ul>

        </aside>

        {/* Right Column: Detailed spread */}
        <div className="df-cs-feat" id="featStage">
          


          {/* Service title */}
          <h2
            className="df-cs-feat-title"
            data-anim
            key={`title-${activeId}`}
          >
            {activeService.titlePrefix}
            <em>{activeService.titleHighlight}</em>
          </h2>

          <div
            className="df-cs-feat-body"
            data-anim
            key={`body-${activeId}`}
          >
            
            {/* Left part of split: main hook, tags, and CTA */}
            <div className="df-cs-feat-main-copy">
              <p
                className="df-cs-feat-blurb"
                dangerouslySetInnerHTML={{ __html: activeService.blurb }}
              />

              <div className="df-cs-feat-tags">
                {activeService.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="df-cs-feat-cta">
                <Link href={activeService.href} className="btn btn-pri">
                  Voir le service <span className="arr">→</span>
                </Link>
                <Link href="/contact" className="btn btn-ghost">
                  Réserver un appel
                </Link>
              </div>
            </div>

            {/* Right part of split: Devis card */}
            <div className="df-cs-feat-side-details">
              <div className="df-cs-devis-card">
                <div className="df-cs-devis-card-content">
                  <div className="df-cs-devis-card-head">
                    <span className="df-rec-dot" aria-hidden="true" />
                    Devis Express · 24h
                  </div>
                  <h3 className="df-cs-devis-card-title">
                    Projet sur mesure
                  </h3>
                  <ul className="df-cs-devis-card-list">
                    <li className="df-cs-devis-card-item">
                      <span className="df-cs-devis-card-item-bullet">✦</span>
                      <span><b>Tarif transparent :</b> TVA non applicable (art. 293 B du CGI)</span>
                    </li>
                    <li className="df-cs-devis-card-item">
                      <span className="df-cs-devis-card-item-bullet">✦</span>
                      <span><b>Lancement rapide :</b> Planification sous 14 jours</span>
                    </li>
                    <li className="df-cs-devis-card-item">
                      <span className="df-cs-devis-card-item-bullet">✦</span>
                      <span><b>Acompte 30% :</b> Paiement Stripe sécurisé</span>
                    </li>
                    <li className="df-cs-devis-card-item">
                      <span className="df-cs-devis-card-item-bullet">✦</span>
                      <span><b>Accompagnement :</b> De la conception aux livrables</span>
                    </li>
                  </ul>
                </div>
                <div className="df-cs-devis-card-btn">
                  <Link href="/devis" className="df-btn df-btn-primary w-full text-center">
                    Demander un devis <span className="arr">→</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Statistics / Quick Links footer strip ── */}
      <div className="df-cs-tally-strip df-cs-anim">
        <div className="cell">
          <div className="n">04</div>
          <div className="l">— Services</div>
        </div>
        <div className="cell">
          <div className="n">
            72
            <small style={{ fontFamily: "var(--font-sans)", fontSize: "18px", letterSpacing: "0.1em", color: "rgba(255, 255, 255, 0.45)", marginLeft: "6px" }}>
              h
            </small>
          </div>
          <div className="l">— Livraison min.</div>
        </div>
        <div className="cell">
          <div className="n">01</div>
          <div className="l">— Studio · Orléans</div>
        </div>
        <Link href="/services" className="cell last hover:opacity-85 transition-opacity">
          <div className="n">Voir tout →</div>
          <div className="l">— /services</div>
        </Link>
      </div>
    </section>
  );
}
