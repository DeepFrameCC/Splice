import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { FOUNDER_LABEL } from "@/lib/pricing";
import { Shield, Users, Crown } from "lucide-react";
import { InviteForm, TeamMemberCard } from "@/components/dashboard/EquipeActions";

export const dynamic = "force-dynamic";

export default async function AdminEquipePage() {
  const session = await auth();
  const currentUserId = (session?.user as { id: string } | undefined)?.id;

  const teamMembers = await db.user.findMany({
    where: { role: { in: ["ADMIN", "TEAM"] } },
    include: { profile: { select: { prenom: true, nom: true, avatarUrl: true } } },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const admins = teamMembers.filter((m) => m.role === "ADMIN");
  const team = teamMembers.filter((m) => m.role === "TEAM");

  const serialized = teamMembers.map((m) => ({
    id: m.id,
    pseudo: m.pseudo,
    email: m.email,
    role: m.role,
    createdAt: m.createdAt.toISOString(),
    profile: m.profile
      ? { prenom: m.profile.prenom, nom: m.profile.nom, avatarUrl: m.profile.avatarUrl }
      : null,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
          Équipe
        </h1>
        <p className="mt-1 text-sm text-df-ink/50">
          Gestion des rôles et accès — {teamMembers.length} membre{teamMembers.length > 1 ? "s" : ""}
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-df-blue/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-df-gold/10">
            <Crown className="h-4 w-4 text-df-gold" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-df-ink">{admins.length}</p>
          <p className="text-xs text-df-ink/50">Administrateurs</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-df-blue/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-df-blue/5">
            <Users className="h-4 w-4 text-df-blue" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-df-ink">{team.length}</p>
          <p className="text-xs text-df-ink/50">Membres équipe</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-df-blue/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <Shield className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-df-ink">{teamMembers.length}</p>
          <p className="text-xs text-df-ink/50">Total</p>
        </div>
      </div>

      {/* Fondateurs statiques */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
        <div className="border-b border-df-blue/5 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-df-ink">Fondateurs</h2>
          <p className="mt-0.5 text-xs text-df-ink/40">Comptes principaux de Deepframe</p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {(Object.entries(FOUNDER_LABEL) as [string, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3 rounded-xl bg-df-cream/40 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-df-ink text-sm font-bold text-df-gold">
                {label.charAt(1).toUpperCase()}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-df-ink">{label}</p>
                <p className="text-[10px] font-bold uppercase text-df-ink/30">{key}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite form */}
      <InviteForm />

      {/* Team members grid */}
      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-df-ink">
          Membres avec accès
        </h2>
        {serialized.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-df-blue/10">
            <Users className="mx-auto h-10 w-10 text-df-blue/20" />
            <p className="mt-4 text-sm text-df-ink/40">Aucun membre dans l&apos;équipe.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serialized.map((m) => (
              <TeamMemberCard key={m.id} member={m} isSelf={m.id === currentUserId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
