"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [debug, setDebug] = useState<string>("LOGOUT v2 PRET");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // 1. Check session BEFORE signout
      const beforeRes = await fetch("/api/auth/session");
      const beforeSession = await beforeRes.json();
      const beforeUser = beforeSession?.user?.name || beforeSession?.user?.email || "aucun";
      setDebug(`AVANT: user=${beforeUser}`);

      // 2. Get CSRF
      const csrfRes = await fetch("/api/auth/csrf");
      const csrfData = await csrfRes.json();

      // 3. Signout with redirect follow (not manual)
      const signoutRes = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken: csrfData.csrfToken }),
        redirect: "follow",
      });
      setDebug(`AVANT: user=${beforeUser} | SIGNOUT: status=${signoutRes.status} url=${signoutRes.url}`);

      // 4. Check session AFTER signout
      const afterRes = await fetch("/api/auth/session");
      const afterSession = await afterRes.json();
      const afterUser = afterSession?.user?.name || afterSession?.user?.email || "aucun";
      setDebug(`AVANT: ${beforeUser} | APRES: ${afterUser} | status=${signoutRes.status}`);

      // 5. Wait 6s so user can read debug, then redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDebug(`ERREUR: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      >
        <LogOut className="h-3 w-3" />
        {loading ? "Déconnexion..." : "Déconnexion"}
      </button>
      <p className="max-w-sm break-all rounded bg-red-500/30 px-2 py-1 text-[11px] font-bold text-white">
        {debug}
      </p>
    </div>
  );
}
