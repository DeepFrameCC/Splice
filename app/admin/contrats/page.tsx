import { db } from "@/lib/db";
import StatusPill from "@/components/dashboard/StatusPill";
import AdminFilters from "@/components/dashboard/AdminFilters";
import ContratStatusSelect from "@/components/dashboard/ContratStatusSelect";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const statusOptions = [
  { value: "A_VENIR", label: "À venir" },
  { value: "EN_COURS", label: "En cours" },
  { value: "FINI", label: "Fini" }
];

export default async function AdminContratsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : undefined;
  const qParam = typeof sp.q === "string" ? sp.q : undefined;

  const where: any = {};
  if (statusParam && ["A_VENIR", "EN_COURS", "FINI"].includes(statusParam)) {
    where.status = statusParam;
  }
  if (qParam) {
    where.OR = [
      { numero: { contains: qParam, mode: "insensitive" } },
      { devis: { nomContact: { contains: qParam, mode: "insensitive" } } },
      { devis: { nomEntreprise: { contains: qParam, mode: "insensitive" } } }
    ];
  }

  const contrats = await db.contrat.findMany({
    where,
    include: { devis: true, user: { select: { pseudo: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl italic text-df-blue">Contrats</h1>
          <p className="text-sm text-df-blue/70">{contrats.length} résultat{contrats.length > 1 ? "s" : ""}</p>
        </div>
        <Suspense>
          <AdminFilters statusOptions={statusOptions} currentStatus={statusParam ?? ""} currentSearch={qParam ?? ""} />
        </Suspense>
      </header>

      {contrats.length === 0 ? (
        <p className="rounded-xl bg-df-cream p-8 text-center text-df-blue/70">Aucun contrat trouvé.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow ring-1 ring-df-blue/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-df-blue/10 text-left">
                <th className="px-4 py-3 font-bold text-df-blue">N° Contrat</th>
                <th className="px-4 py-3 font-bold text-df-blue">N° Devis</th>
                <th className="px-4 py-3 font-bold text-df-blue">Client</th>
                <th className="px-4 py-3 font-bold text-df-blue text-right">Montant HT</th>
                <th className="px-4 py-3 font-bold text-df-blue">Statut</th>
                <th className="px-4 py-3 font-bold text-df-blue">Date</th>
                <th className="px-4 py-3 font-bold text-df-blue">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contrats.map((c) => (
                <tr key={c.id} className="border-b border-df-blue/5 transition hover:bg-df-cream/50">
                  <td className="px-4 py-3 font-display italic text-df-blue">{c.numero}</td>
                  <td className="px-4 py-3 text-xs text-df-blue/70">{c.devis.numero}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-df-blue">{c.devis.nomEntreprise || c.devis.nomContact}</p>
                    <p className="text-xs text-df-blue/60">@{c.user?.pseudo}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-df-blue">{c.devis.totalHT} €</td>
                  <td className="px-4 py-3"><StatusPill status={c.status as "A_VENIR" | "EN_COURS" | "FINI"} /></td>
                  <td className="px-4 py-3 text-xs text-df-blue/70">{c.createdAt.toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    <ContratStatusSelect contratId={c.id} current={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
