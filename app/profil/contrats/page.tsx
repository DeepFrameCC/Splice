import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import StatusPill from "@/components/dashboard/StatusPill";
import ContratTimeline from "@/components/dashboard/ContratTimeline";
import { FileText, Calendar, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MesContrats() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;
  const contrats = await db.contrat.findMany({
    where: { userId },
    include: { devis: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl italic text-df-blue">Mes contrats</h1>
        <p className="mt-1 text-sm text-df-blue/60">
          {contrats.length} contrat{contrats.length !== 1 ? "s" : ""}
        </p>
      </header>

      {contrats.length === 0 ? (
        <div className="rounded-2xl bg-df-cream p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-df-blue/30" />
          <p className="mt-4 text-df-blue/70">
            Aucun contrat actif. Ils apparaitront apres paiement de l&apos;acompte.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {contrats.map((c) => (
            <li key={c.id}>
              <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-df-blue/10 transition hover:shadow-lg">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-df-blue">
                      Contrat n&deg;{c.numero}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-df-ink/60">
                      <Building2 className="h-3.5 w-3.5" />
                      {c.devis.nomEntreprise || c.devis.nomContact}
                    </p>
                  </div>
                  <StatusPill status={c.status as any} />
                </div>

                {/* Timeline */}
                <div className="mt-4 border-t border-df-blue/10 pt-4">
                  <ContratTimeline status={c.status as "A_VENIR" | "EN_COURS" | "FINI"} />
                </div>

                {/* Details row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-df-ink/70">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Cree le {c.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                  {c.devis.dateTournage && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-df-gold" />
                      Tournage : {c.devis.dateTournage.toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {c.dateDebut && (
                    <span>
                      Debut : {c.dateDebut.toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {c.dateFin && (
                    <span>
                      Fin : {c.dateFin.toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-3 border-t border-df-blue/10 pt-4">
                  <Link
                    href={`/profil/devis/${c.devisId}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-df-cream px-4 py-1.5 text-xs font-bold text-df-blue transition hover:bg-df-blue hover:text-white"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Voir le devis
                  </Link>
                  {c.pdfUrl && (
                    <a
                      href={c.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-df-blue px-4 py-1.5 text-xs font-bold text-white transition hover:bg-df-blue/90"
                    >
                      Telecharger le contrat
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
