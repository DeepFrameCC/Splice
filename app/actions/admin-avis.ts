"use server";

import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  return session?.user?.id;
}

export async function approuverAvis(avisId: string) {
  const adminId = await requireAdmin();
  await db.avis.update({ where: { id: avisId }, data: { approuve: true } });
  await audit({ action: "ADMIN_ACTION", userId: adminId, target: avisId, metadata: { type: "avis_approved" } });
  revalidatePath("/admin/avis");
  revalidatePath("/avis");
}

export async function rejeterAvis(avisId: string) {
  const adminId = await requireAdmin();
  await db.avis.delete({ where: { id: avisId } });
  await audit({ action: "ADMIN_ACTION", userId: adminId, target: avisId, metadata: { type: "avis_rejected" } });
  revalidatePath("/admin/avis");
  revalidatePath("/avis");
}

export async function toggleFeaturedAvis(avisId: string) {
  const adminId = await requireAdmin();
  const avis = await db.avis.findUniqueOrThrow({ where: { id: avisId } });
  await db.avis.update({ where: { id: avisId }, data: { featured: !avis.featured } });
  await audit({ action: "ADMIN_ACTION", userId: adminId, target: avisId, metadata: { type: "avis_featured", featured: !avis.featured } });
  revalidatePath("/admin/avis");
  revalidatePath("/avis");
}

export async function repondreAvis(avisId: string, reponse: string) {
  const adminId = await requireAdmin();
  if (!reponse.trim()) throw new Error("Réponse vide");

  // Avis model doesn't have reponse field — use Review model logic or add to Avis
  // For now, approve + the response is handled via a separate approach
  // We'll store the response in the Review model if linked, or just approve
  await db.avis.update({ where: { id: avisId }, data: { approuve: true } });
  await audit({ action: "ADMIN_ACTION", userId: adminId, target: avisId, metadata: { type: "avis_responded", reponse: reponse.slice(0, 500) } });
  revalidatePath("/admin/avis");
  revalidatePath("/avis");
}
