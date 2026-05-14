import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ProfilSidebar from "@/components/dashboard/ProfilSidebar";
import NotificationBell from "@/components/dashboard/NotificationBell";

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user?.id) redirect("/login");

  const isAdmin = user.role === "ADMIN";

  const [devisCount, facturesCount, contratsCount, likesCount, unreadCount, recentNotifs] = await Promise.all([
    db.devis.count({ where: { userId: user.id } }),
    db.facture.count({ where: { userId: user.id } }),
    db.contrat.count({ where: { userId: user.id } }),
    db.like.count({ where: { userId: user.id } }),
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

  const displayName = user.name ?? user.pseudo ?? "Utilisateur";

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1440px] gap-8 px-4 py-6 md:grid-cols-[280px_1fr] md:px-6 md:py-8">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div className="sticky top-8">
          <ProfilSidebar
            userName={displayName}
            isAdmin={isAdmin}
            counts={{ devis: devisCount, factures: facturesCount, contrats: contratsCount, likes: likesCount }}
            notificationBell={
              <NotificationBell initialCount={unreadCount} recentNotifications={serializedNotifs} />
            }
          />
        </div>
      </div>

      {/* Mobile header + horizontal nav */}
      <div className="space-y-4 md:hidden">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-df-ink">
            DEEP<span className="text-df-gold">FRAME</span>
          </h2>
          <p className="text-xs font-medium text-df-blue/60">Mon espace</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-2">
          {[
            { href: "/profil", label: "Profil" },
            { href: "/profil/devis", label: `Devis (${devisCount})` },
            { href: "/profil/factures", label: `Factures (${facturesCount})` },
            { href: "/profil/contrats", label: `Contrats (${contratsCount})` },
            { href: "/profil/likes", label: `Likes (${likesCount})` },
            { href: "/profil/parametres", label: "Paramètres" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full border border-df-blue/15 px-4 py-2 text-xs font-bold text-df-blue transition hover:bg-df-blue hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <main className="min-w-0">{children}</main>
    </section>
  );
}
