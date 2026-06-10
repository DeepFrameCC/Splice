import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatusPill from "@/components/dashboard/StatusPill";
import { Plus, Calendar } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

function formatEuros(euros: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(euros);
}

export default async function MesDevis() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");
  const devis = await db.devis.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Mes devis"
        subtitle={devis.length > 0 ? `${devis.length} devis · du plus récent au plus ancien` : undefined}
        action={
          <Link href="/devis" className="btn-primary">
            <Plus className="h-4 w-4" /> Nouveau devis
          </Link>
        }
      />

      {devis.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="Aucun devis pour l'instant"
          description="Décris ton projet en quelques minutes : on te renvoie une estimation chiffrée, sans engagement."
          action={
            <Link href="/devis" className="btn-primary">
              <Plus className="h-4 w-4" /> Lancer mon premier devis
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {devis.map((d) => (
            <li key={d.id}>
              <Link
                href={`/profil/devis/${d.id}`}
                className="group block rounded-2xl bg-df-surface p-5 ring-1 ring-white/[0.08] transition hover:ring-df-gold/40"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-lg font-bold text-white transition-colors group-hover:text-df-gold">
                      Devis n&deg;{d.numero}
                    </p>
                    <p className="mt-0.5 text-sm text-white/50">
                      {d.nomEntreprise || d.nomContact}
                    </p>
                  </div>
                  <StatusPill status={d.status} />
                </div>

                {/* Details row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.08] pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Montant HT</p>
                    <p className="font-sans text-base font-bold text-white">
                      {formatEuros(d.totalHT)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Acompte</p>
                    <p className="font-sans text-base font-bold text-df-gold">
                      {formatEuros(d.acompteAmount)}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="flex items-center gap-1.5 text-sm text-white/50">
                      <Calendar className="h-3.5 w-3.5" />
                      {d.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                    {d.dateTournage && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-df-gold">
                        <Calendar className="h-3 w-3" />
                        Tournage : {d.dateTournage.toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
