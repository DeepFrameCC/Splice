"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [debug, setDebug] = useState<string>("DEBUG LOGOUT CHARGÉ");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setDebug("1/4 - Tentative de déconnexion...");
    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const csrfData = await csrfRes.json();
      setDebug(`2/4 - CSRF OK: ${csrfData.csrfToken?.substring(0, 10)}...`);

      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken: csrfData.csrfToken }),
        redirect: "manual",
      });
      setDebug(`3/4 - Signout: status=${res.status} type=${res.type}`);

      const cookies = document.cookie;
      const hasSession = cookies.includes("authjs.session-token") || cookies.includes("__Secure-authjs.session-token");
      setDebug(`4/4 - Session cookie encore là: ${hasSession} | Cookies: ${cookies.substring(0, 150)}`);

      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
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
      <p className="max-w-xs break-all rounded bg-yellow-500/20 px-2 py-1 text-[10px] text-yellow-300">
        {debug}
      </p>
    </div>
  );
}
