"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Plausible Analytics script loader.
 * Uses Plausible's unique script URL (domain encoded in the URL).
 * Only loads after user consents to analytics (localStorage: df_consent).
 */
export default function PlausibleScript() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Set up plausible queue shim immediately so calls before load are queued
    window.plausible =
      window.plausible ||
      function (...args: unknown[]) {
        (window.plausible as { q?: unknown[] }).q =
          (window.plausible as { q?: unknown[] }).q || [];
        (window.plausible as { q: unknown[] }).q.push(args);
      };

    try {
      const raw = localStorage.getItem("df_consent");
      if (raw) {
        const consent = JSON.parse(raw);
        if (consent.analytics === true) {
          setConsented(true);
        }
      }
    } catch {
      // No consent = no analytics
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === "df_consent" && e.newValue) {
        try {
          const consent = JSON.parse(e.newValue);
          setConsented(consent.analytics === true);
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!consented) return null;

  return (
    <Script
      async
      src="https://plausible.io/js/pa-PsFOerwMWgvz2ruO3jiu_.js"
      strategy="afterInteractive"
    />
  );
}
