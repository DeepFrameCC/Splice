"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Non autorisé");
  return session.user;
}

const inviteSchema = z.object({
  email: z.string().email("Email invalide"),
  role: z.enum(["TEAM", "ADMIN"]),
});

export async function inviteTeamMember(formData: FormData) {
  const admin = await requireAdmin();
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  const parsed = inviteSchema.safeParse({ email, role });
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Données invalides" };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!existing) {
    return { error: "Aucun utilisateur trouvé avec cet email. L'utilisateur doit d'abord créer un compte." };
  }

  if (existing.role === parsed.data.role) {
    return { error: `Cet utilisateur a déjà le rôle ${parsed.data.role}.` };
  }

  await db.user.update({
    where: { id: existing.id },
    data: { role: parsed.data.role as Role },
  });

  await db.auditLog.create({
    data: {
      userId: admin.id,
      action: "ADMIN_ACTION",
      target: existing.id,
      metadata: { type: "role_change", email: parsed.data.email, newRole: parsed.data.role },
    },
  });

  revalidatePath("/admin/equipe");
  return { success: true };
}

export async function revokeTeamAccess(userId: string) {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { error: "Vous ne pouvez pas révoquer votre propre accès." };
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!target) return { error: "Utilisateur introuvable." };
  if (target.role === "CLIENT") return { error: "Cet utilisateur est déjà CLIENT." };

  await db.user.update({
    where: { id: userId },
    data: { role: "CLIENT" },
  });

  await db.auditLog.create({
    data: {
      userId: admin.id,
      action: "ADMIN_ACTION",
      target: userId,
      metadata: { type: "role_revoke", email: target.email, previousRole: target.role },
    },
  });

  revalidatePath("/admin/equipe");
  return { success: true };
}

export async function changeTeamRole(userId: string, newRole: "TEAM" | "ADMIN") {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { error: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!target) return { error: "Utilisateur introuvable." };

  await db.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  await db.auditLog.create({
    data: {
      userId: admin.id,
      action: "ADMIN_ACTION",
      target: userId,
      metadata: { type: "role_change", email: target.email, previousRole: target.role, newRole },
    },
  });

  revalidatePath("/admin/equipe");
  return { success: true };
}
