"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MAINTENANCE_MODE, MAINTENANCE_EXEMPT_PREFIXES } from "@/lib/maintenance";

/**
 * Overlay maintenance sitewide : floute le contenu (qui reste dans le DOM,
 * donc le SEO est préservé) et bloque toute interaction. Les routes admin
 * et login restent accessibles pour l'équipe.
 */
export default function MaintenanceOverlay() {
  const pathname = usePathname();
  const isExempt = MAINTENANCE_EXEMPT_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );
  const isActive = MAINTENANCE_MODE && !isExempt;

  useEffect(() => {
    if (!isActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
      aria-describedby="maintenance-desc"
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-df-night/70 px-4 backdrop-blur-2xl"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-df-surface/90 p-8 text-center shadow-2xl sm:p-12">
        <span className="inline-block rounded-full border border-df-gold/40 bg-df-gold/10 px-4 py-1.5 font-display text-xs uppercase tracking-widest text-df-gold">
          Maintenance en cours
        </span>
        <h1
          id="maintenance-title"
          className="mt-6 font-display text-3xl uppercase tracking-tight text-white sm:text-4xl"
        >
          Le site évolue
        </h1>
        <p id="maintenance-desc" className="mt-4 text-base leading-relaxed text-white/70">
          Splice Studio prépare une nouvelle version de son site pour mieux vous
          accompagner sur vos projets vidéo et photo. Nous revenons très vite.
        </p>
        <p className="mt-6 text-sm text-white/50">
          Un projet urgent ? Écrivez-nous&nbsp;:{" "}
          <a
            href="mailto:contact.splicestudio@gmail.com"
            className="font-medium text-df-gold underline-offset-4 transition-colors hover:text-df-gold-soft hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-df-gold"
          >
            contact.splicestudio@gmail.com
          </a>
        </p>
        <p className="mt-8 font-display text-xs uppercase tracking-widest text-white/40">
          Splice Studio — Orléans · Tours
        </p>
      </div>
    </div>
  );
}
