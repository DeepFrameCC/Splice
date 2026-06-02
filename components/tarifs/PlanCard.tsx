import type { SubscriptionPlan, BillingCycle } from "@/lib/pricing";
import { Check, X } from "lucide-react";
import Link from "next/link";

interface PlanCardProps {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  useLaunchPrice: boolean;
  spotsLeft: number;
}

export default function PlanCard({
  plan,
  cycle,
  useLaunchPrice,
  spotsLeft,
}: PlanCardProps) {
  const price = useLaunchPrice
    ? cycle === "ANNUEL"
      ? plan.launchAnnualMonthly
      : plan.launchMonthly
    : cycle === "ANNUEL"
    ? plan.stdAnnualMonthly
    : plan.stdMonthly;

  const annualTotal = useLaunchPrice
    ? plan.launchAnnualTotal
    : plan.stdAnnualTotal;

  const saving = useLaunchPrice ? plan.launchAnnualSaving : 0;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border-2 p-6 transition-all ${
        plan.recommended
          ? "border-df-gold bg-df-gold/[0.06] shadow-lg shadow-df-gold/10 scale-[1.02]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {plan.recommended && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-df-gold px-4 py-1 text-xs font-bold text-df-night shadow">
          Recommandé
        </span>
      )}

      <div className="flex justify-between items-start gap-2">
        <p className="font-display text-2xl uppercase tracking-tight text-white">{plan.label}</p>
        {useLaunchPrice && (
          <span className="rounded bg-df-gold/20 px-2 py-0.5 text-[9px] font-bold text-df-gold shrink-0">
            Lancement
          </span>
        )}
      </div>
      {useLaunchPrice && (
        <p className="mt-1 text-[11px] font-semibold text-df-gold">
          🔥 Offre de lancement — {spotsLeft} place{spotsLeft > 1 ? "s" : ""} dispo{spotsLeft > 1 ? "s" : ""}
        </p>
      )}
      <p className="mt-1 text-sm text-white/50">{plan.tagline}</p>

      <div className="mt-5">
        <span className="text-4xl font-bold text-white">{price} €</span>
        <span className="text-sm text-white/50">/mois</span>
      </div>

      {cycle === "ANNUEL" && (
        <p className="mt-1 text-xs text-white/60">
          {annualTotal} €/an
          {saving > 0 && (
            <span className="ml-1 text-emerald-400">
              (−{saving} € d&apos;économie)
            </span>
          )}
        </p>
      )}
      {cycle === "MENSUEL" && (
        <p className="mt-1 text-xs text-white/60">Sans engagement, résiliable à tout moment</p>
      )}

      <p className="mt-3 text-sm font-bold text-df-gold">
        {plan.videosPerMonth} vidéo{plan.videosPerMonth > 1 ? "s" : ""} source
        {plan.videosPerMonth > 1 ? "s" : ""} / mois
      </p>

      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((feat) => (
          <li
            key={feat}
            className="flex items-start gap-2 text-sm text-white/70"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            {feat}
          </li>
        ))}
        {plan.excludedFeatures.map((feat) => (
          <li
            key={feat}
            className="flex items-start gap-2 text-sm text-white/55 line-through decoration-white/20"
          >
            <X className="mt-0.5 h-4 w-4 shrink-0 text-white/45" />
            {feat}
          </li>
        ))}
      </ul>

      <Link
        href="/devis"
        className={`mt-6 block rounded-full py-3 text-center text-sm font-bold transition ${
          plan.recommended
            ? "bg-df-gold text-df-night shadow-lg shadow-df-gold/30 hover:brightness-110"
            : "border-2 border-white/20 text-white hover:bg-white/[0.06]"
        }`}
      >
        Demander un devis
      </Link>
    </div>
  );
}
