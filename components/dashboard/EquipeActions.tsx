"use client";

import { useState, useTransition } from "react";
import { inviteTeamMember, revokeTeamAccess, changeTeamRole } from "@/app/actions/admin-equipe";
import { UserPlus, Shield, ShieldOff, Crown, Users } from "lucide-react";

export function InviteForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await inviteTeamMember(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Rôle mis à jour avec succès." });
      }
    });
  }

  return (
    <div className="rounded-2xl bg-df-surface p-6 shadow-sm ring-1 ring-white/[0.08]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-df-blue/5">
          <UserPlus className="h-4 w-4 text-df-blue" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-white">Promouvoir un utilisateur</h2>
          <p className="text-xs text-white/30">L&apos;utilisateur doit avoir un compte existant</p>
        </div>
      </div>

      <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="invite-email" className="mb-1 block text-xs font-bold text-white/50">
            Email
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="membre@email.com"
            className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white outline-none transition focus:border-df-blue focus:ring-2 focus:ring-df-blue/20"
          />
        </div>
        <div>
          <label htmlFor="invite-role" className="mb-1 block text-xs font-bold text-white/50">
            Rôle
          </label>
          <select
            id="invite-role"
            name="role"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white outline-none transition focus:border-df-blue focus:ring-2 focus:ring-df-blue/20"
          >
            <option value="TEAM">Équipe</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-df-blue px-5 py-2.5 text-xs font-bold text-white transition hover:bg-df-blue-dark disabled:opacity-50"
        >
          {isPending ? "..." : "Promouvoir"}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm font-bold ${message.type === "error" ? "text-red-600" : "text-emerald-400"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

type TeamMember = {
  id: string;
  pseudo: string;
  email: string;
  role: string;
  createdAt: string;
  profile: { prenom: string | null; nom: string | null; avatarUrl: string | null } | null;
};

export function TeamMemberCard({ member, isSelf }: { member: TeamMember; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRevoke() {
    if (!confirm(`Révoquer l'accès de @${member.pseudo} ? Il redeviendra CLIENT.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await revokeTeamAccess(member.id);
      if (result.error) setError(result.error);
    });
  }

  function handleChangeRole(newRole: "TEAM" | "ADMIN") {
    setError(null);
    startTransition(async () => {
      const result = await changeTeamRole(member.id, newRole);
      if (result.error) setError(result.error);
    });
  }

  const isAdmin = member.role === "ADMIN";
  const fullName = [member.profile?.prenom, member.profile?.nom].filter(Boolean).join(" ");

  return (
    <div className="relative rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08] transition hover:shadow-md">
      {isAdmin && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-df-gold/10 px-2 py-0.5 text-[10px] font-bold text-df-gold">
          <Crown className="h-2.5 w-2.5" /> Admin
        </span>
      )}

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-df-blue text-lg font-bold text-white">
          {member.pseudo.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold text-white">
            @{member.pseudo}
          </p>
          {fullName && (
            <p className="truncate text-xs text-white/40">{fullName}</p>
          )}
          <p className="truncate text-xs text-white/30">{member.email}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-1.5">
          {isAdmin ? (
            <Shield className="h-3.5 w-3.5 text-df-gold" />
          ) : (
            <Users className="h-3.5 w-3.5 text-df-blue" />
          )}
          <span className={`text-xs font-bold ${isAdmin ? "text-df-gold" : "text-df-blue"}`}>
            {isAdmin ? "Administrateur" : "Équipe"}
          </span>
        </div>

        {!isSelf && (
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={() => handleChangeRole("TEAM")}
                disabled={isPending}
                className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-df-blue transition hover:bg-df-blue/5 disabled:opacity-50"
              >
                → Équipe
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleChangeRole("ADMIN")}
                disabled={isPending}
                className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-df-gold transition hover:bg-df-gold/5 disabled:opacity-50"
              >
                → Admin
              </button>
            )}
            <button
              type="button"
              onClick={handleRevoke}
              disabled={isPending}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-red-600 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              <ShieldOff className="h-3 w-3" />
              Révoquer
            </button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
      {isSelf && <p className="mt-2 text-[10px] text-white/20">Vous ne pouvez pas modifier votre propre rôle.</p>}
    </div>
  );
}
