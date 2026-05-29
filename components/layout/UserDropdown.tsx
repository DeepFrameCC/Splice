"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Shield, FileText, Settings, LogOut } from "lucide-react";

interface UserDropdownProps {
  name: string;
  role: string;
}

export default function UserDropdown({ name, role }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const logoutFormRef = useRef<HTMLFormElement>(null);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken((d as Record<string, string>).csrfToken ?? ""))
      .catch(() => {});
  }, []);

  const initial = name.charAt(0).toUpperCase();
  const isAdmin = role === "ADMIN";
  const isTeamOrAdmin = role === "ADMIN" || role === "TEAM";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-df-blue text-sm font-bold text-white transition hover:bg-df-blue/80"
        aria-label="Menu profil"
        aria-expanded={open}
      >
        {initial}
      </button>

      {/* Hidden logout form — submits to Auth.js as full browser navigation */}
      <form
        ref={logoutFormRef}
        method="POST"
        action="/api/auth/signout"
        style={{ display: "none" }}
      >
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="callbackUrl" value="/" />
      </form>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/[0.08] bg-df-surface py-2 shadow-2xl shadow-black/40">
          {/* User info */}
          <div className="border-b border-white/[0.06] px-4 pb-2">
            <p className="font-bold text-white">{name}</p>
            <p className={`text-xs font-medium ${isAdmin ? "text-df-gold" : "text-white/50"}`}>
              {role}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <User className="h-4 w-4" />
              Mon profil
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <Shield className="h-4 w-4" />
                Administration
              </Link>
            )}

            {isTeamOrAdmin && (
              <Link
                href="/admin/blog"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <FileText className="h-4 w-4" />
                Mes articles
              </Link>
            )}

            <Link
              href="/profil/parametres"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </div>

          <div className="border-t border-white/[0.06] pt-1">
            <button
              type="button"
              onClick={() => logoutFormRef.current?.submit()}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
