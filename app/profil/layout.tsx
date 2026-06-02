import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import ProfilSidebar from "@/components/dashboard/ProfilSidebar";
import NotificationBell from "@/components/dashboard/NotificationBell";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = session.user;

  const isAdmin = user.role === "ADMIN";

  let devisCount = 0;
  let facturesCount = 0;
  let contratsCount = 0;
  let likesCount = 0;
  let unreadCount = 0;
  let recentNotifs: any[] = [];

  try {
    const [dCount, fCount, cCount, lCount, uCount, notifs] = await Promise.all([
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
    devisCount = dCount;
    facturesCount = fCount;
    contratsCount = cCount;
    likesCount = lCount;
    unreadCount = uCount;
    recentNotifs = notifs;
  } catch (e) {
    console.error("[profil-layout] Database counts failed:", e);
  }

  const serializedNotifs = recentNotifs.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    href: n.href,
    createdAt: n.createdAt.toISOString(),
  }));

  const displayName = user.name ?? "Utilisateur";

  return (
    <>
      <NavWrapper />
      <div className="bg-[#0E0E22] text-white" style={{ paddingTop: "calc(80px + 2rem)" }}>
        <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-[1440px] gap-8 px-4 py-6 md:grid-cols-[280px_1fr] md:px-6 md:py-8">
          {/* Retour au site — full-width above the grid */}
          <div className="col-span-full">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour au site
            </Link>
          </div>
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
              <h2 className="font-display text-xl font-bold text-white">
                SPL<span className="text-df-gold">ICE</span>
              </h2>
              <p className="text-xs font-medium text-white/60">Mon espace</p>
            </div>
            <nav className="flex gap-2 overflow-x-auto pb-2">
              {[
                { href: "/profil", label: "Profil" },
                { href: "/profil/devis", label: `Devis (${devisCount})` },
                { href: "/profil/factures", label: `Factures (${facturesCount})` },
                { href: "/profil/contrats", label: `Contrats (${contratsCount})` },
                { href: "/profil/abonnement", label: "Abonnement" },
                { href: "/profil/likes", label: `Likes (${likesCount})` },
                { href: "/profil/parametres", label: "Paramètres" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <LogoutButton />
            </nav>
          </div>

          <main className="min-w-0">{children}</main>
        </section>
      </div>
      <Footer />
    </>
  );
}
