import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Calculator,
  FileText,
  Receipt,
  FileSignature,
  Heart,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { Panel, SectionTitle, ErrorState, CountLink } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  let data: {
    user: NonNullable<Awaited<ReturnType<typeof fetchUser>>>;
    stats: { devis: number; factures: number; contrats: number; likes: number };
  } | null = null;

  try {
    const [user, devis, factures, contrats, likes] = await Promise.all([
      fetchUser(userId),
      db.devis.count({ where: { userId } }),
      db.facture.count({ where: { userId } }),
      db.contrat.count({ where: { userId } }),
      db.like.count({ where: { userId } }),
    ]);
    if (!user) return null;
    data = { user, stats: { devis, factures, contrats, likes } };
  } catch (e) {
    console.error("[profil] DB error:", e);
    return <ErrorState />;
  }

  const { user, stats } = data;
  const p = user.profile;
  const fullName = `${p?.prenom ?? ""} ${p?.nom ?? ""}`.trim();
  const displayName = p?.nomEntreprise || fullName || user.pseudo;
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null;

  const shortcuts = [
    { label: "Devis", href: "/profil/devis", icon: FileText, count: stats.devis },
    { label: "Factures", href: "/profil/factures", icon: Receipt, count: stats.factures },
    { label: "Contrats", href: "/profil/contrats", icon: FileSignature, count: stats.contrats },
    { label: "Inspirations likées", href: "/profil/likes", icon: Heart, count: stats.likes },
  ];

  const info = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: Phone, label: "Téléphone", value: p?.tel ?? "" },
    {
      icon: MapPin,
      label: "Adresse",
      value: [p?.adresse, p?.codePostal, p?.ville].filter(Boolean).join(" — "),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Identité */}
      <Panel className="flex flex-wrap items-center gap-5 p-6 sm:p-7">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-df-gold/15 text-2xl font-bold uppercase text-df-gold ring-1 ring-df-gold/25">
          {p?.prenom?.[0] ?? user.pseudo?.[0] ?? "U"}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {displayName}
          </h1>
          <p className="mt-0.5 text-sm text-white/55">@{user.pseudo}</p>
          {memberSince && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/45">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              Membre depuis {memberSince}
            </p>
          )}
        </div>
        <Link
          href="/devis"
          className="inline-flex items-center gap-2 rounded-full bg-df-gold px-5 py-2.5 text-sm font-bold text-white transition hover:bg-df-gold/90"
        >
          <Calculator className="h-4 w-4" aria-hidden /> Demander un devis
        </Link>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Raccourcis */}
        <Panel className="p-6">
          <SectionTitle>Mes documents</SectionTitle>
          <div className="mt-4 space-y-2.5">
            {shortcuts.map((s) => (
              <CountLink key={s.href} href={s.href} icon={s.icon} label={s.label} count={s.count} />
            ))}
          </div>
        </Panel>

        {/* Coordonnées */}
        <Panel className="p-6">
          <SectionTitle
            action={
              <Link
                href="/profil/parametres"
                className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Modifier
              </Link>
            }
          >
            Coordonnées
          </SectionTitle>
          <dl className="mt-4 space-y-3">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden />
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-white/45">{label}</dt>
                  <dd className="mt-0.5 truncate font-semibold text-white">{value || "—"}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}

function fetchUser(userId: string) {
  return db.user.findUnique({ where: { id: userId }, include: { profile: true } });
}
