import { db } from "@/lib/db";
import { ExportCSVButton } from "@/components/dashboard/StatsCharts";
import { Receipt, AlertTriangle, Calculator, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

const SEUIL_FRANCHISE_TVA = 37500;
const TAUX_COTISATIONS_BNC = 0.22;

export default async function AdminComptabilitePage() {
  const currentYear = new Date().getFullYear();

  // Livre des recettes : toutes les factures payées cette année
  const facturesPayees = await db.facture.findMany({
    where: { status: "PAYEE" },
    include: {
      devis: {
        select: {
          numero: true,
          nomContact: true,
          nomEntreprise: true,
          totalHT: true,
          pack: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Filtrer par année courante
  const recettesAnnee = facturesPayees.filter(
    (f) => f.createdAt.getFullYear() === currentYear
  );

  const totalRecettes = recettesAnnee.reduce((s, f) => s + f.devis.totalHT, 0);
  const cotisationsSociales = Math.round(totalRecettes * TAUX_COTISATIONS_BNC);
  const revenuNet = totalRecettes - cotisationsSociales;
  const progressTVA = Math.min(100, Math.round((totalRecettes / SEUIL_FRANCHISE_TVA) * 100));
  const alerteTVA = totalRecettes >= SEUIL_FRANCHISE_TVA * 0.85;

  // CSV export — format livre des recettes
  const csvLines = [
    "Date;N° Facture;N° Devis;Client;Montant HT (€);Mode de paiement",
    ...recettesAnnee.map((f) =>
      [
        f.createdAt.toLocaleDateString("fr-FR"),
        f.numero,
        f.devis.numero,
        (f.devis.nomEntreprise || f.devis.nomContact).replace(/;/g, ","),
        f.devis.totalHT,
        "Stripe",
      ].join(";")
    ),
    "",
    `Total ${currentYear};;;;;${totalRecettes}`,
    `Cotisations sociales (${Math.round(TAUX_COTISATIONS_BNC * 100)}% BNC);;;;;${cotisationsSociales}`,
    `Revenu net;;;;;${revenuNet}`,
  ].join("\n");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
            Comptabilité
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Auto-entrepreneur — Livre des recettes {currentYear}
          </p>
        </div>
        <ExportCSVButton
          data={csvLines}
          filename={`deepframe-livre-recettes-${currentYear}.csv`}
        />
      </header>

      {/* Alerte TVA */}
      {alerteTVA && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-bold text-red-400">
              Alerte seuil franchise TVA !
            </p>
            <p className="text-xs text-red-600">
              CA {currentYear} : {totalRecettes.toLocaleString("fr-FR")} € / {SEUIL_FRANCHISE_TVA.toLocaleString("fr-FR")} € ({progressTVA}%)
              {totalRecettes >= SEUIL_FRANCHISE_TVA
                ? " — Seuil dépassé ! Contactez votre comptable."
                : " — Approche du seuil."}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
            <Receipt className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {totalRecettes.toLocaleString("fr-FR")} €
          </p>
          <p className="text-xs text-white/40">Recettes HT {currentYear}</p>
        </div>

        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
            <Calculator className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {cotisationsSociales.toLocaleString("fr-FR")} €
          </p>
          <p className="text-xs text-white/40">Cotisations ({Math.round(TAUX_COTISATIONS_BNC * 100)}% BNC)</p>
        </div>

        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-df-blue/5">
            <BookOpen className="h-4 w-4 text-df-blue" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {revenuNet.toLocaleString("fr-FR")} €
          </p>
          <p className="text-xs text-white/40">Revenu net estimé</p>
        </div>

        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {progressTVA}%
          </p>
          <p className="text-xs text-white/40">Seuil TVA ({SEUIL_FRANCHISE_TVA.toLocaleString("fr-FR")} €)</p>
          {/* Progress bar */}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full transition-all ${progressTVA >= 85 ? "bg-red-500" : progressTVA >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(100, progressTVA)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Livre des recettes */}
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-white">
            Livre des recettes {currentYear}
          </h2>
          <p className="mt-0.5 text-xs text-white/30">
            {recettesAnnee.length} encaissement{recettesAnnee.length > 1 ? "s" : ""} · TVA non applicable, art. 293 B du CGI
          </p>
        </div>

        {recettesAnnee.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-df-blue/20" />
            <p className="mt-4 text-sm text-white/30">Aucun encaissement enregistré en {currentYear}.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-left">
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Date</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/30">N° Facture</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/30">N° Devis</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Client</th>
                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-white/30">Montant HT</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {recettesAnnee.map((f, i) => (
                    <tr
                      key={f.id}
                      className={`border-b border-white/[0.06] ${i % 2 === 0 ? "bg-df-surface" : "bg-white/[0.02]"}`}
                    >
                      <td className="px-5 py-3 text-xs text-white/40">
                        {f.createdAt.toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-3 font-display text-sm font-bold text-df-blue">
                        {f.numero}
                      </td>
                      <td className="px-5 py-3 text-xs text-white/40">
                        {f.devis.numero}
                      </td>
                      <td className="px-5 py-3 font-bold text-white">
                        {f.devis.nomEntreprise || f.devis.nomContact}
                      </td>
                      <td className="px-5 py-3 text-right font-display text-sm font-bold text-white">
                        {f.devis.totalHT.toLocaleString("fr-FR")} €
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600">
                          Stripe
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-white/10 bg-df-cream/20">
                    <td colSpan={4} className="px-5 py-3 text-sm font-bold text-white">
                      Total {currentYear}
                    </td>
                    <td className="px-5 py-3 text-right font-display text-lg font-bold text-df-blue">
                      {totalRecettes.toLocaleString("fr-FR")} €
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
