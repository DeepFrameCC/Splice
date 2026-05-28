"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState("LOGOUT v3 PRET");

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Step 1: GET to see what cookies the server receives
      const diagRes = await fetch("/api/logout");
      const diagData = await diagRes.json();
      setDebug(`COOKIES RECUS: ${JSON.stringify(diagData.parsedCookies)} (${diagData.count})`);

      // Step 2: POST to clear them
      const clearRes = await fetch("/api/logout", { method: "POST" });
      const clearData = await clearRes.json();
      setDebug(`RECUS: ${JSON.stringify(diagData.parsedCookies)} | CLEARED: ${JSON.stringify(clearData.cleared)}`);

      // Step 3: Check session after clear
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const user = sessionData?.user?.name || sessionData?.user?.email || "AUCUN";
      setDebug(`COOKIES(${diagData.count}): ${JSON.stringify(diagData.parsedCookies)} | APRES CLEAR session=${user}`);

      setTimeout(() => { window.location.href = "/"; }, 8000);
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
      <p className="max-w-md break-all rounded bg-red-500/30 px-2 py-1 text-[10px] font-bold text-white">
        {debug}
      </p>
    </div>
  );
}
