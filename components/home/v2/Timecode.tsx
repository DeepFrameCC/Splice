"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FPS = 24;

const format = (frames: number) => {
  const f = frames % FPS;
  const t = Math.floor(frames / FPS);
  const s = t % 60;
  const m = Math.floor(t / 60) % 60;
  const h = Math.floor(t / 3600);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
};

/**
 * Compteur timecode live piloté par mutation DOM (zéro re-render React).
 * - Respecte prefers-reduced-motion
 * - Pause quand l'onglet est caché (document.visibilityState)
 * - Pause quand le compteur sort du viewport (IntersectionObserver)
 */
export default function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    let frames = 1;
    let raf = 0;
    let last = performance.now();
    let visible = false;

    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? false;
    });
    if (node) io.observe(node);

    const tick = (now: number) => {
      if (visible && document.visibilityState === "visible" && now - last >= 1000 / FPS) {
        frames++;
        last = now;
        if (node) node.textContent = format(frames);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced]);

  return (
    <span ref={ref} className={className} aria-live="off">
      00:00:00:01
    </span>
  );
}
