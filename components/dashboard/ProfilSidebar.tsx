"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  User,
  FileText,
  Receipt,
  FileSignature,
  Heart,
  Bell,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";

type Props = {
  userName: string;
  isAdmin: boolean;
  counts: {
    devis: number;
    factures: number;
    contrats: number;
    likes: number;
  };
  notificationBell?: React.ReactNode;
};

const navItems = [
  { href: "/profil", label: "Mon profil", icon: User, countKey: null, exact: true },
  { href: "/profil/devis", label: "Mes devis", icon: FileText, countKey: "devis" as const },
  { href: "/profil/factures", label: "Mes factures", icon: Receipt, countKey: "factures" as const },
  { href: "/profil/contrats", label: "Mes contrats", icon: FileSignature, countKey: "contrats" as const },
  { href: "/profil/likes", label: "Mes likes", icon: Heart, countKey: "likes" as const },
  { href: "/profil/notifications", label: "Notifications", icon: Bell, countKey: null },
  { href: "/profil/parametres", label: "Paramètres", icon: Settings, countKey: null },
];

export default function ProfilSidebar({ userName, isAdmin, counts, notificationBell }: Props) {
  const pathname = usePathname();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [debug, setDebug] = useState("DEBUG SIDEBAR v2 PRET");

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // 1. Session BEFORE
      const beforeRes = await fetch("/api/auth/session");
      const beforeData = await beforeRes.json();
      const beforeUser = beforeData?.user?.name || beforeData?.user?.email || "aucun";
      setDebug(`AVANT: ${beforeUser}`);

      // 2. CSRF
      const csrfRes = await fetch("/api/auth/csrf");
      const csrfData = await csrfRes.json();

      // 3. Signout
      const signoutRes = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ csrfToken: csrfData.csrfToken }),
        redirect: "follow",
      });
      setDebug(`AVANT: ${beforeUser} | SIGNOUT: ${signoutRes.status}`);

      // 4. Session AFTER
      const afterRes = await fetch("/api/auth/session");
      const afterData = await afterRes.json();
      const afterUser = afterData?.user?.name || afterData?.user?.email || "aucun";
      setDebug(`AVANT: ${beforeUser} | APRES: ${afterUser} | status=${signoutRes.status}`);

      // 5. Redirect after 6s
      setTimeout(() => { window.location.href = "/"; }, 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDebug(`ERREUR: ${msg}`);
      setLogoutLoading(false);
    }
  };

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full flex-col rounded-3xl bg-df-ink p-6 shadow-xl">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/profil" className="block">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            SPL<span className="text-df-gold">ICE</span>
          </h2>
          <p className="mt-1 text-xs font-medium text-white/40">Mon espace</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const count = item.countKey ? counts[item.countKey] : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                active
                  ? "bg-gradient-to-r from-df-blue to-[#0E0E22] text-white shadow-lg shadow-df-blue/20 ring-1 ring-df-blue/30"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 ${
                  active ? "text-df-gold" : "text-white/40 group-hover:text-df-gold"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {count !== null && count > 0 && (
                <span
                  className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active
                      ? "bg-df-gold text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {count}
                </span>
              )}
              {active && <ChevronRight className="h-4 w-4 text-df-gold" />}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className="mt-4 flex items-center gap-3 rounded-2xl bg-df-gold/10 px-4 py-3 text-sm font-bold text-df-gold transition hover:bg-df-gold/20"
          >
            <Shield className="h-5 w-5" />
            <span className="flex-1">Administration</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </nav>

      {/* Separator */}
      <div className="my-6 border-t border-white/10" />

      {/* User info + logout */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-df-blue to-[#0E0E22] text-sm font-bold text-white ring-1 ring-white/10">
          {userName.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{userName || "Utilisateur"}</p>
          <p className="text-[11px] font-medium text-df-gold">Client</p>
        </div>
        {notificationBell}
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          aria-label="Se déconnecter"
          className="rounded-xl p-2 text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 break-all rounded bg-red-500/30 px-2 py-1 text-[11px] font-bold text-white">
        {debug}
      </p>
    </aside>
  );
}
