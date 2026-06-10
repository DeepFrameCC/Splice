"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";

type Variant = "pill" | "menu" | "icon";

const VARIANT_CLASS: Record<Variant, string> = {
  pill: "shrink-0 inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60",
  menu: "flex w-full items-center gap-3 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60",
  icon: "rounded-xl p-2 text-white/40 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
};

interface LogoutButtonProps {
  variant?: Variant;
}

/**
 * Logout control used everywhere (profil sidebar, admin sidebar, nav dropdown).
 *
 * Why a hard navigation to /api/logout instead of the logoutAction Server
 * Action: on Cloudflare Workers, cookie deletion emitted through `cookies()`
 * inside a Server Action does not reliably reach the browser for `__Secure-`
 * prefixed Auth.js cookies — the session survived and the user stayed logged
 * in. The /api/logout route writes raw Set-Cookie headers on a 302 response,
 * which the browser applies unconditionally during the navigation.
 */
export function LogoutButton({ variant = "pill" }: LogoutButtonProps) {
  const [leaving, setLeaving] = useState(false);
  const busy = leaving;

  function handleLogout() {
    if (busy) return;
    setLeaving(true);
    window.location.assign("/api/logout");
  }

  const iconSize = variant === "menu" ? "h-4 w-4" : variant === "icon" ? "h-4 w-4" : "h-3 w-3";

  return (
    <>
      <button
        type="button"
        onClick={handleLogout}
        disabled={busy}
        aria-label="Se déconnecter"
        aria-busy={busy}
        className={VARIANT_CLASS[variant]}
      >
        {busy ? <Loader2 className={`${iconSize} animate-spin`} /> : <LogOut className={iconSize} />}
        {variant !== "icon" && <span>Déconnexion</span>}
      </button>

      {leaving && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-[#0E0E22] text-white"
        >
          <Loader2 className="h-6 w-6 animate-spin text-[#F36B1F]" />
          <p className="text-sm font-medium tracking-wide text-white/80">Déconnexion…</p>
        </div>
      )}
    </>
  );
}
