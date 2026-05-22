"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";


export default function IntroLoader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("df-intro-done") === "1") {
      setShow(false);
      return;
    }
    const start = Date.now();
    const total = 1800;
    const id = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / total) * 100));
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem("df-intro-done", "1");
          // Fade out then hide
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.6,
              onComplete: () => setShow(false),
            });
          } else {
            setShow(false);
          }
        }, 250);
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    if (!show || !logoRef.current) return;
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, rotateY: -45 },
      { opacity: 1, scale: 1, rotateY: 0, duration: 1.2, ease: "power2.out" },
    );
  }, { dependencies: [show] });

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] grid place-items-center bg-df-night"
    >
      <div className="flex flex-col items-center">
        <div
          ref={logoRef}
          className="flex flex-col items-center gap-4"
          style={{ transformStyle: "preserve-3d", perspective: 1000, opacity: 0 }}
        >
          <span className="font-display text-4xl font-bold tracking-wide text-white">DEEPFRAME</span>
        </div>
        <div className="mt-10 h-1.5 w-64 overflow-hidden rounded-full bg-df-surface border border-white/5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#F36B1F] via-[#FF7A00] to-[#FFB800] transition-[width] duration-75 ease-linear shadow-[0_0_8px_#F36B1F]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 font-display uppercase tracking-wider text-white/70 text-sm">{progress}%</p>
      </div>
    </div>
  );
}
