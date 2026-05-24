"use client";
import { useDevisForm } from "./store";
import {
  SUBSCRIPTION_PLANS,
  PLAN_IDS,
  PACK_PARTICULIER_VIDEOS,
  PACK_PARTICULIER_PHOTOS,
  OPTIONS_A_LA_CARTE,
  BANNIERE_SPLICE,
  DELAI,
  DUREE_SUPPLEMENT,
  PRIX_KM,
  VILLE_DEPART_LABEL,
  type PlanId,
  type BillingCycle,
  type DevisMode,
  type BanniereSize,
} from "@/lib/pricing";
import type { DelaiLivraison, DureeTournage, VilleDepart } from "@prisma/client";
import { FORMULE_BIENVENUE } from "@/lib/pricing";
import { Check, Info, Briefcase, User as UserIcon, Gift, Lock } from "lucide-react";
import { useCallback } from "react";

// ─── Step 1 — Choix du mode ──────────────────────────────────────

export function Step1() {
  const mode = useDevisForm((s) => s.mode);
  const set = useDevisForm((s) => s.set);
  const canUseFormuleBienvenue = useDevisForm((s) => s.canUseFormuleBienvenue);
  const isAuthenticated = useDevisForm((s) => s.isAuthenticated);

  const modes: { id: DevisMode; icon: typeof Briefcase; label: string; desc: string }[] = [
    {
      id: "ABONNEMENT",
      icon: Briefcase,
      label: "Abonnement mensuel",
      desc: "Idéal pour les pros : vidéos récurrentes, recyclage multi-réseaux, à partir de 49 €/mois.",
    },
    {
      id: "PACK_PARTICULIER",
      icon: UserIcon,
      label: "Pack Particulier",
      desc: "Parfait pour un événement ou un besoin ponctuel : vidéos + photos à la carte, dès 29 €.",
    },
  ];

  const bienvenueDisabled = !canUseFormuleBienvenue;
  const bienvenueActive = mode === "FORMULE_BIENVENUE";

  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-white">
        Étape 1 — Quel type de prestation ?
      </h2>
      <p className="mt-1 text-white/60">
        Choisissez le mode qui correspond à votre besoin.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => set("mode", m.id)}
              aria-pressed={active}
              className={`relative flex flex-col items-start gap-3 rounded-2xl border-2 p-6 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "border-df-glauque-500 bg-df-glauque/40 shadow-md ring-2 ring-df-glauque-500/40 scale-[1.01]"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <m.icon className={`h-8 w-8 ${active ? "text-df-gold" : "text-white/40"}`} />
              <div>
                <p className="font-display text-xl uppercase tracking-tight text-white">{m.label}</p>
                <p className="mt-1 text-sm text-white/60">{m.desc}</p>
              </div>
              {active && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-df-gold shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Formule Bienvenue */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            if (!bienvenueDisabled) set("mode", "FORMULE_BIENVENUE");
          }}
          aria-pressed={bienvenueActive}
          disabled={bienvenueDisabled}
          className={`relative flex w-full flex-col items-start gap-3 rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
            bienvenueActive
              ? "border-df-gold bg-df-gold/10 shadow-md ring-2 ring-df-gold/40 scale-[1.01]"
              : bienvenueDisabled
              ? "border-white/5 opacity-50 cursor-not-allowed"
              : "border-df-gold/30 bg-df-gold/[0.04] hover:border-df-gold/50 hover:bg-df-gold/[0.08] cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-3">
            <Gift className={`h-8 w-8 ${bienvenueActive ? "text-df-gold" : bienvenueDisabled ? "text-white/30" : "text-df-gold/60"}`} />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-xl uppercase tracking-tight text-white">Formule Bienvenue</p>
                <span className="rounded-full bg-df-gold px-3 py-0.5 text-[10px] font-bold text-white">
                  Gratuit
                </span>
              </div>
              <p className="mt-1 text-sm text-white/60">
                {FORMULE_BIENVENUE.tagline} : {FORMULE_BIENVENUE.features.slice(0, 2).join(", ")}.
              </p>
            </div>
          </div>
          {bienvenueDisabled && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Lock className="h-3.5 w-3.5" />
              {!isAuthenticated
                ? "Connectez-vous pour bénéficier de cette offre"
                : "Vous avez déjà utilisé votre formule Bienvenue"}
            </div>
          )}
          {bienvenueActive && (
            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-df-gold shadow-sm">
              <Check className="h-4 w-4 text-white" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 — Abonnement ─────────────────────────────────────────

export function Step2Abonnement() {
  const f = useDevisForm();

  const selectPlan = useCallback(
    (p: PlanId) => {
      f.set("planId", p);
      if (p === "STANDARD") {
        const nextOptions = { ...f.options };
        delete nextOptions.musiqueSurMesure;
        delete nextOptions.podcast;
        f.set("options", nextOptions);
      }
    },
    [f]
  );

  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-white">
        Étape 2 — Votre abonnement
      </h2>
      <p className="mt-1 text-white/60">Choisissez votre formule et vos options.</p>

      {/* Billing toggle */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {(["MENSUEL", "ANNUEL"] as BillingCycle[]).map((bc) => (
          <button
            key={bc}
            type="button"
            onClick={() => f.set("billingCycle", bc)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              f.billingCycle === bc
                ? "bg-df-gold text-white shadow"
                : "bg-white/[0.06] text-white/60 hover:text-white"
            }`}
          >
            {bc === "MENSUEL" ? "Mensuel" : "Annuel"}
            {bc === "ANNUEL" && (
              <span className="ml-1.5 text-[10px] font-bold text-emerald-400">
                Économisez
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PLAN_IDS.map((id) => {
          const plan = SUBSCRIPTION_PLANS[id];
          const active = f.planId === id;
          const price = f.useLaunchPrice
            ? f.billingCycle === "ANNUEL"
              ? plan.launchAnnualMonthly
              : plan.launchMonthly
            : f.billingCycle === "ANNUEL"
            ? plan.stdAnnualMonthly
            : plan.stdMonthly;

          return (
            <button
              key={id}
              type="button"
              onClick={() => selectPlan(id)}
              aria-pressed={active}
              className={`relative flex flex-col rounded-2xl border-2 p-5 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "border-df-glauque-500 bg-df-glauque/40 shadow-md ring-2 ring-df-glauque-500/40 scale-[1.01]"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 right-4 rounded-full bg-df-gold px-3 py-0.5 text-[10px] font-bold text-white shadow">
                  Recommandé
                </span>
              )}
              <p className="font-display text-xl uppercase tracking-tight text-white">{plan.label}</p>
              <p className="mt-0.5 text-xs text-white/50">{plan.tagline}</p>
              <p className="mt-3 text-3xl font-bold text-white">
                {price} €<span className="text-sm font-normal text-white/50">/mois</span>
              </p>
              <p className="mt-1 text-xs text-white/40">
                {plan.videosPerMonth} vidéo{plan.videosPerMonth > 1 ? "s" : ""} source
                {plan.videosPerMonth > 1 ? "s" : ""} / mois
              </p>
              <ul className="mt-3 space-y-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-white/60">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                    {feat}
                  </li>
                ))}
              </ul>
              {active && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-df-gold shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Launch price toggle */}
      {f.isAdmin && (
        <label className="mt-6 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={f.useLaunchPrice}
            onChange={(e) => f.set("useLaunchPrice", e.target.checked)}
            className="h-5 w-5 accent-df-gold cursor-pointer"
          />
          <span className="text-sm font-bold text-white">
            Offre de lancement
            <span className="ml-1 text-xs font-normal text-white/50">
              (10 places par formule)
            </span>
          </span>
        </label>
      )}

      {/* Options */}
      <OptionsSection />
    </div>
  );
}

