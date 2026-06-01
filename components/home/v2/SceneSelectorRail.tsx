"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Scene } from "@/lib/home/scenes";

interface SceneSelectorRailProps {
  scenes: Scene[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const RATIO_MAP: Record<Scene["ratio"], number> = {
  "16/9": 16 / 9,
  "9/16": 9 / 16,
  "4/3": 4 / 3,
};

/**
 * Rail miniatures vitré (verre fumé) en bas du SceneSelector.
 * Auto-scroll vers la miniature active pour la maintenir centrée.
 */
export default function SceneSelectorRail({ scenes, currentIndex, onSelect }: SceneSelectorRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const active = activeRef.current;
    const track = trackRef.current;
    if (!active || !track) return;

    const rafId = requestAnimationFrame(() => {
      const trackRect = track.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const offset = activeRect.left - trackRect.left - trackRect.width / 2 + activeRect.width / 2;

      track.scrollBy({ left: offset, behavior: "smooth" });
    });

    return () => cancelAnimationFrame(rafId);
  }, [currentIndex]);

  return (
    <div className="df-ss-rail df-glass-deep">
      <div
        className="df-ss-rail-track df-scroll-hidden"
        ref={trackRef}
        role="tablist"
        aria-label="Sélecteur de scènes"
      >
        {scenes.map((scene, i) => {
          const isActive = i === currentIndex;
          const aspect = RATIO_MAP[scene.ratio];
          const height = 64;
          const width = Math.round(height * aspect);

          return (
            <button
              key={scene.slug}
              ref={isActive ? activeRef : undefined}
              type="button"
              onClick={() => onSelect(i)}
              className={"df-ss-rail-item" + (isActive ? " df-ss-rail-item-active" : "")}
              style={{ width, height }}
              role="tab"
              aria-selected={isActive}
              aria-controls="df-ss-stage"
              aria-label={`Scène ${i + 1} : ${scene.title}`}
              tabIndex={isActive ? 0 : -1}
            >
              <Image
                src={scene.poster}
                alt=""
                width={width * 2}
                height={height * 2}
                className="df-ss-rail-poster"
                sizes="160px"
                loading="lazy"
              />
              <span className="df-ss-rail-tc">{scene.tc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
