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
  const userId = session?.user?.id!;

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
      <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 p-6 text-amber-800 ring-1 ring-amber-200">
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
    { label: "Mes devis",    href: "/profil/devis",    icon: FileText,     count: stats.devis,    color: "text-white/80 group-hover:text-df-gold" },
    { label: "Mes factures", href: "/profil/factures",  icon: Receipt,      count: stats.factures, color: "text-white/80 group-hover:text-df-gold" },
    { label: "Mes contrats", href: "/profil/contrats",  icon: Clapperboard, count: stats.contrats, color: "text-white/80 group-hover:text-df-gold" },
    { label: "Mes likes",    href: "/profil/likes",     icon: Heart,        count: stats.likes,    color: "text-white/80 group-hover:text-df-gold" },
  ];

  return (
    <div className="space-y-8">
      {/* Profile header card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-df-glauque to-[#0E0E22] p-6 text-white shadow-lg ring-1 ring-white/10 sm:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold uppercase ring-2 ring-white/30 backdrop-blur-sm">
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
              className="group rounded-2xl bg-white/5 p-4 shadow-md ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:ring-df-gold/40"
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 transition-colors ${link.color}`} />
                <ArrowRight className="h-4 w-4 text-white/30 transition-colors group-hover:translate-x-0.5 group-hover:text-df-gold" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-white transition-colors group-hover:text-df-gold">{link.count}</p>
              <p className="text-xs text-white/60">{link.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Personal info */}
      <div>
        <h2 className="mb-4 font-display text-xl font-bold text-df-gold">Informations personnelles</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={User} label="Nom / Entreprise" value={p?.nomEntreprise ?? `${p?.prenom ?? ""} ${p?.nom ?? ""}`.trim()} />
          <InfoRow icon={Phone} label="Telephone" value={p?.tel ?? ""} />
          <InfoRow icon={MapPin} label="Adresse" value={[p?.adresse, p?.codePostal, p?.ville].filter(Boolean).join(" - ")} />
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10 sm:p-8">
        <p className="text-white/70">Un nouveau projet en tete ?</p>
        <Link href="/devis" className="mt-4 inline-flex items-center gap-2 rounded-full bg-df-gold px-6 py-3 font-bold text-white transition hover:scale-105 hover:bg-df-gold/90">
          <Calculator className="h-5 w-5" /> Demander un devis
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 shadow-sm ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:ring-df-gold/30">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
      <div>
        <p className="text-xs uppercase tracking-wide text-df-gold/80">{label}</p>
        <p className="mt-0.5 font-bold text-white">{value || "\u2014"}</p>
      </div>
    </div>
  );
}