// ─── Step 2 — Pack Particulier ───────────────────────────────────

export function Step2PackParticulier() {
  const f = useDevisForm();

  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-white">
        Étape 2 — Votre pack à la carte
      </h2>
      <p className="mt-1 text-white/60">
        Composez votre prestation : vidéos, photos, options.
      </p>

      {/* Vidéos */}
      <fieldset className="mt-6">
        <legend className="font-bold text-white">Nombre de vidéos</legend>
        <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-4">
          {PACK_PARTICULIER_VIDEOS.map((v) => {
            const active = f.nbVideos === v.qty;
            return (
              <button
                key={v.qty}
                type="button"
                onClick={() => f.set("nbVideos", active ? null : v.qty)}
                aria-pressed={active}
                className={`rounded-xl border-2 p-3 text-center transition-all duration-200 cursor-pointer ${
                  active
                    ? "border-df-glauque-500 bg-df-glauque/40 shadow-md ring-2 ring-df-glauque-500/40"
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <p className="text-lg font-bold text-white">{v.qty}</p>
                <p className="text-xs text-white/50">{v.label}</p>
                <p className="mt-1 text-sm font-bold text-df-gold">{v.price} €</p>
                {v.popular && (
                  <span className="mt-1 inline-block rounded-full bg-df-gold/20 px-2 py-0.5 text-[10px] font-bold text-df-gold">
                    Populaire
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Photos */}
      <fieldset className="mt-6">
        <legend className="font-bold text-white">Nombre de photos</legend>
        <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-4">
          {PACK_PARTICULIER_PHOTOS.filter((p) => p.qty !== null).map((p) => {
            const active = f.nbPhotos === p.qty;
            return (
              <button
                key={p.qty}
                type="button"
                onClick={() => f.set("nbPhotos", active ? null : p.qty)}
                aria-pressed={active}
                className={`rounded-xl border-2 p-3 text-center transition-all duration-200 cursor-pointer ${
                  active
                    ? "border-df-glauque-500 bg-df-glauque/40 shadow-md ring-2 ring-df-glauque-500/40"
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <p className="text-lg font-bold text-white">{p.qty}</p>
                <p className="text-xs text-white/50">{p.label}</p>
                <p className="mt-1 text-sm font-bold text-df-gold">
                  {p.price !== null ? `${p.price} €` : "Sur devis"}
                </p>
                {p.popular && (
                  <span className="mt-1 inline-block rounded-full bg-df-gold/20 px-2 py-0.5 text-[10px] font-bold text-df-gold">
                    Populaire
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Durée tournage */}
      <fieldset className="mt-6">
        <legend className="font-bold text-white">Durée du tournage</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {(Object.keys(DUREE_SUPPLEMENT) as DureeTournage[]).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => f.set("duree", d)}
              aria-pressed={f.duree === d}
              className={`rounded-xl border-2 p-3 text-sm font-bold transition-all duration-200 cursor-pointer ${
                f.duree === d
                  ? "border-df-glauque-500 bg-df-glauque/40 text-white shadow-md ring-2 ring-df-glauque-500/40"
                  : "border-white/10 text-white/60 hover:border-white/20"
              }`}
            >
              {DUREE_SUPPLEMENT[d].label}
              {DUREE_SUPPLEMENT[d].price > 0 && ` (+${DUREE_SUPPLEMENT[d].price} €)`}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Déplacement */}
      <fieldset className="mt-6">
        <legend className="font-bold text-white">Lieu de tournage</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          <label className="md:col-span-1">
            <span className="text-sm text-white/60">Départ</span>
            <select
              value={f.villeDepart}
              onChange={(e) => f.set("villeDepart", e.target.value as VilleDepart)}
              className="mt-1 w-full rounded-xl border-2 border-white/10 bg-white/[0.06] px-3 py-2 text-white outline-none focus:border-df-glauque-500 focus:ring-2 focus:ring-df-glauque-500/20 cursor-pointer"
            >
              {(Object.keys(VILLE_DEPART_LABEL) as VilleDepart[]).map((v) => (
                <option key={v} value={v} className="bg-[#0E0E22] text-white">
                  {VILLE_DEPART_LABEL[v]}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="text-sm text-white/60">
              Distance aller-retour (km) — {PRIX_KM} €/km
            </span>
            <input
              type="number"
              min={0}
              value={f.distanceKm}
              onChange={(e) =>
                f.set("distanceKm", Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-1 w-full rounded-xl border-2 border-white/10 bg-white/[0.06] px-3 py-2 text-white placeholder:text-white/30 outline-none focus:border-df-glauque-500 focus:ring-2 focus:ring-df-glauque-500/20"
            />
          </label>
        </div>
      </fieldset>

      {/* Délai */}
      <fieldset className="mt-6">
        <legend className="font-bold text-white">Délai de livraison</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {(Object.keys(DELAI) as DelaiLivraison[]).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => f.set("delai", d)}
              aria-pressed={f.delai === d}
              className={`rounded-xl border-2 p-3 text-sm font-bold transition-all duration-200 cursor-pointer ${
                f.delai === d
                  ? "border-df-glauque-500 bg-df-glauque/40 text-white shadow-md ring-2 ring-df-glauque-500/40"
                  : "border-white/10 text-white/60 hover:border-white/20"
              }`}
            >
              {DELAI[d].label}
              {DELAI[d].price > 0 && ` (+${DELAI[d].price} €)`}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Bannière */}
      <fieldset className="mt-6">
        <legend className="font-bold text-white">Bannière Splice</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {(Object.keys(BANNIERE_SPLICE) as BanniereSize[]).map((b) => {
            const info = BANNIERE_SPLICE[b];
            const active = f.banniere === b;
            return (
              <button
                type="button"
                key={b}
                onClick={() => f.set("banniere", active ? null : b)}
                aria-pressed={active}
                className={`rounded-xl border-2 p-3 text-sm font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? "border-df-glauque-500 bg-df-glauque/40 text-white shadow-md ring-2 ring-df-glauque-500/40"
                    : "border-white/10 text-white/60 hover:border-white/20"
                }`}
              >
                {info.label}
                <span className="block text-xs font-normal text-white/50">
                  {info.pricePerMonth} €/mois
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Options */}
      <OptionsSection />
    </div>
  );
}

// ─── Step 2 — Formule Bienvenue ─────────────────────────────────

export function Step2FormuleBienvenue() {
  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-white">
        Étape 2 — Votre formule Bienvenue
      </h2>
      <p className="mt-1 text-white/60">
        Offre gratuite réservée aux nouveaux clients. Voici ce qui est inclus :
      </p>
      <div className="mt-6 rounded-2xl border-2 border-df-gold/30 bg-df-gold/[0.06] p-6">
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-df-gold" />
          <div>
            <p className="font-display text-2xl uppercase tracking-tight text-white">{FORMULE_BIENVENUE.label}</p>
            <p className="text-sm text-white/50">{FORMULE_BIENVENUE.tagline}</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {FORMULE_BIENVENUE.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-white/70">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-3xl font-bold text-white">
          0 € <span className="text-sm font-normal text-white/50">gratuit</span>
        </div>
        <p className="mt-1 text-xs text-white/40">
          Offre unique — 1 par client, places limitées.
        </p>
      </div>
    </div>
  );
}

// ─── Options à la carte (shared) ─────────────────────────────────

function OptionsSection() {
  const options = useDevisForm((s) => s.options);
  const toggleOption = useDevisForm((s) => s.toggleOption);
  const setOptionQty = useDevisForm((s) => s.setOptionQty);

  const mode = useDevisForm((s) => s.mode);
  const planId = useDevisForm((s) => s.planId);
  const nbVideos = useDevisForm((s) => s.nbVideos);

  const maxVideos = mode === "ABONNEMENT" ? SUBSCRIPTION_PLANS[planId].videosPerMonth : (nbVideos ?? 0);

  return (
    <fieldset className="mt-6">
      <legend className="font-bold text-white">Options à la carte</legend>
      {mode === "PACK_PARTICULIER" && maxVideos === 0 && (
        <p className="mt-2 text-xs text-white/40">
          Sélectionnez d&apos;abord le nombre de vidéos pour pouvoir ajouter des options.
        </p>
      )}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {OPTIONS_A_LA_CARTE.map((opt) => {
          const isBlockedByPlan = mode === "ABONNEMENT" && planId === "STANDARD" && (opt.key === "musiqueSurMesure" || opt.key === "podcast");
          const limit = opt.key === "creationBanniere" ? 20 : maxVideos;
          const isDisabled = (opt.key !== "creationBanniere" && maxVideos === 0) || isBlockedByPlan;
          const rawQty = options[opt.key] ?? 0;
          const isActive = rawQty > 0 && !isDisabled;
          const qty = Math.min(rawQty, limit);

          return (
            <div
              key={opt.key}
              className={`flex items-center justify-between gap-3 rounded-xl border-2 p-3.5 transition duration-200 select-none ${
                isActive
                  ? "border-df-gold bg-df-gold/5 shadow-[0_0_15px_rgba(243,107,31,0.05)]"
                  : isDisabled
                  ? "border-white/5 opacity-30 cursor-not-allowed"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.04] cursor-pointer"
              }`}
              onClick={() => {
                if (!isDisabled) {
                  toggleOption(opt.key);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  disabled={isDisabled}
                  checked={isActive}
                  onChange={() => {}} // controlled by container onClick
                  className="h-5 w-5 accent-df-gold cursor-pointer"
                />
                <div>
                  <p className="text-sm font-bold text-white">{opt.label}</p>
                  <p className="text-xs text-white/50">
                    {opt.price} € {opt.unit}
                  </p>
                  {isBlockedByPlan && (
                    <p className="mt-0.5 text-[10px] font-semibold text-red-400">
                      Non disponible avec la formule Standard
                    </p>
                  )}
                </div>
              </div>
              {isActive && (
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()} // prevent toggleOption trigger
                >
                  <button
                    type="button"
                    disabled={qty <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOptionQty(opt.key, qty - 1);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white font-bold cursor-pointer transition text-xs"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-df-gold">{qty}</span>
                  <button
                    type="button"
                    disabled={qty >= limit}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOptionQty(opt.key, qty + 1);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white font-bold cursor-pointer transition text-xs"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

// ─── Step 3 — Coordonnées ────────────────────────────────────────

export function Step3() {
  const f = useDevisForm();

  return (
    <div>
      <h2 className="font-display text-3xl uppercase tracking-tight text-white">
        Étape 3 — Vos coordonnées
      </h2>
      <p className="mt-1 text-white/60">
        Infos qui apparaîtront sur le devis.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Field
          label="Nom de l'entreprise"
          value={f.nomEntreprise}
          onChange={(v) => f.set("nomEntreprise", v)}
        />
        <Field
          label="Nom du contact (prénom nom)"
          required
          value={f.nomContact}
          onChange={(v) => f.set("nomContact", v)}
        />
        <Field
          label="Email"
          type="email"
          required
          value={f.emailContact}
          onChange={(v) => f.set("emailContact", v)}
        />
        <Field
          label="Téléphone"
          required
          value={f.telContact}
          onChange={(v) => f.set("telContact", v)}
        />
        <Field
          label="Lieu de tournage"
          required
          value={f.lieuTournage}
          onChange={(v) => f.set("lieuTournage", v)}
          className="md:col-span-2"
        />
        <label className="md:col-span-1">
          <span className="text-sm font-bold text-white">Date du tournage</span>
          <input
            type="date"
            value={f.dateTournage}
            onChange={(e) => f.set("dateTournage", e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-white/10 bg-white/[0.06] px-3 py-2 text-white placeholder:text-white/30 outline-none focus:border-df-glauque-500 focus:ring-2 focus:ring-df-glauque-500/20"
          />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm font-bold text-white">
            Remarques spécifiques
          </span>
          <textarea
            rows={4}
            value={f.remarques}
            onChange={(e) => f.set("remarques", e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-white/10 bg-white/[0.06] px-3 py-2 text-white placeholder:text-white/30 outline-none focus:border-df-glauque-500 focus:ring-2 focus:ring-df-glauque-500/20"
          />
        </label>
      </div>

      {/* Trust elements */}
      <div className="mt-6 rounded-xl bg-white/[0.04] p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-white/50" />
          <div className="text-sm text-white/60">
            <p className="font-bold text-white">
              Devis gratuit, sans engagement
            </p>
            <p className="mt-1">
              Nous vous recontactons sous 24h avec un devis détaillé. Aucun
              paiement n&apos;est requis à cette étape.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Field component ──────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-white">
        {label}
        {required && <span className="text-df-gold"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-white/10 bg-white/[0.06] px-3 py-2 text-white placeholder:text-white/30 outline-none focus:border-df-glauque-500 focus:ring-2 focus:ring-df-glauque-500/20"
      />
    </label>
  );
}
