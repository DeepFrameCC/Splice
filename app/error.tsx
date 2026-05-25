"use client";

import { useEffect } from "react";
import Link from "next/link";


export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Forward to monitoring (Sentry when configured, console fallback)
    import("@/lib/monitoring").then(({ captureException }) => {
      captureException(error, { route: window.location.pathname });
    }).catch(() => {
      console.error("[splice:error]", error);
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-df-surface flex flex-col items-center justify-center px-6 text-center">
      <span className="mb-10 font-display text-2xl font-bold tracking-wide text-white/20">SPLICE</span>

      <p
        style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.18em" }}
        className="text-xs uppercase text-[#F36B1F] mb-4"
      >
        Quelque chose s&apos;est mal passé
      </p>

      <h2
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        className="text-4xl md:text-6xl font-bold text-[#F36B1F] leading-none mb-6"
      >
        Une erreur<br />est survenue.
      </h2>

      <p className="text-white/60 text-lg max-w-md mb-10">
        Ne t&apos;inquiète pas — ça arrive. Réessaie ou reviens à l&apos;accueil.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          style={{
            background: "#F36B1F",
            color: "#fff",
            borderRadius: "999px",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 14,
            padding: "14px 28px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
        <Link
          href="/"
          style={{
            background: "transparent",
            color: "#F36B1F",
            borderRadius: "999px",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 14,
            padding: "14px 28px",
            border: "1.5px solid #F36B1F",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
