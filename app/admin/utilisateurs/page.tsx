import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Users, Shield } from "lucide-react";
import UsersTable from "@/components/dashboard/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUtilisateursPage() {
  const session = await auth();
  const adminId = session?.user?.id ?? "";

  const users = await db.user.findMany({
    include: { profile: true, _count: { select: { devis: true, likes: true } } },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: users.length,
    clients: users.filter((u) => u.role === "CLIENT").length,
    team: users.filter((u) => u.role === "TEAM").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };

  const rows = users.map((u) => ({
    id: u.id,
    pseudo: u.pseudo,
    email: u.email,
    role: u.role,
    displayName:
      u.profile?.nomEntreprise ??
      (`${u.profile?.prenom ?? ""} ${u.profile?.nom ?? ""}`.trim() || u.pseudo),
    initial: (u.profile?.prenom?.[0] ?? u.pseudo[0] ?? "U").toUpperCase(),
    devisCount: u._count.devis,
    likesCount: u._count.likes,
    createdAt: u.createdAt.toISOString(),
    isAdmin: u.id === adminId,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
          Utilisateurs
        </h1>
        <p className="mt-1 text-sm text-white/40">
          {stats.total} utilisateur{stats.total > 1 ? "s" : ""} — {stats.clients} clients, {stats.team} équipe, {stats.admins} admin{stats.admins > 1 ? "s" : ""}
        </p>
      </header>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "text-df-blue", bg: "bg-df-blue/5" },
          { label: "Clients", value: stats.clients, icon: Users, color: "text-white", bg: "bg-df-surface" },
          { label: "Équipe", value: stats.team, icon: Shield, color: "text-df-blue", bg: "bg-df-blue/10" },
          { label: "Admins", value: stats.admins, icon: Shield, color: "text-df-gold", bg: "bg-df-gold/10" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-df-surface p-4 shadow-sm ring-1 ring-white/[0.08]">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      <UsersTable data={rows} adminId={adminId} />
    </div>
  );
}
