"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [debug, setDebug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setDebug("Tentative de déconnexion...");
    try {
      // Step 1: get CSRF token
      const csrfRes = await fetch("/api/auth/csrf");
      const csrfData = await csrfRes.json();
      setDebug(`CSRF OK: ${csrfData.csrfToken?.substring(0, 10)}...`);

      // Step 2: POST to signout
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken: csrfData.csrfToken }),
        redirect: "manual",
      });
      setDebug(`Signout response: ${res.status} ${res.type}`);

      // Step 3: check cookies
      const cookies = document.cookie;
      const hasSession = cookies.includes("authjs.session-token") || cookies.includes("__Secure-authjs.session-token");
      setDebug(`Status: ${res.status} | Cookie session encore là: ${hasSession} | Cookies: ${cookies.substring(0, 100)}`);

      // Step 4: redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
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
      {debug && (
        <p className="max-w-xs break-all rounded bg-yellow-500/20 px-2 py-1 text-[10px] text-yellow-300">
          {debug}
        </p>
      )}
    </div>
  );
}
