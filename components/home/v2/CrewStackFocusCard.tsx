"use client";

import { useRef } from "react";
import Link from "next/link";

interface CrewStackFocusCardProps {
  tag: string;
  title: string;
  pitch: string;
  priceFrom: string;
  href: string;
  videoSrc: string;
}

/**
 * Bloc service vedette dans le bento.
 * Mini scope vidéo top-right qui se lance au hover (preload metadata only).
 */
export default function CrewStackFocusCard({ tag, title, pitch, priceFrom, href, videoSrc }: CrewStackFocusCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link
      href={href}
      className="df-cs-card df-cs-focus"
      onMouseEnter={() => {
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        const v = videoRef.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      }}
    >
      <div className="df-cs-focus-scope">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="df-cs-focus-scope-overlay" aria-hidden="true">
          <span className="df-rec-dot" />
          <span className="df-tc-live">SCOPE</span>
        </div>
      </div>

      <div className="df-cs-focus-body">
        <span className="df-cs-tag">{tag}</span>
        <h3 className="df-cs-title df-cs-title-lg">{title}</h3>
        <p className="df-cs-pitch">{pitch}</p>
        <div className="df-cs-foot">
          <span className="df-cs-chip">{priceFrom}</span>
          <span className="df-cs-arrow">Voir le service →</span>
        </div>
      </div>
    </Link>
  );
}
