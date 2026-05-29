"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";

/**
 * Logout via hidden form submission to Auth.js signout endpoint.
 * fetch() cannot reliably clear __Secure- prefixed HttpOnly cookies.
 * A real <form> submission is a full browser navigation that processes
 * Set-Cookie headers correctly.
 */
export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Pre-fetch CSRF token on mount so logout is instant
  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken((d as Record<string, string>).csrfToken ?? ""))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    setLoading(true);
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <>
      {/* Hidden form that submits to Auth.js signout — full browser navigation */}
      <form
        ref={formRef}
        method="POST"
        action="/api/auth/signout"
        style={{ display: "none" }}
      >
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="callbackUrl" value="/" />
      </form>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading || !csrfToken}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      >
        <LogOut className="h-3 w-3" />
        {loading ? "Déconnexion..." : "Déconnexion"}
      </button>
    </>
  );
}
