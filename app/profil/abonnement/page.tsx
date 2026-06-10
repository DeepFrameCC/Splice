import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Repeat, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/pricing";
import AbonnementActions from "@/components/dashboard/AbonnementActions";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

const BADGE: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Actif", cls: "bg-emerald-500/15 text-emerald-400" },
  PAST_DUE: { label: "Paiement en échec", cls: "bg-amber-500/15 text-amber-400" },
  CANCELED: { label: "Résilié", cls: "bg-rose-500/15 text-rose-300" },
  INCOMPLETE: { label: "En attente", cls: "bg-white/10 text-white/60" },
};

function formatDate(d: Date | null): string | null {
  return d ? d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : null;
}

export default async function MonAbonnement() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const abonnements = await db.abonnement.findMany({
    where: { userId },
    include: { devis: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Mon abonnement" subtitle="Ta formule récurrente et son suivi de facturation" />

      {abonnements.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="Aucun abonnement actif"
          description="Les formules récurrentes te donnent un volume de production régulier à tarif réduit. Découvre les offres adaptées à ton rythme."
          action={
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-1.5 rounded-full bg-df-gold px-5 py-2.5 text-sm font-bold text-white transition hover:bg-df-gold/90"
            >
              Découvrir nos formules <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      ) : (
        <ul className="space-y-5">
          {abonnements.map((abo) => {
            const planLabel = SUBSCRIPTION_PLANS[abo.plan as PlanId]?.label ?? abo.devis.pack;
            const cycleLabel = abo.billingCycle === "ANNUEL" ? "an" : "mois";
            const periodeFin = formatDate(abo.currentPeriodEnd);
            const badge = BADGE[abo.status] ?? { label: "En attente", cls: "bg-white/10 text-white/60" };
            const finProgrammee = abo.status === "ACTIVE" && abo.cancelAtPeriodEnd;
            const actionnable = abo.status === "ACTIVE" || abo.status === "PAST_DUE";

            return (
              <li key={abo.id}>
                <div className="rounded-2xl bg-df-surface p-6 ring-1 ring-white/[0.08]">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-sans text-lg font-bold text-white">Formule {planLabel}</p>
                      <p className="mt-0.5 text-sm text-white/50">
                        {abo.billingCycle === "ANNUEL" ? "Facturation annuelle" : "Facturation mensuelle"}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${finProgrammee ? "bg-amber-500/15 text-amber-400" : badge.cls}`}>
                      {finProgrammee ? "Résiliation programmée" : badge.label}
                    </span>
                  </div>

                  {/* Montant */}
                  <div className="mt-4 border-t border-white/[0.08] pt-4">
                    <p className="text-xs uppercase tracking-wide text-white/50">Montant</p>
                    <p className="font-display text-2xl font-bold text-white">
                      {abo.devis.totalHT} € <span className="text-base font-medium text-white/50">/ {cycleLabel}</span>
                    </p>
                  </div>

                  {/* État / date clé */}
                  {abo.status === "PAST_DUE" ? (
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-sm text-amber-300">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Le dernier prélèvement a échoué. Contactez-nous à contact.splicestudio@gmail.com pour régulariser votre moyen de paiement.</span>
                    </div>
                  ) : finProgrammee ? (
                    <p className="mt-4 flex items-center gap-1.5 text-sm text-amber-300">
                      <Calendar className="h-4 w-4" />
                      {periodeFin ? `Se termine le ${periodeFin}, sans renouvellement.` : "Se termine à la fin de la période en cours."}
                    </p>
                  ) : abo.status === "ACTIVE" ? (
                    <p className="mt-4 flex items-center gap-1.5 text-sm text-white/60">
                      <Calendar className="h-4 w-4" />
                      {periodeFin ? `Prochain prélèvement le ${periodeFin}.` : "Renouvellement automatique."}
                    </p>
                  ) : abo.status === "CANCELED" ? (
                    <p className="mt-4 flex items-center gap-1.5 text-sm text-white/40">
                      <Calendar className="h-4 w-4" />
                      Abonnement résilié{periodeFin ? ` (terme : ${periodeFin})` : ""}.
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-white/40">En attente de confirmation du paiement…</p>
                  )}

                  {/* Actions */}
                  {actionnable && (
                    <div className="mt-5 border-t border-white/[0.08] pt-4">
                      <AbonnementActions
                        abonnementId={abo.id}
                        periodeFin={periodeFin}
                        cancelAtPeriodEnd={abo.cancelAtPeriodEnd}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
