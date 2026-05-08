import { db } from "@/lib/db";
import StatusPill from "@/components/dashboard/StatusPill";
import FactureStatusSelect from "@/components/dashboard/FactureStatusSelect";
import AdminFilters from "@/components/dashboard/AdminFilters";
import { Download } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const statusOptions = [
  { value: "EMISE", label: "Émise" },
  { value: "PAYEE", label: "Payée" },
  { value: "ANNULEE", label: "Annulée" }
];

export default async function AdminFacturesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : undefined;
  const qParam = typeof sp.q === "string" ? sp.q : undefined;

  const where: any = {};
  if (statusParam && ["EMISE", "PAYEE", "ANNULEE"].includes(statusParam)) {
    where.status = statusParam;
  }
  if (qParam) {
    where.OR = [
      { numero: { contains: qParam, mode: "insensitive" } },
      { devis: { nomContact: { contains: qParam, mode: "insensitive" } } },
      { devis: { nomEntreprise: { contains: qParam, mode: "insensitive" } } }
    ];
  }

  const factures = await db.facture.findMany({
    where,
    include: { devis: true, user: { select: { pseudo: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl italic text-df-gold">Factures</h1>
          <p className="text-sm text-df-blue/70">{factures.length} résultat{factures.length > 1 ? "s" : ""}</p>
        </div>
        <Suspense>
          <AdminFilters statusOptions={statusOptions} currentStatus={statusParam ?? ""} currentSearch={qParam ?? ""} />
        </Suspense>
      </header>

      {factures.length === 0 ? (
        <p className="rounded-xl bg-df-cream p-8 text-center text-df-blue/70">Aucune facture trouvée.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow ring-1 ring-df-blue/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-df-blue/10 text-left">
                <th className="px-4 py-3 font-bold text-df-blue">N° Facture</th>
                <th className="px-4 py-3 font-bold text-df-blue">N° Devis</th>
                <th className="px-4 py-3 font-bold text-df-blue">Client</th>
                <th className="px-4 py-3 font-bold text-df-blue text-right">Montant HT</th>
                <th className="px-4 py-3 font-bold text-df-blue">Statut</th>
                <th className="px-4 py-3 font-bold text-df-blue">Date</th>
                <th className="px-4 py-3 font-bold text-df-blue">Actions</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((f) => (
                <tr key={f.id} className="border-b border-df-blue/5 transition hover:bg-df-cream/50">
                  <td className="px-4 py-3 font-display italic text-df-blue">{f.numero}</td>
                  <td className="px-4 py-3 text-xs text-df-blue/70">{f.devis.numero}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-df-blue">{f.devis.nomEntreprise || f.devis.nomContact}</p>
                    <p className="text-xs text-df-blue/60">@{f.user?.pseudo}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-df-blue">{f.devis.totalHT} €</td>
                  <td className="px-4 py-3">
                    <FactureStatusSelect factureId={f.id} current={f.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-df-blue/70">{f.createdAt.toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <a href={`/api/facture/${f.id}/pdf`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-df-gold px-2.5 py-1 text-xs font-bold text-df-blue transition hover:bg-df-gold/80">
                      <Download className="h-3 w-3" /> PDF facture
                    </a>
                    <a href={`/api/devis/${f.devisId}/pdf`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-df-cream px-2.5 py-1 text-xs font-bold text-df-blue transition hover:bg-df-gold">
                      <Download className="h-3 w-3" /> PDF devis
                    </a>
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
