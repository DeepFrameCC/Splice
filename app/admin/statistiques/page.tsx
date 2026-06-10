import { db } from "@/lib/db";
import { resolvePackLabel, FOUNDER_LABEL } from "@/lib/pricing";
import { CABarChart, FunnelPieChart, ExportCSVButton } from "@/components/dashboard/StatsCharts";
import { TrendingUp, Target, ShoppingCart, Users, BarChart3 } from "lucide-react";
import type { Founder } from "@prisma/client";

export const dynamic = "force-dynamic";

const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default async function AdminStatsPage() {
  const currentYear = new Date().getFullYear();

  const [allDevis, devisByPack, devisByChef] = await Promise.all([
    db.devis.findMany({
      where: { annee: currentYear },
      select: { id: true, status: true, totalHT: true, pack: true, chefDeProjet: true, createdAt: true, userId: true },
    }),
    db.devis.groupBy({
      by: ["pack"],
      _sum: { totalHT: true },
      _count: { id: true },
      where: { status: { in: ["VALIDE", "PAYE"] }, annee: currentYear },
    }),
    db.devis.groupBy({
      by: ["chefDeProjet"],
      _sum: { totalHT: true },
      _count: { id: true },
      where: { status: { in: ["VALIDE", "PAYE"] }, annee: currentYear },
    }),
  ]);

  // Monthly CA
  const monthlyCA = Array.from({ length: 12 }, (_, i) => ({
    label: MONTH_LABELS[i] ?? "",
    value: 0,
  }));
  for (const d of allDevis) {
    if (d.status === "VALIDE" || d.status === "PAYE") {
      const m = d.createdAt.getMonth();
      const entry = monthlyCA[m];
      if (entry) entry.value += d.totalHT;
    }
  }

  // Funnel
  const total = allDevis.length;
  const attente = allDevis.filter((d) => d.status === "ATTENTE").length;
  const valides = allDevis.filter((d) => d.status === "VALIDE" || d.status === "PAYE").length;
  const refuses = allDevis.filter((d) => d.status === "REFUSE").length;
  const payes = allDevis.filter((d) => d.status === "PAYE").length;

  const funnelData = [
    { name: "En attente", value: attente },
    { name: "Validés", value: valides },
    { name: "Payés", value: payes },
    { name: "Refusés", value: refuses },
  ].filter((d) => d.value > 0);

  // CA by pack
  const caByPack = devisByPack.map((d) => ({
    label: resolvePackLabel(d.pack),
    value: d._sum.totalHT ?? 0,
    count: d._count.id,
  })).sort((a, b) => b.value - a.value);

  // CA by chef de projet
  const caByChef = devisByChef.map((d) => ({
    label: FOUNDER_LABEL[d.chefDeProjet] ?? d.chefDeProjet,
    value: d._sum.totalHT ?? 0,
    count: d._count.id,
  })).sort((a, b) => b.value - a.value);

  // Top clients
  const clientMap = new Map<string, number>();
  for (const d of allDevis) {
    if ((d.status === "VALIDE" || d.status === "PAYE") && d.userId) {
      clientMap.set(d.userId, (clientMap.get(d.userId) ?? 0) + d.totalHT);
    }
  }
  const topClientIds = [...clientMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  const topClientUsers = topClientIds.length > 0
    ? await db.user.findMany({
        where: { id: { in: topClientIds } },
        select: { id: true, pseudo: true, profile: { select: { nomEntreprise: true } } },
      })
    : [];

  const topClients = topClientIds.map((id) => {
    const u = topClientUsers.find((u) => u.id === id);
    return {
      name: u?.profile?.nomEntreprise || `@${u?.pseudo ?? "?"}`,
      total: clientMap.get(id) ?? 0,
    };
  });

  // KPIs
  const caYTD = allDevis
    .filter((d) => d.status === "VALIDE" || d.status === "PAYE")
    .reduce((s, d) => s + d.totalHT, 0);
  const tauxConversion = total > 0 ? Math.round((valides / total) * 100) : 0;
  const panierMoyen = valides > 0 ? Math.round(caYTD / valides) : 0;
  const uniqueClients = new Set(allDevis.filter((d) => d.userId).map((d) => d.userId)).size;

  // CSV export data
  const csvData = [
    "Mois;CA (€)",
    ...monthlyCA.map((m) => `${m.label};${m.value}`),
    "",
    "Pack;CA (€);Devis",
    ...caByPack.map((p) => `${p.label};${p.value};${p.count}`),
    "",
    "Chef de projet;CA (€);Devis",
    ...caByChef.map((c) => `${c.label};${c.value};${c.count}`),
  ].join("\n");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
            Statistiques
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Analyse de performance — {currentYear}
          </p>
        </div>
        <ExportCSVButton data={csvData} filename={`splice-stats-${currentYear}.csv`} />
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "CA YTD", value: `${caYTD.toLocaleString("fr-FR")} €`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Taux conversion", value: `${tauxConversion}%`, icon: Target, color: "text-white/70", bg: "bg-white/5" },
          { label: "Panier moyen", value: `${panierMoyen.toLocaleString("fr-FR")} €`, icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-500/10" },
          { label: "Clients actifs", value: uniqueClients, icon: Users, color: "text-df-gold", bg: "bg-df-gold/10" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${k.bg}`}>
              <k.icon className={`h-4 w-4 ${k.color}`} />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-white/40">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CA mensuel */}
        <div className="rounded-2xl bg-df-surface p-6 shadow-sm ring-1 ring-white/[0.08]">
          <h2 className="mb-4 font-display text-lg font-bold text-white">
            CA mensuel {currentYear}
          </h2>
          <CABarChart data={monthlyCA} />
        </div>

        {/* Funnel */}
        <div className="rounded-2xl bg-df-surface p-6 shadow-sm ring-1 ring-white/[0.08]">
          <h2 className="mb-4 font-display text-lg font-bold text-white">
            Funnel de conversion
          </h2>
          {funnelData.length > 0 ? (
            <FunnelPieChart data={funnelData} />
          ) : (
            <p className="py-12 text-center text-sm text-white/30">Pas de données.</p>
          )}
        </div>
      </div>

      {/* CA by pack + CA by chef */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
          <div className="border-b border-white/[0.06] px-6 py-4">
            <h2 className="font-display text-lg font-bold text-white">CA par service</h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {caByPack.map((p, i) => (
              <div key={p.label} className="flex items-center gap-3 px-6 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-df-gold/10 text-xs font-bold text-df-gold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{p.label}</p>
                  <p className="text-xs text-white/30">{p.count} devis</p>
                </div>
                <p className="font-display text-sm font-bold text-df-gold">
                  {p.value.toLocaleString("fr-FR")} €
                </p>
              </div>
            ))}
            {caByPack.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-white/30">Aucune donnée.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
          <div className="border-b border-white/[0.06] px-6 py-4">
            <h2 className="font-display text-lg font-bold text-white">CA par monteur</h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {caByChef.map((c, i) => (
              <div key={c.label} className="flex items-center gap-3 px-6 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-df-gold/10 text-xs font-bold text-df-gold">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{c.label}</p>
                  <p className="text-xs text-white/30">{c.count} devis</p>
                </div>
                <p className="font-display text-sm font-bold text-df-gold">
                  {c.value.toLocaleString("fr-FR")} €
                </p>
              </div>
            ))}
            {caByChef.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-white/30">Aucune donnée.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top clients */}
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-white">Top 10 clients</h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {topClients.map((c, i) => (
            <div key={c.name + i} className="flex items-center gap-3 px-6 py-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">
                {i + 1}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-bold text-white">{c.name}</p>
              <p className="font-display text-sm font-bold text-emerald-400">
                {c.total.toLocaleString("fr-FR")} €
              </p>
            </div>
          ))}
          {topClients.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-white/30">Aucun client.</p>
          )}
        </div>
      </div>
    </div>
  );
}
