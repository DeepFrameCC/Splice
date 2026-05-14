"use client";
import { PACKS, DUREE_SUPPLEMENT, USAGE_PRICE_PER_VIDEO, DELAI } from "@/lib/pricing";
import { useDevisForm } from "./store";
import type { Pack, DureeTournage, UsageType, DelaiLivraison, VilleDepart } from "@prisma/client";
import { Check, Info } from "lucide-react";
import { useCallback } from "react";

const PACK_ORDER: Pack[] = ["BASIQUE", "VISIBILITE", "VISIBILITE_MIX", "PREMIUM", "INTRO_ANIMEE", "SUR_MESURE"];

export function Step1() {
  const pack = useDevisForm((s) => s.pack);
  const introAnimeeSec = useDevisForm((s) => s.introAnimeeSec);
  const set = useDevisForm((s) => s.set);

  const selectPack = useCallback((p: Pack) => {
    set("pack", p);
  }, [set]);

  return (
    <div>
      <h2 className="font-display text-3xl italic text-df-blue">Étape 1 — Quelle prestation ?</h2>
      <p className="mt-1 text-df-blue/70">Choisissez le pack qui correspond à votre besoin.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {PACK_ORDER.map((p) => {
          const info = PACKS[p];
          const isActive = pack === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => selectPack(p)}
              aria-pressed={isActive}
              className={`relative flex items-start justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-df-gold bg-df-cream shadow-md ring-2 ring-df-gold/40 scale-[1.01]"
                  : "border-df-blue/15 hover:border-df-blue/40 hover:bg-df-cream/50 hover:shadow-sm"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl italic text-df-blue">{info.label}</p>
                <p className="mt-1 text-sm text-df-blue/70">{info.description}</p>
                {info.videos > 0 && (
                  <p className="mt-1 text-xs font-medium text-df-blue/50">
                    {info.videos} vidéo{info.videos > 1 ? "s" : ""} incluse{info.videos > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="whitespace-nowrap text-lg font-bold text-df-blue">
                  {info.price > 0 ? `${info.price} €` : "Sur devis"}
                </p>
                {isActive && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-df-gold shadow-sm">
                    <Check className="h-4 w-4 text-white" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {pack === "INTRO_ANIMEE" && (
        <label className="mt-4 block">
          <span className="text-sm font-bold text-df-blue">Durée souhaitée (5 à 20s)</span>
          <input type="number" min={5} max={20} value={introAnimeeSec ?? ""} onChange={(e) => set("introAnimeeSec", e.target.value ? Number(e.target.value) : null)}
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-4 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
          <p className="mt-1 text-xs text-df-blue/60">Tarif final ajusté selon complexité (100-400 €).</p>
        </label>
      )}
    </div>
  );
}

export function Step2() {
  const f = useDevisForm();
  return (
    <div>
      <h2 className="font-display text-3xl italic text-df-blue">Étape 2 — Suppléments & tournage</h2>

      <fieldset className="mt-6">
        <legend className="font-bold text-df-blue">Durée du tournage</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {(Object.keys(DUREE_SUPPLEMENT) as DureeTournage[]).map((d) => (
            <button type="button" key={d} onClick={() => f.set("duree", d)}
              aria-pressed={f.duree === d}
              className={`rounded-xl border-2 p-3 text-sm font-bold transition-all duration-200 cursor-pointer ${f.duree === d ? "border-df-gold bg-df-cream text-df-blue shadow-md ring-2 ring-df-gold/40" : "border-df-blue/15 text-df-blue/70 hover:border-df-blue/40 hover:shadow-sm"}`}>
              {DUREE_SUPPLEMENT[d].label}{DUREE_SUPPLEMENT[d].price > 0 && ` (+${DUREE_SUPPLEMENT[d].price} €)`}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-bold text-df-blue">Lieu de tournage</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          <label className="md:col-span-1">
            <span className="text-sm text-df-blue/70">Départ</span>
            <select value={f.villeDepart} onChange={(e) => f.set("villeDepart", e.target.value as VilleDepart)}
              className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20 cursor-pointer">
              <option value="TOURS">Tours</option>
              <option value="ORLEANS">Orléans</option>
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="text-sm text-df-blue/70">Distance aller-retour (km) — 0,50 €/km</span>
            <input type="number" min={0} value={f.distanceKm} onChange={(e) => f.set("distanceKm", Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-bold text-df-blue">Vidéos supplémentaires & options</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <label>
            <span className="text-sm text-df-blue/70">Vidéos en plus (+90 €/u)</span>
            <input type="number" min={0} value={f.videosSupp} onChange={(e) => f.set("videosSupp", Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
          </label>
          <label>
            <span className="text-sm text-df-blue/70">Vidéos avec 3D (+110 €/u)</span>
            <input type="number" min={0} value={f.videos3D} onChange={(e) => f.set("videos3D", Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
          </label>
          <label className="flex items-center gap-3 rounded-xl border-2 border-df-blue/15 p-3 cursor-pointer hover:bg-df-cream/50 transition">
            <input type="checkbox" checked={f.motionDesign} onChange={(e) => f.set("motionDesign", e.target.checked)} className="h-5 w-5 accent-df-blue cursor-pointer" />
            <span className="text-sm font-bold text-df-blue">Motion Design (+40 €)</span>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

export function Step3() {
  const f = useDevisForm();
  const incompatible = f.pack === "PREMIUM" || f.videos3D > 0;
  return (
    <div>
      <h2 className="font-display text-3xl italic text-df-blue">Étape 3 — Diffusion & livraison</h2>

      <fieldset className="mt-6">
        <legend className="font-bold text-df-blue">Usage des vidéos</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {(Object.keys(USAGE_PRICE_PER_VIDEO) as UsageType[]).map((u) => (
            <button type="button" key={u} onClick={() => f.set("usage", u)}
              aria-pressed={f.usage === u}
              className={`rounded-xl border-2 p-3 text-sm font-bold transition-all duration-200 cursor-pointer ${f.usage === u ? "border-df-gold bg-df-cream text-df-blue shadow-md ring-2 ring-df-gold/40" : "border-df-blue/15 text-df-blue/70 hover:border-df-blue/40 hover:shadow-sm"}`}>
              {USAGE_PRICE_PER_VIDEO[u].label}
              {USAGE_PRICE_PER_VIDEO[u].perVideo > 0 && <span className="block text-xs">+{USAGE_PRICE_PER_VIDEO[u].perVideo} €/vidéo</span>}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-bold text-df-blue">Délai de livraison</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {(Object.keys(DELAI) as DelaiLivraison[]).map((d) => (
            <button type="button" key={d} onClick={() => f.set("delai", d)}
              aria-pressed={f.delai === d}
              className={`rounded-xl border-2 p-3 text-sm font-bold transition-all duration-200 cursor-pointer ${f.delai === d ? "border-df-gold bg-df-cream text-df-blue shadow-md ring-2 ring-df-gold/40" : "border-df-blue/15 text-df-blue/70 hover:border-df-blue/40 hover:shadow-sm"}`}>
              {DELAI[d].label}{DELAI[d].price > 0 && ` (+${DELAI[d].price} €)`}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-bold text-df-blue">Montage</legend>
        <label className={`mt-2 flex items-center gap-3 rounded-xl border-2 p-3 transition ${incompatible ? "opacity-50 cursor-not-allowed border-df-blue/10" : "border-df-blue/15 cursor-pointer hover:bg-df-cream/50"}`}>
          <input type="checkbox" disabled={incompatible} checked={f.montageExpress && !incompatible}
            onChange={(e) => f.set("montageExpress", e.target.checked)} className={`h-5 w-5 accent-df-blue ${incompatible ? "cursor-not-allowed" : "cursor-pointer"}`} />
          <div>
            <p className="font-bold text-df-blue">Montage express 48h (+55 €)</p>
            {incompatible && <p className="text-xs text-rose-600">Non cumulable avec Pack Premium ou option 3D.</p>}
          </div>
        </label>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-bold text-df-blue">Formats des vidéos</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <label>
            <span className="text-sm text-df-blue/70">Nb format 9:16 (portrait)</span>
            <input type="number" min={0} value={f.nbFormat916 ?? 0} onChange={(e) => f.set("nbFormat916" as keyof typeof f, Math.max(0, Number(e.target.value) || 0) as never)}
              className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
          </label>
          <label>
            <span className="text-sm text-df-blue/70">Nb format 16:9 (paysage)</span>
            <input type="number" min={0} value={f.nbFormat169 ?? 0} onChange={(e) => f.set("nbFormat169" as keyof typeof f, Math.max(0, Number(e.target.value) || 0) as never)}
              className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

export function Step4() {
  const f = useDevisForm();
  return (
    <div>
      <h2 className="font-display text-3xl italic text-df-blue">Étape 4 — Vos coordonnées</h2>
      <p className="mt-1 text-df-blue/70">Infos qui apparaîtront sur le devis.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Field label="Nom de l'entreprise" value={f.nomEntreprise} onChange={(v) => f.set("nomEntreprise", v)} />
        <Field label="Nom du contact (prénom nom)" required value={f.nomContact} onChange={(v) => f.set("nomContact", v)} />
        <Field label="Email" type="email" required value={f.emailContact} onChange={(v) => f.set("emailContact", v)} />
        <Field label="Téléphone" required value={f.telContact} onChange={(v) => f.set("telContact", v)} />
        <Field label="Lieu de tournage" required value={f.lieuTournage} onChange={(v) => f.set("lieuTournage", v)} className="md:col-span-2" />
        <label className="md:col-span-1">
          <span className="text-sm font-bold text-df-blue">Date du tournage</span>
          <input type="date" value={f.dateTournage} onChange={(e) => f.set("dateTournage", e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm font-bold text-df-blue">Remarques spécifiques</span>
          <textarea rows={4} value={f.remarques} onChange={(e) => f.set("remarques", e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
        </label>
      </div>

      {/* Trust elements */}
      <div className="mt-6 rounded-xl bg-df-cream/50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-df-blue/60" />
          <div className="text-sm text-df-blue/70">
            <p className="font-bold text-df-blue">Devis gratuit, sans engagement</p>
            <p className="mt-1">Nous vous recontactons sous 24h avec un devis détaillé. Aucun paiement n&apos;est requis à cette étape.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, className }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; className?: string }) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-df-blue">{label}{required && <span className="text-df-gold"> *</span>}</span>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 outline-none focus:border-df-blue focus:ring-2 focus:ring-df-blue/20" />
    </label>
  );
}
