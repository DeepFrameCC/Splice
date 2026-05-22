"use client";
import { useState } from "react";
import {
  SUBSCRIPTION_PLANS,
  PLAN_IDS,
  FORMULE_BIENVENUE,
  PACK_PARTICULIER_VIDEOS,
  PACK_PARTICULIER_PHOTOS,
  OPTIONS_A_LA_CARTE,
  BANNIERE_DEEPFRAME,
  NETWORK_VOLUMES,
  PRIX_VIDEO_SUPP,
  PRIX_PODCAST_COURT,
  PRIX_OPTION_PHOTO_5,
  type BillingCycle,
  type BanniereSize,
} from "@/lib/pricing";
import BillingToggle from "./BillingToggle";
import PlanCard from "./PlanCard";
import Link from "next/link";
import { Check, ArrowRight, X } from "lucide-react";

export default function PricingSection() {
  const [cycle, setCycle] = useState<BillingCycle>("MENSUEL");

  return (
    <>
      {/* ── Offres de lancement ─────────────────────────────── */}
      <section className="mt-16">
        <div className="text-center">
          <span className="inline-block rounded-full bg-df-gold/20 px-4 py-1 text-xs font-bold text-df-gold">
            Offre de lancement — 10 places par formule
          </span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-5xl">
            Nos abonnements
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Des vidéos récurrentes pour alimenter tous vos réseaux. Choisissez la
            formule qui correspond à votre rythme de publication.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <BillingToggle onChange={setCycle} />
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Formule Bienvenue */}
          <div className="relative flex flex-col rounded-3xl border-2 border-df-gold/40 bg-df-gold/[0.06] p-6">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-df-gold px-4 py-1 text-xs font-bold text-white shadow">
              Gratuit
            </span>
            <p className="font-display text-2xl uppercase tracking-tight text-white">{FORMULE_BIENVENUE.label}</p>
            <p className="mt-1 text-sm text-white/50">{FORMULE_BIENVENUE.tagline}</p>
            <div className="mt-5">
              <span className="text-4xl font-bold text-white">0 €</span>
            </div>
            <p className="mt-1 text-xs text-white/40">1 par client · Places limitées</p>
            <ul className="mt-4 flex-1 space-y-2">
              {FORMULE_BIENVENUE.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
              {FORMULE_BIENVENUE.excludedFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/30 line-through decoration-white/10">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-white/20" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/devis"
              className="mt-6 block rounded-full border-2 border-df-gold py-3 text-center text-sm font-bold text-df-gold transition hover:bg-df-gold hover:text-white"
            >
              Demander ma formule
            </Link>
          </div>

          {PLAN_IDS.map((id) => (
            <PlanCard
              key={id}
              plan={SUBSCRIPTION_PLANS[id]}
              cycle={cycle}
              useLaunchPrice={true}
            />
          ))}
        </div>
      </section>

      {/* ── Volumes multi-réseaux ───────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-center font-display text-3xl uppercase tracking-tight text-white">
          Volume de contenus par formule
        </h2>
        <p className="mt-2 text-center text-white/50">
          Chaque vidéo source est recyclée et adaptée à chaque réseau.
        </p>
        <div className="mx-auto mt-8 max-w-5xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-bold">Réseau</th>
                <th className="px-4 py-3 font-bold">Standard</th>
                <th className="px-4 py-3 font-bold">Pro</th>
                <th className="px-4 py-3 font-bold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {NETWORK_VOLUMES.map((row) => (
                <tr
                  key={row.network}
                  className="border-b border-white/[0.06] text-white/70"
                >
                  <td className="px-4 py-3 font-bold text-white">
                    {row.network}
                  </td>
                  <td className="px-4 py-3">{row.standard}</td>
                  <td className="px-4 py-3">{row.pro}</td>
                  <td className="px-4 py-3">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Pack Particulier ────────────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-center font-display text-3xl uppercase tracking-tight text-white">
          Pack Particulier — À la carte
        </h2>
        <p className="mt-2 text-center text-white/50">
          Parfait pour un événement, un portrait, ou un besoin ponctuel.
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Vidéos */}
          <div className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/[0.08]">
            <h3 className="font-display text-xl uppercase tracking-tight text-white">Vidéos</h3>
            <ul className="mt-4 space-y-3">
              {PACK_PARTICULIER_VIDEOS.map((v) => (
                <li
                  key={v.qty}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white/70">
                    {v.qty} vidéo{v.qty > 1 ? "s" : ""} — {v.label}
                    {v.popular && (
                      <span className="ml-2 rounded-full bg-df-gold/20 px-2 py-0.5 text-[10px] font-bold text-df-gold">
                        Populaire
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-white">{v.price} €</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Photos */}
          <div className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/[0.08]">
            <h3 className="font-display text-xl uppercase tracking-tight text-white">Photos</h3>
            <ul className="mt-4 space-y-3">
              {PACK_PARTICULIER_PHOTOS.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white/70">
                    {p.qty !== null ? `${p.qty} photos` : "Sur mesure"} —{" "}
                    {p.label}
                    {p.popular && (
                      <span className="ml-2 rounded-full bg-df-gold/20 px-2 py-0.5 text-[10px] font-bold text-df-gold">
                        Populaire
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-white">
                    {p.price !== null ? `${p.price} €` : "Devis"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Options à la carte ──────────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-center font-display text-3xl uppercase tracking-tight text-white">
          Options à la carte
        </h2>
        <p className="mt-2 text-center text-white/50">
          Ajoutez des options pour personnaliser votre prestation.
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl gap-3 md:grid-cols-2">
          {OPTIONS_A_LA_CARTE.map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between rounded-xl bg-white/[0.04] px-5 py-3 ring-1 ring-white/[0.06]"
            >
              <span className="text-sm text-white/70">{opt.label}</span>
              <span className="text-sm font-bold text-white">
                {opt.price} € {opt.unit}
              </span>
            </div>
          ))}
        </div>

        {/* Extras */}
        <div className="mx-auto mt-6 grid max-w-4xl gap-3 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-5 py-3 ring-1 ring-white/[0.06]">
            <span className="text-sm text-white/70">Vidéo supplémentaire</span>
            <span className="text-sm font-bold text-white">
              {PRIX_VIDEO_SUPP} €
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-5 py-3 ring-1 ring-white/[0.06]">
            <span className="text-sm text-white/70">Podcast court</span>
            <span className="text-sm font-bold text-white">
              {PRIX_PODCAST_COURT} €
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-5 py-3 ring-1 ring-white/[0.06]">
            <span className="text-sm text-white/70">5 photos</span>
            <span className="text-sm font-bold text-white">
              {PRIX_OPTION_PHOTO_5} €
            </span>
          </div>
        </div>

        {/* Bannières */}
        <h3 className="mt-10 text-center font-display text-xl uppercase tracking-tight text-white">
          Bannière Deepframe
        </h3>
        <div className="mx-auto mt-4 grid max-w-3xl gap-3 md:grid-cols-3">
          {(Object.keys(BANNIERE_DEEPFRAME) as BanniereSize[]).map((key) => {
            const b = BANNIERE_DEEPFRAME[key];
            return (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl bg-white/[0.04] px-5 py-3 ring-1 ring-white/[0.06]"
              >
                <span className="text-sm text-white/70">{b.label}</span>
                <span className="text-sm font-bold text-white">
                  {b.pricePerMonth} €/mois
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="mt-20 text-center">
        <div className="mx-auto max-w-xl rounded-3xl bg-gradient-to-br from-df-glauque to-df-surface p-8 ring-1 ring-white/[0.08]">
          <h2 className="font-display text-3xl uppercase tracking-tight text-white">
            Prêt à vous lancer ?
          </h2>
          <p className="mt-2 text-white/60">
            Demandez un devis gratuit et sans engagement. Réponse sous 24h.
          </p>
          <Link
            href="/devis"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-df-gold px-8 py-3 font-bold text-white shadow-lg shadow-df-gold/30 transition hover:brightness-110"
          >
            Demander un devis <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
