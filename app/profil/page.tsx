import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  Calculator,
  AlertTriangle,
  FileText,
  Receipt,
  Clapperboard,
  Heart,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
} from "lucide-react";

export default async function ProfilPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;

  let user: any = null;
  let dbError = false;
  let stats = { devis: 0, factures: 0, contrats: 0, likes: 0 };

  try {
    const [u, devisCount, facturesCount, contratsCount, likesCount] = await Promise.all([
      db.user.findUnique({ where: { id: userId }, include: { profile: true } }),
      db.devis.count({ where: { userId } }),
      db.facture.count({ where: { userId } }),
      db.contrat.count({ where: { userId } }),
      db.like.count({ where: { userId } }),
    ]);
    user = u;
    stats = { devis: devisCount, factures: facturesCount, contrats: contratsCount, likes: likesCount };
  } catch (e) {
    console.error("[profil] DB error:", e);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-6 text-amber-800 ring-1 ring-amber-200">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <div>
          <p className="font-bold">Service temporairement indisponible</p>
          <p className="text-sm">Merci de reessayer dans quelques instants.</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const p = user.profile;
  const displayName = p?.nomEntreprise ?? (`${p?.prenom ?? ""} ${p?.nom ?? ""}`.trim() || user.pseudo);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null;

  const quickLinks = [
    { label: "Mes devis",    href: "/profil/devis",    icon: FileText,     count: stats.devis,    color: "text-df-blue" },
    { label: "Mes factures", href: "/profil/factures",  icon: Receipt,      count: stats.factures, color: "text-df-gold" },
    { label: "Mes contrats", href: "/profil/contrats",  icon: Clapperboard, count: stats.contrats, color: "text-emerald-600" },
    { label: "Mes likes",    href: "/profil/likes",     icon: Heart,        count: stats.likes,    color: "text-rose-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Profile header card */}
      <div className="rounded-2xl bg-gradient-to-br from-df-blue to-df-blue/90 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-2xl font-bold uppercase">
            {(p?.prenom?.[0] ?? user.pseudo?.[0] ?? "U")}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl italic">{displayName}</h1>
            <p className="mt-0.5 text-sm text-white/70">@{user.pseudo}</p>
            {memberSince && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                <CalendarDays className="h-3.5 w-3.5" />
                Membre depuis {memberSince}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl bg-white p-4 shadow-md ring-1 ring-df-blue/10 transition hover:shadow-lg hover:ring-df-blue/25"
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${link.color}`} />
                <ArrowRight className="h-4 w-4 text-df-blue/30 transition group-hover:translate-x-0.5 group-hover:text-df-blue" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-df-ink">{link.count}</p>
              <p className="text-xs text-df-blue/60">{link.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Personal info */}
      <div>
        <h2 className="mb-4 font-display text-xl font-bold text-df-blue">Informations personnelles</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={User} label="Nom / Entreprise" value={p?.nomEntreprise ?? `${p?.prenom ?? ""} ${p?.nom ?? ""}`.trim()} />
          <InfoRow icon={Phone} label="Telephone" value={p?.tel ?? ""} />
          <InfoRow icon={MapPin} label="Adresse" value={[p?.adresse, p?.codePostal, p?.ville].filter(Boolean).join(" - ")} />
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-df-cream p-6 text-center sm:p-8">
        <p className="text-df-ink/70">Un nouveau projet en tete ?</p>
        <Link href="/devis" className="btn-primary mt-4 inline-flex">
          <Calculator className="h-5 w-5" /> Demander un devis
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-df-blue/10">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-df-blue/40" />
      <div>
        <p className="text-xs uppercase tracking-wide text-df-blue/50">{label}</p>
        <p className="mt-0.5 font-bold text-df-ink">{value || "\u2014"}</p>
      </div>
    </div>
  );
}
