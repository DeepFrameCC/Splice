"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Plausible Analytics script loader.
 * Only loads if:
 * 1. NEXT_PUBLIC_PLAUSIBLE_DOMAIN env var is set
 * 2. User has consented to analytics cookies (localStorage: df_consent)
 */
export default function PlausibleScript() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
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

    // Listen for consent changes from CookieBanner
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

  if (!PLAUSIBLE_DOMAIN || !consented) return null;

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
