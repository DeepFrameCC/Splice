import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import StatusPill from "@/components/dashboard/StatusPill";
import { Receipt, Download, FileText, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function MesFactures() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;
  const factures = await db.facture.findMany({
    where: { userId },
    include: { devis: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl italic text-df-gold">Mes factures</h1>
        <p className="mt-1 text-sm text-df-blue/60">
          {factures.length} facture{factures.length !== 1 ? "s" : ""}
        </p>
      </header>

      {factures.length === 0 ? (
        <div className="rounded-2xl bg-df-cream p-10 text-center">
          <Receipt className="mx-auto h-10 w-10 text-df-blue/30" />
          <p className="mt-4 text-df-blue/70">
            Vos factures s&apos;afficheront ici apres paiement de l&apos;acompte.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {factures.map((f) => (
            <li key={f.id}>
              <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-df-blue/10 transition hover:shadow-lg">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-df-blue">
                      Facture n&deg;{f.numero}
                    </p>
                    <p className="mt-0.5 text-sm text-df-ink/60">
                      {f.devis.nomEntreprise || f.devis.nomContact}
                    </p>
                  </div>
                  <StatusPill status={f.status as any} />
                </div>

                {/* Amounts */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-df-blue/10 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-df-blue/50">Montant HT</p>
                    <p className="font-display text-lg font-bold text-df-ink">
                      {formatEuros(f.devis.totalHT)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-df-blue/50">Acompte ({f.devis.acompteRate}%)</p>
                    <p className="font-display text-lg font-bold text-df-gold">
                      {formatEuros(f.devis.acompteAmount)}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="flex items-center gap-1.5 text-sm text-df-ink/60">
                      <Calendar className="h-3.5 w-3.5" />
                      {f.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-3 border-t border-df-blue/10 pt-4">
                  <Link
                    href={`/profil/devis/${f.devisId}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-df-cream px-4 py-1.5 text-xs font-bold text-df-blue transition hover:bg-df-blue hover:text-white"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Voir le devis
                  </Link>
                  <a
                    href={`/api/facture/${f.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-df-blue px-4 py-1.5 text-xs font-bold text-white transition hover:bg-df-blue/90"
                    aria-label={`Telecharger la facture ${f.numero} au format PDF`}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Telecharger PDF
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
