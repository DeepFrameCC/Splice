import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatusPill from "@/components/dashboard/StatusPill";
import { FileText, Plus, Calendar } from "lucide-react";

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
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-df-gold">Mes devis</h1>
          <p className="mt-1 text-sm text-white/60">
            {devis.length} devis &middot; Ordre chronologique
          </p>
        </div>
        <Link
          href="/devis"
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Nouveau devis
        </Link>
      </header>

      {devis.length === 0 ? (
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-white/30" />
          <p className="mt-4 text-white/70">
            Aucun devis pour l&apos;instant.{" "}
            <Link href="/devis" className="font-bold text-df-gold underline transition hover:text-white">
              Lancer mon premier devis
            </Link>
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {devis.map((d) => (
            <li key={d.id}>
              <Link
                href={`/profil/devis/${d.id}`}
                className="group block rounded-2xl bg-white/5 p-5 shadow-md ring-1 ring-white/10 transition hover:bg-white/10 hover:shadow-lg hover:ring-df-gold/40"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-white transition-colors group-hover:text-df-gold">
                      Devis n&deg;{d.numero}
                    </p>
                    <p className="mt-0.5 text-sm text-white/50">
                      {d.nomEntreprise || d.nomContact}
                    </p>
                  </div>
                  <StatusPill status={d.status as any} />
                </div>

                {/* Details row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.08] pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Montant HT</p>
                    <p className="font-display text-lg font-bold text-white">
                      {formatEuros(d.totalHT)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Acompte</p>
                    <p className="font-display text-lg font-bold text-df-gold">
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
