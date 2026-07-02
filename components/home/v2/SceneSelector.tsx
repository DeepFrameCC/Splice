"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { scenes } from "@/lib/home/scenes";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SceneSelectorArrow from "./SceneSelectorArrow";
import SceneSelectorRail from "./SceneSelectorRail";
import Link from "next/link";

/**
 * SceneSelector — le composant signature de la homepage V2.
 *
 * Architecture :
 * - Scène active plein cadre (vidéo lecture auto, métadonnées éditoriales overlay)
 * - Peek partiels gauche / droite des scènes voisines
 * - Flèches ←/→ vitrées flottantes
 * - Rail miniatures vitré en bas
 * - Transition iris (clip-path circle) au changement de projet, pas un slide
 *
 * Interactions :
 * - Clavier : ← → Home End 1-9
 * - Swipe tactile sur la scène (threshold 60px)
 * - Click peek = navigue dans le sens du peek
 * - Click miniature = focus direct
 *
 * A11y :
 * - tabindex=0 sur le composant
 * - aria-roledescription="carousel", aria-label
 * - aria-live="polite" sur l'annonce du titre
 * - Miniatures role="tab" + aria-selected
 *
 * Reduced motion :
 * - Iris → fade simple
 * - Pas de glow pulse
 */
export default function SceneSelector() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const previousIndexRef = useRef(0);

  const current = scenes[index]!;
  const prevScene = scenes[(index - 1 + scenes.length) % scenes.length]!;
  const nextScene = scenes[(index + 1) % scenes.length]!;

  const goTo = useCallback(
    (target: number) => {
      if (isTransitioning) return;
      const len = scenes.length;
      const normalized = ((target % len) + len) % len;
      if (normalized === index) return;
      previousIndexRef.current = index;
      setIsTransitioning(true);
      setIndex(normalized);
    },
    [index, isTransitioning]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  // GSAP transition : iris + metadata stagger
  useGSAP(
    () => {
      if (!sceneRef.current) return;
      const ctx = gsap.context(() => {
        if (reduced) {
          gsap.fromTo(
            sceneRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: "power2.out" }
          );
          gsap.fromTo(
            ".df-ss-meta-line",
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              stagger: 0.04,
              ease: "power2.out",
              onComplete: () => setIsTransitioning(false),
            }
          );
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => setIsTransitioning(false),
          defaults: { ease: "expo.out" },
        });

        tl.fromTo(
          sceneRef.current,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(150% at 50% 50%)", duration: 0.42 }
        ).fromTo(
          ".df-ss-meta-line",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power3.out" },
          0.12
        );
      }, stageRef);

      return () => ctx.revert();
    },
    { dependencies: [index, reduced], scope: stageRef }
  );

  // Autoplay scène active
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {
      // Fallback : poster reste affiché, pas de blocage
    });
    return () => {
      v.pause();
      v.currentTime = 0;
    };
  }, [index]);

  // Keyboard nav
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goNext();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(scenes.length - 1);
          break;
        default:
          if (/^[1-9]$/.test(e.key)) {
            const target = parseInt(e.key, 10) - 1;
            if (target < scenes.length) {
              e.preventDefault();
              goTo(target);
            }
          }
      }
    };

    stage.addEventListener("keydown", onKey);
    return () => stage.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, goTo]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartXRef.current;
    const end = e.changedTouches[0]?.clientX;
    if (start == null || end == null) return;
    const dx = end - start;
    if (Math.abs(dx) > 60) {
      if (dx > 0) goPrev();
      else goNext();
    }
    touchStartXRef.current = null;
  };

  const ratioClass = `df-ss-scene-${current.ratio.replace("/", "-")}`;

  return (
    <section
      id="scene-selector"
      ref={stageRef}
      className="df-ss"
      aria-label="Sélecteur de projets Splice Studio"
      aria-roledescription="carousel"
      tabIndex={0}
    >
      <div className="df-ss-head">
        <div className="df-ss-head-text">
          <span className="df-ss-eyebrow">Réalisations</span>
          <h2 className="df-ss-h2">Nos dernières scènes</h2>
        </div>
        <span className="df-ss-counter df-tc-live" aria-live="polite">
          Scene {String(index + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
        </span>
      </div>

      <div className="df-ss-stage">
        {/* Peek gauche */}
        <button
          type="button"
          className="df-ss-peek df-ss-peek-prev"
          onClick={goPrev}
          aria-label={`Scène précédente : ${prevScene.title}`}
        >
          <div className="df-ss-peek-img" style={{ backgroundImage: `url(${prevScene.poster})` }} />
        </button>

        {/* Scène active */}
        <div
          ref={sceneRef}
          id="df-ss-stage"
          className={`df-ss-scene ${ratioClass}`}
          role="tabpanel"
          aria-label={`Scène ${index + 1} : ${current.title}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {current.type === "photo" ? (
            <Image
              key={current.src}
              className="df-ss-video"
              src={current.poster}
              alt={`Photo : ${current.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <video
              ref={videoRef}
              key={current.src}
              className="df-ss-video"
              src={current.src}
              poster={current.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`Aperçu vidéo : ${current.title}`}
            >
              <track kind="captions" srcLang="fr" src={current.captions} label="Français" default />
            </video>
          )}

          {/* Overlay métadonnées */}
          <div ref={metaRef} className="df-ss-meta">
            <span className="df-ss-meta-line df-ss-meta-tag">{current.tag}</span>
            <h3 className="df-ss-meta-line df-ss-meta-title">{current.title}</h3>
            <span className="df-ss-meta-line df-ss-meta-credit">@ {current.credit}</span>
          </div>



          {/* Corners ciné */}
          <div className="df-cine-corners" aria-hidden="true">
            <i /><i /><i /><i />
          </div>

          {/* Flèches rondes bas-droite (ghost + orange) */}
          <div className="df-ss-arrows">
            <SceneSelectorArrow direction="prev" onClick={goPrev} ariaLabel="Scène précédente" />
            <SceneSelectorArrow direction="next" onClick={goNext} ariaLabel="Scène suivante" />
          </div>
        </div>

        {/* Peek droite */}
        <button
          type="button"
          className="df-ss-peek df-ss-peek-next"
          onClick={goNext}
          aria-label={`Scène suivante : ${nextScene.title}`}
        >
          <div className="df-ss-peek-img" style={{ backgroundImage: `url(${nextScene.poster})` }} />
        </button>
      </div>

      <SceneSelectorRail scenes={scenes} currentIndex={index} onSelect={goTo} />
      <div className="flex justify-center mt-6">
        <Link href="/galerie" className="df-dcr-link">
          Voir toute la galerie →
        </Link>
      </div>
    </section>
  );
}
