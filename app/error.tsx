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
      <span
        style={{ color: "rgba(255, 255, 255, 0.2)" }}
        className="mb-10 font-display text-2xl font-bold tracking-wide"
      >
        SPLICE
      </span>

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

      <p
        style={{ color: "rgba(255, 255, 255, 0.6)" }}
        className="text-lg max-w-md mb-10"
      >
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

      {error && (
        <div className="mt-12 w-full max-w-xl mx-auto rounded-2xl bg-black/40 border border-white/10 p-5 text-left font-mono text-[11px] text-red-400 shadow-2xl ring-1 ring-red-500/10 backdrop-blur-md">
          <p className="font-sans font-bold uppercase tracking-wider mb-2 text-white/50 text-[10px]">Détails techniques (Diagnostic) :</p>
          <p className="font-bold text-red-400">{error.name}: {error.message}</p>
          {error.digest && <p className="mt-1 text-white/30 text-[10px]">Digest: {error.digest}</p>}
          {error.stack && (
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap max-h-48 border-t border-white/5 pt-3 text-white/60 leading-relaxed scrollbar-thin">
              {error.stack}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
