import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import StatusPill from "@/components/dashboard/StatusPill";
import ContratTimeline from "@/components/dashboard/ContratTimeline";
import { FileText, Calendar, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MesContrats() {
  const session = await auth();
  const userId = session?.user?.id!;
  const contrats = await db.contrat.findMany({
    where: { userId },
    include: { devis: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white">Mes contrats</h1>
        <p className="mt-1 text-sm text-white/60">
          {contrats.length} contrat{contrats.length !== 1 ? "s" : ""}
        </p>
      </header>

      {contrats.length === 0 ? (
        <div className="rounded-2xl bg-white/5 p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-4 text-white/70">
            Aucun contrat actif. Ils apparaitront apres paiement de l&apos;acompte.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {contrats.map((c) => (
            <li key={c.id}>
              <div className="rounded-2xl bg-white/5 p-5 shadow-md ring-1 ring-white/10 transition hover:shadow-lg">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-lg font-bold text-white">
                      Contrat n&deg;{c.numero}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/50">
                      <Building2 className="h-3.5 w-3.5" />
                      {c.devis.nomEntreprise || c.devis.nomContact}
                    </p>
                  </div>
                  <StatusPill status={c.status as any} />
                </div>

                {/* Timeline */}
                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <ContratTimeline status={c.status as "A_VENIR" | "EN_COURS" | "FINI"} />
                </div>

                {/* Details row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
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
                <div className="mt-4 flex flex-wrap gap-3 border-t border-white/[0.08] pt-4">
                  <Link
                    href={`/profil/devis/${c.devisId}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/10"
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
