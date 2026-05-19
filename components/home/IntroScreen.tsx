"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const DURATION = 2.8; // secondes

export default function IntroScreen() {
  // Chargé avec dynamic({ ssr: false }) → window/sessionStorage disponibles dès le premier render client
  // Le check sessionStorage est SYNCHRONE → zéro flash pour les visiteurs qui ont déjà vu l'intro
  const [phase, setPhase] = useState<"draw" | "hold" | "fade" | "gone">(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("df_intro_seen") === "1") {
      return "gone";
    }
    return "draw";
  });

  useEffect(() => {
    if (phase === "gone") return;
    const drawMs = DURATION * 1000 * 0.55;
    const holdMs = DURATION * 1000 * 0.15;
    const fadeMs = DURATION * 1000 * 0.30;

    const t1 = setTimeout(() => setPhase("hold"), drawMs);
    const t2 = setTimeout(() => setPhase("fade"), drawMs + holdMs);
    const t3 = setTimeout(() => {
      sessionStorage.setItem("df_intro_seen", "1");
      setPhase("gone");
    }, drawMs + holdMs + fadeMs);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "gone") return null;

  const drawSec = (DURATION * 0.55).toFixed(2);
  const fadeSec = (DURATION * 0.30).toFixed(2);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "#FFFFFF",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        opacity: phase === "fade" ? 0 : 1,
        transition: `opacity ${fadeSec}s cubic-bezier(.22,.61,.36,1)`,
        pointerEvents: phase === "fade" ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes df-intro-wipe {
          0%   { clip-path: inset(0 0 100% 0); }
          100% { clip-path: inset(0 0 0% 0); }
        }
        @keyframes df-intro-shimmer {
          0%   { transform: translateY(-110%); }
          100% { transform: translateY(110%); }
        }
        .df-intro-logo {
          animation: df-intro-wipe ${drawSec}s cubic-bezier(.65,.05,.36,1) forwards;
        }
        .df-intro-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(243,107,31,.12) 45%,
            rgba(255,189,89,.35) 50%,
            rgba(243,107,31,.12) 55%,
            transparent 100%);
          mix-blend-mode: multiply;
          animation: df-intro-shimmer ${drawSec}s cubic-bezier(.65,.05,.36,1) forwards;
          pointer-events: none;
        }
      `}</style>

      <div className="flex flex-col items-center gap-6" style={{ width: "min(38vw, 320px)", position: "relative" }}>
        <div className="relative w-36 h-36">
          <Image
            src="/LogoNoir.svg"
            alt="DeepFrame"
            className="df-intro-logo"
            fill
            priority
            sizes="(max-width: 768px) 38vw, 144px"
            style={{ display: "block", objectFit: "contain" }}
          />
          {phase === "draw" && <div className="df-intro-shimmer rounded-xl" />}
        </div>
        <div className="relative w-64 h-12">
          <Image
            src="/NomNoir.svg"
            alt="DEEPFRAME"
            className="df-intro-logo"
            fill
            priority
            sizes="(max-width: 768px) 38vw, 256px"
            style={{ display: "block", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
