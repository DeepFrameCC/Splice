/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E0E22",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12 }}>
          Erreur critique
        </h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 480, textAlign: "center" }}>
          Une erreur inattendue s&apos;est produite. Veuillez rafraîchir la page ou revenir plus tard.
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 16 }}>
          <button
            onClick={reset}
            style={{
              padding: "12px 28px",
              background: "#1901AD",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
          <a
            href="/"
            style={{
              padding: "12px 28px",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Accueil
          </a>
        </div>
      </body>
    </html>
  );
}
