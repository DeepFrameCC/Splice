import { db } from "@/lib/db";
import { PACKS } from "@/lib/pricing";
import DevisTableWrapper from "@/components/dashboard/DevisTableWrapper";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDevisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : "";

  const devis = await db.devis.findMany({
    include: { user: { select: { pseudo: true } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const rows = devis.map((d) => ({
    id: d.id,
    numero: d.numero,
    nomContact: d.nomContact,
    nomEntreprise: d.nomEntreprise,
    pseudo: d.user?.pseudo ?? "",
    pack: d.pack,
    packLabel: PACKS[d.pack]?.label ?? d.pack,
    totalHT: d.totalHT,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
            Devis
          </h1>
          <p className="mt-1 text-sm text-df-ink/50">
            {devis.length} devis au total
          </p>
        </div>
        <Link
          href="/devis"
          className="inline-flex items-center gap-2 rounded-full bg-df-blue px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue-dark"
        >
          <Plus className="h-4 w-4" /> Nouveau devis
        </Link>
      </header>

      <DevisTableWrapper data={rows} initialStatus={statusParam} />
    </div>
  );
}
