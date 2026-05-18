import { db } from "@/lib/db";
import ContratsTable from "@/components/dashboard/ContratsTable";
import { FileSignature } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContratsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : "";

  const contrats = await db.contrat.findMany({
    include: { devis: true, user: { select: { pseudo: true } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const rows = contrats.map((c) => ({
    id: c.id,
    numero: c.numero,
    devisNumero: c.devis.numero,
    devisId: c.devisId,
    nomContact: c.devis.nomContact,
    nomEntreprise: c.devis.nomEntreprise,
    pseudo: c.user?.pseudo ?? "",
    totalHT: c.devis.totalHT,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    dateTournage: c.devis.dateTournage?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
          Contrats
        </h1>
        <p className="mt-1 text-sm text-white/40">
          {contrats.length} contrat{contrats.length > 1 ? "s" : ""} au total
        </p>
      </header>

      {contrats.length === 0 ? (
        <div className="rounded-2xl bg-df-surface p-12 text-center shadow-sm ring-1 ring-white/[0.08]">
          <FileSignature className="mx-auto h-10 w-10 text-white/20" />
          <p className="mt-4 text-sm text-white/40">Aucun contrat.</p>
        </div>
      ) : (
        <ContratsTable data={rows} initialStatus={statusParam} />
      )}
    </div>
  );
}
