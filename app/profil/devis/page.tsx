import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import StatusPill from "@/components/dashboard/StatusPill";
import { FileText, Plus, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function MesDevis() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;
  const devis = await db.devis.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl italic text-df-blue">Mes devis</h1>
          <p className="mt-1 text-sm text-df-blue/60">
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
        <div className="rounded-2xl bg-df-cream p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-df-blue/30" />
          <p className="mt-4 text-df-blue/70">
            Aucun devis pour l&apos;instant.{" "}
            <Link href="/devis" className="font-bold text-df-blue underline">
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
                className="group block rounded-2xl bg-white p-5 shadow-md ring-1 ring-df-blue/10 transition hover:shadow-lg hover:ring-df-blue/25"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-df-blue group-hover:text-df-blue/80">
                      Devis n&deg;{d.numero}
                    </p>
                    <p className="mt-0.5 text-sm text-df-ink/60">
                      {d.nomEntreprise || d.nomContact}
                    </p>
                  </div>
                  <StatusPill status={d.status as any} />
                </div>

                {/* Details row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-df-blue/10 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-df-blue/50">Montant HT</p>
                    <p className="font-display text-lg font-bold text-df-ink">
                      {formatEuros(d.totalHT)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-df-blue/50">Acompte</p>
                    <p className="font-display text-lg font-bold text-df-gold">
                      {formatEuros(d.acompteAmount)}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="flex items-center gap-1.5 text-sm text-df-ink/60">
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
