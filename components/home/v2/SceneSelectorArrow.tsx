"use client";

interface SceneSelectorArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
  ariaLabel: string;
}

/**
 * Flèche vitrée de navigation SceneSelector.
 * Surface verre fumé, ronde, gros tap target, glow au hover.
 */
export default function SceneSelectorArrow({ direction, onClick, ariaLabel }: SceneSelectorArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`df-ss-arrow df-ss-arrow-${direction}`}
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {direction === "prev" ? (
          <path d="M15 6l-6 6 6 6" />
        ) : (
          <path d="M9 6l6 6-6 6" />
        )}
      </svg>
    </button>
  );
}
