import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as any;
  if (user?.role !== "ADMIN") redirect("/profil");

  const [devisCount, facturesCount, contratsCount] = await Promise.all([
    db.devis.count(),
    db.facture.count(),
    db.contrat.count(),
  ]);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1440px] gap-8 px-4 py-6 md:grid-cols-[280px_1fr] md:px-6 md:py-8">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div className="sticky top-8">
          <AdminSidebar
            userName={user.name ?? user.pseudo ?? "Admin"}
            userRole="Administrateur"
            counts={{ devis: devisCount, factures: facturesCount, contrats: contratsCount }}
          />
        </div>
      </div>

      {/* Mobile header + horizontal nav */}
      <div className="space-y-4 md:hidden">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-df-ink">
            DEEP<span className="text-df-gold">FRAME</span>
          </h2>
          <p className="text-xs font-medium text-df-blue/60">Admin</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-2">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/devis", label: `Devis (${devisCount})` },
            { href: "/admin/factures", label: `Factures (${facturesCount})` },
            { href: "/admin/contrats", label: `Contrats (${contratsCount})` },
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
