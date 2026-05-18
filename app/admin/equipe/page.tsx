import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { FOUNDER_LABEL } from "@/lib/pricing";
import { Shield, Users, Crown } from "lucide-react";
import { InviteForm, TeamMemberCard } from "@/components/dashboard/EquipeActions";

export const dynamic = "force-dynamic";

export default async function AdminEquipePage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

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
        <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
          Équipe
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Gestion des rôles et accès — {teamMembers.length} membre{teamMembers.length > 1 ? "s" : ""}
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-df-gold/10">
            <Crown className="h-4 w-4 text-df-gold" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">{admins.length}</p>
          <p className="text-xs text-white/40">Administrateurs</p>
        </div>
        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Users className="h-4 w-4 text-white/50" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">{team.length}</p>
          <p className="text-xs text-white/40">Membres équipe</p>
        </div>
        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">{teamMembers.length}</p>
          <p className="text-xs text-white/40">Total</p>
        </div>
      </div>

      {/* Fondateurs statiques */}
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-white">Fondateurs</h2>
          <p className="mt-0.5 text-xs text-white/30">Comptes principaux de Deepframe</p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {(Object.entries(FOUNDER_LABEL) as [string, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-df-ink text-sm font-bold text-df-gold">
                {label.charAt(1).toUpperCase()}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">{label}</p>
                <p className="text-[10px] font-bold uppercase text-white/20">{key}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite form */}
      <InviteForm />

      {/* Team members grid */}
      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-white">
          Membres avec accès
        </h2>
        {serialized.length === 0 ? (
          <div className="rounded-2xl bg-df-surface p-12 text-center shadow-sm ring-1 ring-white/[0.08]">
            <Users className="mx-auto h-10 w-10 text-white/20" />
            <p className="mt-4 text-sm text-white/30">Aucun membre dans l&apos;équipe.</p>
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
