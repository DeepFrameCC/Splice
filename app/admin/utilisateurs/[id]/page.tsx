import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusPill from "@/components/dashboard/StatusPill";
import AnonymiserBtn from "@/components/dashboard/AnonymiserBtn";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Receipt,
  FileSignature,
  Heart,
  Shield,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      profile: true,
      devis: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      factures: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { devis: { select: { numero: true } } },
      },
      contrats: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { devis: { select: { numero: true } } },
      },
      likes: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { media: { select: { id: true, title: true, type: true } } },
      },
      _count: { select: { devis: true, factures: true, contrats: true, likes: true } },
    },
  });

  if (!user) notFound();

  const displayName =
    user.profile?.nomEntreprise ??
    (`${user.profile?.prenom ?? ""} ${user.profile?.nom ?? ""}`.trim() || user.pseudo);

  const totalDepense = user.devis
    .filter((d) => d.status === "VALIDE" || d.status === "PAYE")
    .reduce((sum, d) => sum + d.totalHT, 0);

  // Build timeline from all docs
  type TimelineItem = {
    date: Date;
    type: "devis" | "facture" | "contrat" | "like" | "inscription";
    label: string;
    sub: string;
    href?: string;
    status?: string;
  };

  const timeline: TimelineItem[] = [
    {
      date: user.createdAt,
      type: "inscription",
      label: "Inscription",
      sub: `@${user.pseudo} · ${user.role}`,
    },
  ];

  for (const d of user.devis) {
    timeline.push({
      date: d.createdAt,
      type: "devis",
      label: `Devis ${d.numero}`,
      sub: `${d.totalHT.toLocaleString("fr-FR")} € · ${d.pack}`,
      href: `/profil/devis/${d.id}`,
      status: d.status,
    });
  }

  for (const f of user.factures) {
    timeline.push({
      date: f.createdAt,
      type: "facture",
      label: `Facture ${f.numero}`,
      sub: f.devis ? `Devis ${f.devis.numero}` : "Abonnement",
      status: f.status,
    });
  }

  for (const c of user.contrats) {
    timeline.push({
      date: c.createdAt,
      type: "contrat",
      label: `Contrat ${c.numero}`,
      sub: `Devis ${c.devis.numero}`,
      status: c.status,
    });
  }

  for (const l of user.likes) {
    timeline.push({
      date: l.createdAt,
      type: "like",
      label: `Like · ${l.media.title}`,
      sub: l.media.type,
    });
  }

  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());

  const iconMap = {
    devis: FileText,
    facture: Receipt,
    contrat: FileSignature,
    like: Heart,
    inscription: User,
  } as const;

  const colorMap = {
    devis: "bg-df-gold/10 text-df-gold",
    facture: "bg-df-gold/10 text-df-gold",
    contrat: "bg-emerald-500/10 text-emerald-400",
    like: "bg-rose-500/10 text-rose-500",
    inscription: "bg-purple-500/10 text-purple-600",
  } as const;

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/utilisateurs"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/50 transition hover:bg-df-gold hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
            {displayName}
          </h1>
          <p className="text-sm text-white/50">@{user.pseudo} · Vue 360°</p>
        </div>
      </div>

      {/* Info cards row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-df-surface p-5 shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-df-gold/10 text-lg font-bold text-df-gold">
              {(user.profile?.prenom?.[0] ?? user.pseudo[0] ?? "U").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-white">{displayName}</p>
              <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                user.role === "ADMIN" ? "bg-df-gold/20 text-df-gold" :
                user.role === "TEAM" ? "bg-white/10 text-white" :
                "bg-white/5 text-white/60"
              }`}>
                {user.role}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-white/60">
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-white/55" /> {user.email}
            </p>
            {user.profile?.tel && (
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-white/55" /> {user.profile.tel}
              </p>
            )}
            {user.profile?.ville && (
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-white/55" /> {user.profile.ville}, {user.profile.codePostal}
              </p>
            )}
            <p className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-white/55" /> Inscrit le {user.createdAt.toLocaleDateString("fr-FR")}
            </p>
            <p className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-white/55" /> 2FA {user.twoFactorEnabled ? "activé" : "désactivé"}
            </p>
          </div>
        </div>

        {/* KPI cards */}
        {[
          { label: "Devis", value: user._count.devis, icon: FileText, color: "text-white/70", bg: "bg-white/5" },
          { label: "Total dépensé", value: `${totalDepense.toLocaleString("fr-FR")} €`, icon: Receipt, color: "text-df-gold", bg: "bg-df-gold/10" },
          { label: "Likes", value: user._count.likes, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
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

      {/* RGPD action */}
      {user.role === "CLIENT" && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3">
          <p className="flex-1 text-sm text-red-400">
            <strong>RGPD</strong> — Anonymiser ce client (irréversible, conserve factures).
          </p>
          <AnonymiserBtn userId={user.id} pseudo={user.pseudo} />
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-white">
            Timeline ({timeline.length} événements)
          </h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {timeline.map((item, i) => {
            const Icon = iconMap[item.type];
            const color = colorMap[item.type];
            return (
              <div key={`${item.type}-${i}`} className="flex items-start gap-4 px-6 py-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="font-bold text-df-gold underline-offset-4 hover:underline"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="font-bold text-white">{item.label}</span>
                    )}
                    {item.status && (
                      <StatusPill status={item.status as "ATTENTE" | "VALIDE" | "REFUSE" | "PAYE" | "EMISE" | "PAYEE" | "ANNULEE" | "A_VENIR" | "EN_COURS" | "FINI"} />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-white/40">{item.sub}</p>
                </div>
                <span className="shrink-0 text-xs text-white/55">
                  {item.date.toLocaleDateString("fr-FR")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
