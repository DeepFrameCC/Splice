import { db } from "@/lib/db";
import { PACKS } from "@/lib/pricing";
import StatusPill from "@/components/dashboard/StatusPill";
import { ValiderBtn, RefuserBtn } from "@/components/dashboard/DevisActions";
import AdminFilters from "@/components/dashboard/AdminFilters";
import { Download, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const statusOptions = [
  { value: "ATTENTE", label: "En attente" },
  { value: "VALIDE", label: "Valide" },
  { value: "REFUSE", label: "Refuse" },
  { value: "PAYE", label: "Paye" },
];

export default async function AdminDevisPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const statusParam = typeof sp.status === "string" ? sp.status : undefined;
  const qParam = typeof sp.q === "string" ? sp.q : undefined;

  const where: any = {};
  if (
    statusParam &&
    ["ATTENTE", "VALIDE", "REFUSE", "PAYE"].includes(statusParam)
  ) {
    where.status = statusParam;
  }
  if (qParam) {
    where.OR = [
      { numero: { contains: qParam, mode: "insensitive" } },
      { nomContact: { contains: qParam, mode: "insensitive" } },
      { nomEntreprise: { contains: qParam, mode: "insensitive" } },
      { emailContact: { contains: qParam, mode: "insensitive" } },
    ];
  }

  const devis = await db.devis.findMany({
    where,
    include: { user: { select: { pseudo: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
            Devis
          </h1>
          <p className="mt-1 text-sm text-df-ink/50">
            {devis.length} resultat{devis.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Suspense>
            <AdminFilters
              statusOptions={statusOptions}
              currentStatus={statusParam ?? ""}
              currentSearch={qParam ?? ""}
            />
          </Suspense>
          <Link
            href="/devis"
            className="inline-flex items-center gap-2 rounded-full bg-df-blue px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue-dark"
          >
            <Plus className="h-4 w-4" /> Nouveau devis
          </Link>
        </div>
      </header>

      {/* Table */}
      {devis.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-df-blue/10">
          <p className="text-sm text-df-ink/50">Aucun devis trouve.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-df-blue/10 text-left">
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">
                  N deg.
                </th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">
                  Client
                </th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">
                  Pack
                </th>
                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-df-ink/40">
                  Total HT
                </th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">
                  Statut
                </th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">
                  Date
                </th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-df-ink/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {devis.map((d, i) => (
                <tr
                  key={d.id}
                  className={`border-b border-df-blue/5 transition hover:bg-df-cream/30 ${
                    i % 2 === 0 ? "bg-white" : "bg-df-cream/10"
                  }`}
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/profil/devis/${d.id}`}
                      className="font-display text-sm font-bold text-df-blue underline-offset-4 hover:underline"
                    >
                      {d.numero}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-df-ink">
                      {d.nomEntreprise || d.nomContact}
                    </p>
                    <p className="mt-0.5 text-xs text-df-ink/40">
                      @{d.user?.pseudo}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-df-blue/5 px-2.5 py-1 text-xs font-semibold text-df-blue">
                      {PACKS[d.pack]?.label ?? d.pack}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-display text-sm font-bold text-df-ink">
                    {d.totalHT.toLocaleString("fr-FR")} EUR
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill
                      status={
                        d.status as
                          | "ATTENTE"
                          | "VALIDE"
                          | "REFUSE"
                          | "PAYE"
                      }
                    />
                  </td>
                  <td className="px-5 py-4 text-xs text-df-ink/50">
                    {d.createdAt.toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {d.status === "ATTENTE" && (
                        <>
                          <ValiderBtn devisId={d.id} />
                          <RefuserBtn devisId={d.id} />
                        </>
                      )}
                      <Link
                        href={`/profil/devis/${d.id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-df-blue/5 px-2.5 py-1.5 text-xs font-bold text-df-blue transition hover:bg-df-blue hover:text-white"
                        aria-label={`Voir le devis ${d.numero}`}
                      >
                        <Eye className="h-3 w-3" /> Voir
                      </Link>
                      <a
                        href={`/api/devis/${d.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-df-cream px-2.5 py-1.5 text-xs font-bold text-df-ink/70 transition hover:bg-df-gold hover:text-df-ink"
                        aria-label={`Telecharger le PDF du devis ${d.numero}`}
                      >
                        <Download className="h-3 w-3" /> PDF
                      </a>
                    </div>
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
