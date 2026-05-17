"use client";

import { useTransition } from "react";
import { changerRoleUtilisateur } from "@/app/actions/admin";
import type { Role } from "@prisma/client";

const ROLE_LABELS: Record<Role, string> = {
  CLIENT: "Client",
  TEAM: "Équipe",
  ADMIN: "Admin",
};

const ROLE_COLORS: Record<Role, string> = {
  CLIENT: "bg-df-surface text-white",
  TEAM: "bg-df-blue/10 text-df-blue",
  ADMIN: "bg-df-gold/20 text-df-gold",
};

export default function RoleSelect({ userId, currentRole, isSelf }: { userId: string; currentRole: Role; isSelf: boolean }) {
  const [pending, startTransition] = useTransition();

  if (isSelf) {
    return (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_COLORS[currentRole]}`}>
        {ROLE_LABELS[currentRole]} (vous)
      </span>
    );
  }

  return (
    <select
      value={currentRole}
      disabled={pending}
      onChange={(e) => {
        const newRole = e.target.value as Role;
        startTransition(() => {
          changerRoleUtilisateur(userId, newRole);
        });
      }}
      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none transition ${ROLE_COLORS[currentRole]} ${pending ? "opacity-50" : ""}`}
    >
      {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
      ))}
    </select>
  );
}
