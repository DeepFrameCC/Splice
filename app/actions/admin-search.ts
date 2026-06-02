"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type SearchResult = {
  id: string;
  type: "devis" | "facture" | "contrat" | "user";
  label: string;
  sub: string;
  href: string;
};

export async function adminSearch(query: string): Promise<SearchResult[]> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" || !query || query.length < 2) return [];

  const q = query.trim();
  const results: SearchResult[] = [];

  const [devis, factures, contrats, users] = await Promise.all([
    db.devis.findMany({
      where: {
        OR: [
          { numero: { contains: q, mode: "insensitive" } },
          { nomContact: { contains: q, mode: "insensitive" } },
          { nomEntreprise: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, numero: true, nomContact: true, nomEntreprise: true, status: true },
      take: 5,
    }),
    db.facture.findMany({
      where: {
        OR: [
          { numero: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, numero: true, devis: { select: { nomContact: true } } },
      take: 5,
    }),
    db.contrat.findMany({
      where: {
        OR: [
          { numero: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, numero: true, devis: { select: { nomContact: true } } },
      take: 5,
    }),
    db.user.findMany({
      where: {
        OR: [
          { pseudo: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, pseudo: true, email: true, role: true },
      take: 5,
    }),
  ]);

  for (const d of devis) {
    results.push({
      id: d.id,
      type: "devis",
      label: `Devis ${d.numero}`,
      sub: d.nomEntreprise || d.nomContact,
      href: `/profil/devis/${d.id}`,
    });
  }

  for (const f of factures) {
    results.push({
      id: f.id,
      type: "facture",
      label: `Facture ${f.numero}`,
      sub: f.devis?.nomContact ?? "Facture d'abonnement",
      href: `/admin/factures`,
    });
  }

  for (const c of contrats) {
    results.push({
      id: c.id,
      type: "contrat",
      label: `Contrat ${c.numero}`,
      sub: c.devis.nomContact,
      href: `/admin/contrats`,
    });
  }

  for (const u of users) {
    results.push({
      id: u.id,
      type: "user",
      label: `@${u.pseudo}`,
      sub: `${u.email} · ${u.role}`,
      href: `/admin/utilisateurs`,
    });
  }

  return results;
}
