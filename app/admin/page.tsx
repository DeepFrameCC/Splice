import Link from "next/link";
import { db } from "@/lib/db";
import { PACKS } from "@/lib/pricing";
import StatusPill from "@/components/dashboard/StatusPill";
import {
  FileText,
  Receipt,
  FileSignature,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const currentYear = new Date().getFullYear();

  const [
    totalDevis,
    devisAttente,
    devisValides,
    totalFactures,
    totalContrats,
    caValide,
    caPipeline,
    recentDevis,
  ] = await Promise.all([
    db.devis.count(),
    db.devis.count({ where: { status: "ATTENTE" } }),
    db.devis.count({ where: { status: { in: ["VALIDE", "PAYE"] } } }),
    db.facture.count(),
    db.contrat.count(),
    db.devis.aggregate({
      _sum: { totalHT: true },
      where: { status: { in: ["VALIDE", "PAYE"] }, annee: currentYear },
    }),
    db.devis.aggregate({
      _sum: { totalHT: true },
      where: { status: "ATTENTE", annee: currentYear },
    }),
    db.devis.findMany({
      include: { user: { select: { pseudo: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const caValideMontant = caValide._sum.totalHT ?? 0;
  const caPipelineMontant = caPipeline._sum.totalHT ?? 0;
  const tauxConversion =
    totalDevis > 0 ? Math.round((devisValides / totalDevis) * 100) : 0;

  const kpis = [
    {
      label: "CA signe (YTD)",
      value: `${caValideMontant.toLocaleString("fr-FR")} EUR`,
      sub: `${devisValides} devis valides`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgIcon: "bg-emerald-50",
      href: "/admin/devis?status=VALIDE",
    },
    {
      label: "Pipeline envoye",
      value: `${caPipelineMontant.toLocaleString("fr-FR")} EUR`,
      sub: `${devisAttente} devis en attente`,
      icon: FileText,
      color: "text-amber-600",
      bgIcon: "bg-amber-50",
      href: "/admin/devis?status=ATTENTE",
    },
    {
      label: "Devis acceptes",
      value: devisValides,
      sub: `sur ${totalDevis} total`,
      icon: FileSignature,
      color: "text-df-blue",
      bgIcon: "bg-df-blue/5",
      href: "/admin/devis",
    },
    {
      label: "Taux de conversion",
      value: `${tauxConversion}%`,
      sub: `${totalFactures} factures, ${totalContrats} contrats`,
      icon: Receipt,
      color: "text-purple-600",
      bgIcon: "bg-purple-50",
      href: "/admin/factures",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-df-ink/50">
          Vue d&apos;ensemble de l&apos;activite Deepframe — {currentYear}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10 transition hover:shadow-md hover:ring-df-blue/20"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.bgIcon}`}
              >
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-df-ink/20 transition group-hover:text-df-blue" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-df-ink">
              {kpi.value}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-df-ink/70">
              {kpi.label}
            </p>
            <p className="mt-1 text-xs text-df-ink/40">{kpi.sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent Devis */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
        <div className="flex items-center justify-between border-b border-df-blue/5 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-df-ink">
            Devis recents
          </h2>
          <Link
            href="/admin/devis"
            className="flex items-center gap-1 rounded-full bg-df-blue/5 px-3 py-1.5 text-xs font-bold text-df-blue transition hover:bg-df-blue hover:text-white"
          >
            Voir tout <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {recentDevis.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-df-ink/40">
            Aucun devis pour le moment.
          </p>
        ) : (
          <div className="divide-y divide-df-blue/5">
            {recentDevis.map((d) => (
              <Link
                key={d.id}
                href={`/profil/devis/${d.id}`}
                className="flex items-center gap-4 px-6 py-4 transition hover:bg-df-cream/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-df-blue/5">
                  <FileText className="h-4 w-4 text-df-blue" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-sm font-bold text-df-ink">
                      {d.numero}
                    </p>
                    <StatusPill
                      status={
                        d.status as
                          | "ATTENTE"
                          | "VALIDE"
                          | "REFUSE"
                          | "PAYE"
                      }
                    />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-df-ink/50">
                    {d.nomEntreprise || d.nomContact} —{" "}
                    {PACKS[d.pack]?.label ?? d.pack}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-sm font-bold text-df-ink">
                    {d.totalHT.toLocaleString("fr-FR")} EUR
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-df-ink/40">
                    <Calendar className="h-3 w-3" />
                    {d.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
