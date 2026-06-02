import { db } from "@/lib/db";
import FacturesTable from "@/components/dashboard/FacturesTable";
import { Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminFacturesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : "";

  const factures = await db.facture.findMany({
    include: {
      devis: true,
      abonnement: { include: { devis: true } },
      user: { select: { pseudo: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const rows = factures.map((f) => {
    const src = f.devis ?? f.abonnement?.devis ?? null;
    return {
      id: f.id,
      numero: f.numero,
      devisNumero: src?.numero ?? "Abonnement",
      devisId: f.devisId,
      nomContact: src?.nomContact ?? "",
      nomEntreprise: src?.nomEntreprise ?? "",
      pseudo: f.user?.pseudo ?? "",
      totalHT: f.montant ?? src?.totalHT ?? 0,
      status: f.status,
      createdAt: f.createdAt.toISOString(),
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
          Factures
        </h1>
        <p className="mt-1 text-sm text-white/40">
          {factures.length} facture{factures.length > 1 ? "s" : ""} au total
        </p>
      </header>

      {factures.length === 0 ? (
        <div className="rounded-2xl bg-df-surface p-12 text-center shadow-sm ring-1 ring-white/[0.08]">
          <Receipt className="mx-auto h-10 w-10 text-white/20" />
          <p className="mt-4 text-sm text-white/40">Aucune facture.</p>
        </div>
      ) : (
        <FacturesTable data={rows} initialStatus={statusParam} />
      )}
    </div>
  );
}
