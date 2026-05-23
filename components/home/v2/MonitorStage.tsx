"use client";

import { useRef, useState } from "react";
import { useTcCounter } from "@/hooks/useTcCounter";

interface MonitorStageProps {
  src: string;
  poster: string;
  format: string;
  tagLine: string;
}

/**
 * Faux moniteur de contrôle : vidéo encadrée + bezel + REC dot + TC live.
 * Centre de gravité du Hero V2.
 */
export default function MonitorStage({ src, poster, format, tagLine }: MonitorStageProps) {
  const tc = useTcCounter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  return (
    <div className="df-monitor-stage">
      <div className="df-monitor-bezel">
        <div className="df-monitor-screen">
          <video
            ref={videoRef}
            className="df-monitor-video"
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setAutoplayFailed(true)}
            onCanPlay={(e) => {
              void e.currentTarget.play().catch(() => setAutoplayFailed(true));
            }}
            aria-label="Aperçu studio Splice en lecture"
          />

          {autoplayFailed && (
            <button
              type="button"
              className="df-monitor-play-fallback"
              onClick={() => {
                videoRef.current?.play().then(() => setAutoplayFailed(false)).catch(() => {});
              }}
              aria-label="Lancer l'aperçu"
            >
              <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}

          {/* Overlay top-left : REC + format */}
          <div className="df-monitor-overlay df-monitor-overlay-tl">
            <span className="df-rec-dot" aria-hidden="true" />
            <span className="df-tc-live">REC · {format}</span>
          </div>

          {/* Overlay bottom-right : TC live */}
          <div className="df-monitor-overlay df-monitor-overlay-br">
            <span className="df-tc-live" aria-live="off">{tc}</span>
          </div>

          {/* Overlay bottom-left : tag scène */}
          <div className="df-monitor-overlay df-monitor-overlay-bl">
            <span className="df-monitor-tag">{tagLine}</span>
          </div>

          {/* Corners ciné */}
          <div className="df-cine-corners" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
        </div>
      </div>
    </div>
  );
}
