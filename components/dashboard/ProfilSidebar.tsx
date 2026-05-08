"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, FileText, Receipt, FileSignature, Heart, Shield } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/profil", label: "Mon profil", icon: User, exact: true },
  { href: "/profil/devis", label: "Mes devis", icon: FileText },
  { href: "/profil/factures", label: "Mes factures", icon: Receipt },
  { href: "/profil/contrats", label: "Mes contrats", icon: FileSignature },
  { href: "/profil/likes", label: "Mes likes", icon: Heart },
];

export default function ProfilSidebar({ userName, isAdmin }: { userName: string; isAdmin: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="rounded-3xl bg-df-cream p-4">
      <p className="px-3 pt-2 font-display italic text-df-blue">{userName}</p>
      <nav className="mt-4 space-y-1">
        {links.map((l) => {
          const active = isActive(l.href, l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 font-bold transition ${
                active
                  ? "bg-df-blue text-white"
                  : "text-df-blue hover:bg-df-blue/10"
              }`}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className="mt-2 flex items-center gap-3 rounded-xl bg-df-blue px-3 py-2 font-bold text-df-gold"
          >
            <Shield className="h-4 w-4" /> Admin
          </Link>
        )}
      </nav>
      <form action={logoutAction} className="mt-6">
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-df-blue/70 hover:text-df-blue">
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </form>
    </aside>
  );
}
