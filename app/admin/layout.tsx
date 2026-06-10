import { requireActiveUser } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import NotificationBell from "@/components/dashboard/NotificationBell";
import CommandSearch from "@/components/dashboard/CommandSearch";
import type { Metadata } from "next";

// Dashboard admin — jamais indexé.
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireActiveUser();
  if (session.user?.role !== "ADMIN") redirect("/profil");
  const user = session.user;

  const [devisCount, facturesCount, contratsCount, livraisonsCount, utilisateursCount, mediasCount, avisEnAttenteCount, articlesCount, servicesCount, unreadCount, recentNotifs] = await Promise.all([
    db.devis.count(),
    db.facture.count(),
    db.contrat.count(),
    db.livraison.count(),
    db.user.count(),
    db.media.count(),
    db.avis.count({ where: { approuve: false } }),
    db.blogPost.count(),
    db.service.count(),
    db.notification.count({ where: { userId: user.id, read: false } }),
    db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const serializedNotifs = recentNotifs.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    href: n.href,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-df-night">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-df-ink/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <h2 className="font-display text-lg font-bold text-white">
              SPL<span className="text-df-gold">ICE</span> STUDIO
            </h2>
          </div>
          <Link href="/" className="hidden items-center gap-1.5 text-sm text-white/50 transition hover:text-white md:flex">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au site
          </Link>
          <CommandSearch />
          <NotificationBell initialCount={unreadCount} recentNotifications={serializedNotifs} />
        </div>
      </header>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-4 py-6 md:grid-cols-[280px_1fr] md:px-6 md:py-8">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <div className="sticky top-[4.5rem]">
            <AdminSidebar
              userName={user.name ?? "Admin"}
              userRole="Administrateur"
              counts={{ devis: devisCount, factures: facturesCount, contrats: contratsCount, livraisons: livraisonsCount, utilisateurs: utilisateursCount, medias: mediasCount, avisEnAttente: avisEnAttenteCount, articles: articlesCount, services: servicesCount }}
            />
          </div>
        </div>

        {/* Mobile horizontal nav */}
        <div className="space-y-4 md:hidden">
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {[
              { href: "/admin", label: "Dashboard" },
              { href: "/admin/devis", label: `Devis (${devisCount})` },
              { href: "/admin/factures", label: `Factures (${facturesCount})` },
              { href: "/admin/contrats", label: `Contrats (${contratsCount})` },
              { href: "/admin/livraisons", label: `Livraisons (${livraisonsCount})` },
              { href: "/admin/utilisateurs", label: `Users (${utilisateursCount})` },
              { href: "/admin/medias", label: `Médias (${mediasCount})` },
              { href: "/admin/avis", label: `Avis (${avisEnAttenteCount})` },
              { href: "/admin/blog", label: `Articles (${articlesCount})` },
              { href: "/admin/services", label: `Services (${servicesCount})` },
              { href: "/admin/statistiques", label: "Stats" },
              { href: "/admin/comptabilite", label: "Compta" },
              { href: "/admin/journal", label: "Journal" },
              { href: "/admin/equipe", label: "Équipe" },
              { href: "/admin/parametres", label: "Paramètres" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/60 transition hover:bg-df-gold hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <main className="min-w-0">{children}</main>
      </section>
    </div>
  );
}
