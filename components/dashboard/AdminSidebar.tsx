"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  FileSignature,
  Users,
  MessageSquare,
  Image as ImageIcon,
  ScrollText,
  BarChart3,
  BookOpen,
  UserCog,
  Settings,
  ChevronRight,
  Newspaper,
  Clapperboard,
  Package,
} from "lucide-react";

type Props = {
  userName: string;
  userRole: string;
  counts: {
    devis: number;
    factures: number;
    contrats: number;
    livraisons: number;
    utilisateurs: number;
    medias: number;
    avisEnAttente: number;
    articles: number;
    services: number;
  };
};

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, countKey: null },
  { href: "/admin/devis", label: "Devis", icon: FileText, countKey: "devis" as const },
  { href: "/admin/factures", label: "Factures", icon: Receipt, countKey: "factures" as const },
  { href: "/admin/contrats", label: "Contrats", icon: FileSignature, countKey: "contrats" as const },
  { href: "/admin/livraisons", label: "Livraisons", icon: Package, countKey: "livraisons" as const },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, countKey: "utilisateurs" as const },
  { href: "/admin/medias", label: "Médias", icon: ImageIcon, countKey: "medias" as const },
  { href: "/admin/avis", label: "Avis", icon: MessageSquare, countKey: "avisEnAttente" as const },
  { href: "/admin/blog", label: "Articles", icon: Newspaper, countKey: "articles" as const },
  { href: "/admin/services", label: "Services", icon: Clapperboard, countKey: "services" as const },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3, countKey: null },
  { href: "/admin/comptabilite", label: "Comptabilité", icon: BookOpen, countKey: null },
  { href: "/admin/journal", label: "Journal", icon: ScrollText, countKey: null },
  { href: "/admin/equipe", label: "Équipe", icon: UserCog, countKey: null },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings, countKey: null },
];

export default function AdminSidebar({ userName, userRole, counts }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full flex-col rounded-3xl bg-df-surface p-6 ring-1 ring-white/[0.08]">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/admin" className="block">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            SPL<span className="text-df-gold">ICE</span> STUDIO
          </h2>
          <p className="mt-1 text-xs font-medium text-white/40">Administration</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const count = item.countKey ? counts[item.countKey] : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                active
                  ? "bg-df-gold text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 ${
                  active ? "text-white" : "text-white/45 group-hover:text-df-gold"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {count !== null && count > 0 && (
                <span
                  className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                    active
                      ? "bg-white/25 text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {count}
                </span>
              )}
              {active && (
                <ChevronRight className="h-4 w-4 text-white/90" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="my-6 border-t border-white/10" />

      {/* User info + logout */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-df-gold text-sm font-bold text-white">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{userName}</p>
          <p className="text-[11px] font-medium text-df-gold">{userRole}</p>
        </div>
        <LogoutButton variant="icon" />
      </div>
    </aside>
  );
}
