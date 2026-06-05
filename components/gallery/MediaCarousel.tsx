"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ProjectMedia } from "./data";

interface MediaCarouselProps {
  medias: ProjectMedia[];
  projectTitle: string;
  onOpenLightbox: (startIdx: number) => void;
  /** When true, the first slide image is eagerly loaded as the LCP candidate. */
  priority?: boolean;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function MediaCarousel({ medias, projectTitle, onOpenLightbox, priority = false }: MediaCarouselProps) {
  const [i, setI] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, dx: 0 });

  const n = medias.length;
  const hasNav = n > 1;
  const cur = medias[i];

  // Badge label & styles
  const types = new Set(medias.map((m) => m.type));
  const badgeClass = types.size > 1 ? "mixed" : types.has("video") ? "video" : "photo";
  const badgeText =
    types.size > 1
      ? `Film + ${medias.filter((m) => m.type === "photo").length} photos`
      : types.has("video")
      ? "Vidéo"
      : n > 1
      ? `${n} photos`
      : "Photo";

  const go = useCallback(
    (delta: number) => {
      setI((prev) => {
        const next = prev + delta;
        if (next < 0) return 0;
        if (next > n - 1) return n - 1;
        return next;
      });
    },
    [n]
  );

  const goTo = useCallback(
    (idx: number) => setI(Math.max(0, Math.min(n - 1, idx))),
    [n]
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (!hasNav) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(+1);
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasNav) return;
    dragState.current = { active: true, startX: e.clientX, dx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragState.current;
    if (!st.active) return;
    st.dx = e.clientX - st.startX;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(calc(${-i * 100}% + ${st.dx}px))`;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragState.current;
    if (!st.active) return;
    st.active = false;
    if (trackRef.current) {
      trackRef.current.style.transition = "";
      trackRef.current.style.transform = "";
    }
    const w = trackRef.current ? trackRef.current.offsetWidth : 1;
    const threshold = w * 0.12;
    if (st.dx > threshold) go(-1);
    else if (st.dx < -threshold) go(+1);
  };

  const handleMediaClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onOpenLightbox && onOpenLightbox(i);
  };

  return (
    <div
      className="pj-media select-none"
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={handleMediaClick}
      role="region"
      aria-label={`Médias — ${projectTitle}`}
    >
      {/* Badge type */}
      <span className={`pj-badge ${badgeClass}`}>{badgeText}</span>

      {/* Compteur slides */}
      {hasNav && <div className="pj-count">{i + 1} / {n}</div>}

      {/* Track */}
      <div
        ref={trackRef}
        className="pj-track"
        style={{ transform: `translateX(${-i * 100}%)` }}
      >
        {medias.map((m, idx) => {
          const isVideoUrl = /\.(mp4|webm|mov|avi)$/i.test(m.url || "");
          const thumbSrc = m.thumbnailUrl || (!isVideoUrl ? m.url : null);
          const bgClass = `pj-g${m.g ?? 0}`;
          return (
            <div
              key={m.id || idx}
              className="pj-slide"
              role="group"
              aria-label={`Média ${idx + 1} sur ${n}`}
            >
              {!thumbSrc ? (
                <div className={`pj-slide-bg ${bgClass}`} />
              ) : (
                <Image
                  src={thumbSrc}
                  alt={m.caption || projectTitle}
                  fill
                  sizes="(max-width: 920px) 50vw, 33vw"
                  className="object-cover"
                  priority={priority && idx === 0}
                />
              )}
              <div className="pj-corners" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>

            </div>
          );
        })}
      </div>

      {/* Play overlay for video */}
      {cur && cur.type === "video" && (
        <div className="pj-play" aria-hidden="true">
          <PlayIcon />
        </div>
      )}

      {/* Prev / next controls */}
      {hasNav && (
        <>
          <button
            type="button"
            className="pj-nav prev"
            aria-label="Média précédent"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            disabled={i === 0}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="pj-nav next"
            aria-label="Média suivant"
            onClick={(e) => {
              e.stopPropagation();
              go(+1);
            }}
            disabled={i === n - 1}
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {hasNav && (
        <div className="pj-dots" role="tablist" aria-label="Sélection média">
          {medias.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`pj-dot ${idx === i ? "on" : ""}`}
              aria-label={`Aller au média ${idx + 1}`}
              aria-current={idx === i}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
