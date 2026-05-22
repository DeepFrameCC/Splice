"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

const FPS = 24;

function format(frames: number): string {
  const totalSeconds = Math.floor(frames / FPS);
  const f = frames % FPS;
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

/**
 * Returns a live timecode counter at 24fps.
 * - Pauses on prefers-reduced-motion
 * - Pauses when document is hidden (saves CPU)
 * - SSR-safe : starts at "00:00:00:01"
 */
export function useTcCounter(): string {
  const [frames, setFrames] = useState(1);
  const reduced = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) return;

    const start = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        setFrames((f) => f + 1);
      }, 1000 / FPS);
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reduced]);

  return format(frames);
}
