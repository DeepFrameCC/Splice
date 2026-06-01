"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { saveConsent } from "@/app/actions/consent";
import { Cookie, Settings, X } from "lucide-react";

const COOKIE_KEY = "df_consent";

type ConsentState = {
  essentiels: boolean;
  analytics: boolean;
};

function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function storeConsent(consent: ConsentState) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setVisible(true);

    function handleReopen() {
      setVisible(true);
      setShowDetails(true);
    }
    window.addEventListener("open-cookie-banner", handleReopen);
    return () => window.removeEventListener("open-cookie-banner", handleReopen);
  }, []);

  function accept(analyticsAccepted: boolean) {
    const consent: ConsentState = { essentiels: true, analytics: analyticsAccepted };
    storeConsent(consent);
    setVisible(false);

    startTransition(async () => {
      try {
        await saveConsent([
          { type: "COOKIES_ESSENTIELS", granted: true },
          { type: "COOKIES_ANALYTICS", granted: analyticsAccepted },
        ]);
      } catch (err) {
        console.error("[CookieBanner] Failed to save consent on server:", err);
      }
    });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-df-surface shadow-2xl shadow-black/40 ring-1 ring-white/[0.08]">
        {/* Main banner */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-df-gold/10">
              <Cookie className="h-5 w-5 text-df-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base font-bold text-white">
                Nous respectons votre vie privée
              </h3>
              <p className="mt-1 text-sm text-white/50">
                Ce site utilise des cookies essentiels au fonctionnement et,
                avec votre accord, des cookies d&apos;analyse pour améliorer votre expérience.{" "}
                <Link href="/cookies" className="font-medium text-df-gold hover:underline">
                  En savoir plus
                </Link>
              </p>
            </div>
          </div>

          {/* Detail panel */}
          {showDetails && (
            <div className="mt-4 space-y-3 rounded-xl bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Cookies essentiels</p>
                  <p className="text-xs text-white/60">Authentification, sécurité, préférences</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                  Toujours actifs
                </span>
              </div>
              <div className="border-t border-white/[0.06]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Cookies d&apos;analyse</p>
                  <p className="text-xs text-white/60">Statistiques anonymes (Plausible)</p>
                </div>
                <button
                  onClick={() => setAnalytics((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    analytics ? "bg-df-blue" : "bg-white/10"
                  }`}
                  role="switch"
                  aria-checked={analytics}
                  aria-label="Cookies d'analyse"
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-df-surface shadow transition-transform ${
                      analytics ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => accept(true)}
              disabled={pending}
              className="rounded-xl bg-df-blue px-5 py-2.5 text-sm font-bold text-df-night shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90"
            >
              Tout accepter
            </button>
            <button
              onClick={() => accept(false)}
              disabled={pending}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/5"
              aria-label="Refuser tous les cookies optionnels et n'autoriser que les cookies essentiels"
            >
              Tout refuser
            </button>
            {showDetails ? (
              <button
                onClick={() => accept(analytics)}
                disabled={pending}
                className="rounded-xl bg-df-gold px-5 py-2.5 text-sm font-bold text-df-night transition hover:bg-df-gold/80"
              >
                Confirmer mes choix
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-df-gold hover:underline"
              >
                <Settings className="h-3.5 w-3.5" /> Personnaliser
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
