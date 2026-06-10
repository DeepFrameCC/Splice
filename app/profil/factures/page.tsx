import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatusPill from "@/components/dashboard/StatusPill";
import { Receipt, Download, FileText, Calendar } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

function formatEuros(euros: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(euros);
}

export default async function MesFactures() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");
  const factures = await db.facture.findMany({
    where: { userId },
    include: { devis: true, abonnement: { include: { devis: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Mes factures"
        subtitle={factures.length > 0 ? `${factures.length} facture${factures.length !== 1 ? "s" : ""}` : undefined}
      />

      {factures.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Aucune facture pour l'instant"
          description="Tes factures apparaissent ici dès le paiement de l'acompte d'un devis. Elles sont téléchargeables en PDF à tout moment."
        />
      ) : (
        <ul className="space-y-4">
          {factures.map((f) => {
            const src = f.devis ?? f.abonnement?.devis ?? null;
            const isAbo = f.abonnementId != null;
            const montant = f.montant ?? src?.totalHT ?? 0;
            return (
            <li key={f.id}>
              <div className="rounded-2xl bg-df-surface p-5 ring-1 ring-white/[0.08]">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-lg font-bold text-white">
                      Facture n&deg;{f.numero}
                    </p>
                    <p className="mt-0.5 text-sm text-white/55">
                      {src?.nomEntreprise || src?.nomContact || "Abonnement"}
                    </p>
                  </div>
                  <StatusPill status={f.status} />
                </div>

                {/* Amounts */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.08] pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">{isAbo ? "Montant" : "Montant HT"}</p>
                    <p className="font-sans text-base font-bold text-white">
                      {formatEuros(montant)}
                    </p>
                  </div>
                  {!isAbo && src && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50">Acompte ({src.acompteRate}%)</p>
                      <p className="font-sans text-base font-bold text-df-gold">
                        {formatEuros(src.acompteAmount)}
                      </p>
                    </div>
                  )}
                  {isAbo && f.periodeDebut && f.periodeFin && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50">Période</p>
                      <p className="font-sans text-sm font-bold text-white">
                        {f.periodeDebut.toLocaleDateString("fr-FR")} – {f.periodeFin.toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}
                  <div className="ml-auto text-right">
                    <p className="flex items-center gap-1.5 text-sm text-white/50">
                      <Calendar className="h-3.5 w-3.5" />
                      {f.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-3 border-t border-white/[0.08] pt-4">
                  {f.devisId && (
                    <Link
                      href={`/profil/devis/${f.devisId}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/10"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Voir le devis
                    </Link>
                  )}
                  <a
                    href={`/api/facture/${f.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-df-blue px-4 py-1.5 text-xs font-bold text-white transition hover:bg-df-blue/90"
                    aria-label={`Télécharger la facture ${f.numero} au format PDF`}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Télécharger PDF
                  </a>
                </div>
              </div>
            </li>
          );})}
        </ul>
      )}
    </div>
  );
}
