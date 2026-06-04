"use client";

import { useState, useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

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
 * Why client-side + hard navigation instead of a `<form action={logoutAction}>`
 * that redirects server-side:
 *  - The old flow redirected to "/" from inside the Server Action. That forced
 *    a re-render of the *current* protected route, whose layout calls auth() →
 *    now null → redirect("/login") (and on /admin, an extra "/profil" hop). The
 *    competing redirects surfaced as a transient error.
 *  - Redirecting to "/" also re-mounted the homepage cinematic intro
 *    (LandingAnimations), producing the brief black screen.
 *
 * Here we clear the session via the action (no redirect), keep a full-screen
 * overlay up the whole time, then do a single hard navigation to "/". One clean
 * transition, no flash, no error.
 */
export function LogoutButton({ variant = "pill" }: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();
  const [leaving, setLeaving] = useState(false);
  const busy = pending || leaving;

  function handleLogout() {
    if (busy) return;
    setLeaving(true);
    startTransition(async () => {
      try {
        await logoutAction();
      } catch (err) {
        // Even if the action throws, the cookies are almost certainly cleared;
        // navigate home regardless so the user is never stuck.
        console.error("[logout] action failed, navigating home anyway", err);
      } finally {
        window.location.assign("/");
      }
    });
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
