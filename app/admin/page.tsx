import Link from "next/link";
import { db } from "@/lib/db";
import { PACKS } from "@/lib/pricing";
import StatusPill from "@/components/dashboard/StatusPill";
import CAChart from "@/components/dashboard/CAChart";
import {
  FileText,
  Receipt,
  FileSignature,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

const MONTH_LABELS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

export default async function AdminDashboard() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Start of current month
  const monthStart = new Date(currentYear, currentMonth, 1);

  // 48h ago for "urgent" devis
  const hours48ago = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const [
    totalDevis,
    devisAttente,
    devisValides,
    devisUrgents,
    totalFactures,
    totalContrats,
    caYTD,
    caMois,
    recentDevis,
    allPaidDevisThisYear,
    topClientsRaw,
  ] = await Promise.all([
    db.devis.count(),
    db.devis.count({ where: { status: "ATTENTE" } }),
    db.devis.count({ where: { status: { in: ["VALIDE", "PAYE"] } } }),
    db.devis.count({
      where: { status: "ATTENTE", createdAt: { lt: hours48ago } },
    }),
    db.facture.count(),
    db.contrat.count(),
    // CA YTD (devis validés/payés cette année)
    db.devis.aggregate({
      _sum: { totalHT: true },
      where: { status: { in: ["VALIDE", "PAYE"] }, annee: currentYear },
    }),
    // CA mois courant
    db.devis.aggregate({
      _sum: { totalHT: true },
      where: {
        status: { in: ["VALIDE", "PAYE"] },
        createdAt: { gte: monthStart },
      },
    }),
    db.devis.findMany({
      include: { user: { select: { pseudo: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // All paid/validated devis this year for monthly chart
    db.devis.findMany({
      where: { status: { in: ["VALIDE", "PAYE"] }, annee: currentYear },
      select: { totalHT: true, createdAt: true },
    }),
    // Top 5 clients by total spend
    db.devis.groupBy({
      by: ["userId"],
      _sum: { totalHT: true },
      _count: { id: true },
      where: { status: { in: ["VALIDE", "PAYE"] }, userId: { not: null } },
      orderBy: { _sum: { totalHT: "desc" } },
      take: 5,
    }),
  ]);

  // Build monthly CA data for chart
  const monthlyCA = Array.from({ length: 12 }, (_, i) => ({
    month: MONTH_LABELS[i] ?? "",
    ca: 0,
  }));
  for (const d of allPaidDevisThisYear) {
    const m = d.createdAt.getMonth();
    const entry = monthlyCA[m];
    if (entry) {
      entry.ca += d.totalHT;
    }
  }

  // Fetch user details for top clients
  const topClientIds = topClientsRaw
    .map((c) => c.userId)
    .filter((id): id is string => id !== null);
  const topClientUsers = topClientIds.length > 0
    ? await db.user.findMany({
        where: { id: { in: topClientIds } },
        select: { id: true, pseudo: true, email: true, profile: { select: { nomEntreprise: true, prenom: true, nom: true } } },
      })
    : [];

  const topClients = topClientsRaw.map((c) => {
    const u = topClientUsers.find((u) => u.id === c.userId);
    return {
      name: u?.profile?.nomEntreprise ?? (`${u?.profile?.prenom ?? ""} ${u?.profile?.nom ?? ""}`.trim() || u?.pseudo || "Inconnu"),
      pseudo: u?.pseudo ?? "",
      total: c._sum.totalHT ?? 0,
      count: c._count.id,
    };
  });

  const caYTDMontant = caYTD._sum.totalHT ?? 0;
  const caMoisMontant = caMois._sum.totalHT ?? 0;
  const tauxConversion = totalDevis > 0 ? Math.round((devisValides / totalDevis) * 100) : 0;
  const panierMoyen = devisValides > 0 ? Math.round(caYTDMontant / devisValides) : 0;

  const kpis = [
    {
      label: "CA mois",
      value: `${caMoisMontant.toLocaleString("fr-FR")} €`,
      sub: MONTH_LABELS[currentMonth],
      icon: TrendingUp,
      color: "text-emerald-600",
      bgIcon: "bg-emerald-50",
    },
    {
      label: "CA YTD",
      value: `${caYTDMontant.toLocaleString("fr-FR")} €`,
      sub: `${devisValides} devis validés`,
      icon: Receipt,
      color: "text-df-blue",
      bgIcon: "bg-df-blue/5",
    },
    {
      label: "Taux conversion",
      value: `${tauxConversion}%`,
      sub: `${totalDevis} devis total`,
      icon: FileSignature,
      color: "text-purple-600",
      bgIcon: "bg-purple-50",
    },
    {
      label: "Panier moyen",
      value: `${panierMoyen.toLocaleString("fr-FR")} €`,
      sub: `${totalFactures} factures · ${totalContrats} contrats`,
      icon: Users,
      color: "text-amber-600",
      bgIcon: "bg-amber-50",
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
          Vue d&apos;ensemble — {currentYear}
        </p>
      </div>

      {/* Urgent banner */}
      {devisUrgents > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm font-bold text-red-800">
            {devisUrgents} devis en attente depuis +48h
          </p>
          <Link
            href="/admin/devis?status=ATTENTE"
            className="ml-auto shrink-0 rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-red-600"
          >
            Traiter
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.bgIcon}`}
              >
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-df-ink">
              {kpi.value}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-df-ink/70">
              {kpi.label}
            </p>
            <p className="mt-1 text-xs text-df-ink/40">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* CA Chart + Top Clients */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* CA 12 mois chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
          <h2 className="mb-4 font-display text-lg font-bold text-df-ink">
            Chiffre d&apos;affaires {currentYear}
          </h2>
          <CAChart data={monthlyCA} />
        </div>

        {/* Top 5 clients */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
          <div className="border-b border-df-blue/5 px-6 py-4">
            <h2 className="font-display text-lg font-bold text-df-ink">
              Top clients
            </h2>
          </div>
          {topClients.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-df-ink/40">
              Aucun client encore.
            </p>
          ) : (
            <div className="divide-y divide-df-blue/5">
              {topClients.map((c, i) => (
                <div key={c.pseudo || i} className="flex items-center gap-3 px-6 py-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-df-blue/5 text-xs font-bold text-df-blue">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-df-ink">{c.name}</p>
                    <p className="text-xs text-df-ink/40">
                      {c.count} devis · @{c.pseudo}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-sm font-bold text-df-blue">
                    {c.total.toLocaleString("fr-FR")} €
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Devis */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
        <div className="flex items-center justify-between border-b border-df-blue/5 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-df-ink">
            Devis récents
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
            {recentDevis.map((d) => {
              const isUrgent = d.status === "ATTENTE" && d.createdAt < hours48ago;
              return (
                <Link
                  key={d.id}
                  href={`/profil/devis/${d.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition hover:bg-df-cream/30"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isUrgent ? "bg-red-50" : "bg-df-blue/5"}`}>
                    {isUrgent ? (
                      <Clock className="h-4 w-4 text-red-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-df-blue" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-sm font-bold text-df-ink">
                        {d.numero}
                      </p>
                      <StatusPill
                        status={d.status as "ATTENTE" | "VALIDE" | "REFUSE" | "PAYE"}
                      />
                      {isUrgent && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          +48h
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-df-ink/50">
                      {d.nomEntreprise || d.nomContact} —{" "}
                      {PACKS[d.pack]?.label ?? d.pack}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-sm font-bold text-df-ink">
                      {d.totalHT.toLocaleString("fr-FR")} €
                    </p>
                    <p className="flex items-center justify-end gap-1 text-[11px] text-df-ink/40">
                      <Calendar className="h-3 w-3" />
                      {d.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
