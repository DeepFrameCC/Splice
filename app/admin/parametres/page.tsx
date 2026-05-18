import { PACKS, DUREE_SUPPLEMENT, USAGE_PRICE_PER_VIDEO, DELAI, PRIX_KM, ACOMPTE_RATE } from "@/lib/pricing";
import { Settings, CreditCard, FileText, Calculator, Truck, Clock, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminParametresPage() {
  const packs = Object.values(PACKS);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Tarifs, mentions légales et configuration
        </p>
      </header>

      {/* Tarifs Packs */}
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
          <Package className="h-5 w-5 text-df-gold" />
          <div>
            <h2 className="font-display text-lg font-bold text-white">Tarifs des packs</h2>
            <p className="text-xs text-white/30">Modifiez dans lib/pricing.ts</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Pack</th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-white/30">Prix HT</th>
                <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white/30">Vidéos</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Description</th>
              </tr>
            </thead>
            <tbody>
              {packs.map((p, i) => (
                <tr key={p.code} className={`border-b border-white/[0.06] ${i % 2 === 0 ? "bg-df-surface" : "bg-white/[0.02]"}`}>
                  <td className="px-5 py-3 font-display text-sm font-bold text-white">{p.label}</td>
                  <td className="px-5 py-3 text-right font-display font-bold text-df-gold">
                    {p.price > 0 ? `${p.price} €` : "Sur devis"}
                  </td>
                  <td className="px-5 py-3 text-center text-white/50">{p.videos || "—"}</td>
                  <td className="px-5 py-3 text-xs text-white/40">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suppléments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Durée tournage */}
        <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
            <Clock className="h-5 w-5 text-purple-600" />
            <h2 className="font-display text-lg font-bold text-white">Durée tournage</h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {Object.entries(DUREE_SUPPLEMENT).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-white">{val.label}</span>
                <span className={`font-display text-sm font-bold ${val.price > 0 ? "text-df-gold" : "text-emerald-400"}`}>
                  {val.price > 0 ? `+${val.price} €` : "Inclus"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Délai livraison */}
        <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
            <Truck className="h-5 w-5 text-amber-600" />
            <h2 className="font-display text-lg font-bold text-white">Délai de livraison</h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {Object.entries(DELAI).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-white">{val.label}</span>
                <span className={`font-display text-sm font-bold ${val.price > 0 ? "text-df-gold" : "text-emerald-400"}`}>
                  {val.price > 0 ? `+${val.price} €` : "Inclus"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage / droits */}
        <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
            <CreditCard className="h-5 w-5 text-df-gold" />
            <h2 className="font-display text-lg font-bold text-white">Droits d&apos;usage</h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {Object.entries(USAGE_PRICE_PER_VIDEO).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between px-6 py-3.5">
                <span className="text-sm text-white">{val.label}</span>
                <span className={`font-display text-sm font-bold ${val.perVideo > 0 ? "text-df-gold" : "text-emerald-400"}`}>
                  {val.perVideo > 0 ? `+${val.perVideo} €/vidéo` : "Inclus"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Constantes */}
        <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
            <Calculator className="h-5 w-5 text-emerald-400" />
            <h2 className="font-display text-lg font-bold text-white">Constantes</h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            <div className="flex items-center justify-between px-6 py-3.5">
              <span className="text-sm text-white">Prix au km</span>
              <span className="font-display text-sm font-bold text-df-gold">{PRIX_KM} €/km</span>
            </div>
            <div className="flex items-center justify-between px-6 py-3.5">
              <span className="text-sm text-white">Taux d&apos;acompte</span>
              <span className="font-display text-sm font-bold text-df-gold">{ACOMPTE_RATE}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mentions légales */}
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
          <FileText className="h-5 w-5 text-white/40" />
          <div>
            <h2 className="font-display text-lg font-bold text-white">Mentions légales devis/factures</h2>
            <p className="text-xs text-white/30">Incluses automatiquement dans les PDFs</p>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="rounded-xl bg-white/[0.04] p-4 text-xs leading-relaxed text-white/50">
            <p className="font-bold text-white/80">TVA non applicable, art. 293 B du CGI</p>
            <p className="mt-2">
              Auto-entrepreneur — Dispense d&apos;immatriculation au RCS.
              Conditions de paiement : {ACOMPTE_RATE}% d&apos;acompte à la commande, solde à réception.
            </p>
            <p className="mt-2">
              En cas de retard de paiement, une pénalité égale à 3 fois le taux d&apos;intérêt légal sera appliquée,
              ainsi qu&apos;une indemnité forfaitaire de 40€ pour frais de recouvrement.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration système */}
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-4">
          <Settings className="h-5 w-5 text-white/40" />
          <h2 className="font-display text-lg font-bold text-white">Configuration système</h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {[
            { label: "Hébergeur", value: "Vercel (Edge Network)" },
            { label: "Base de données", value: "Neon PostgreSQL (eu-central-1)" },
            { label: "Paiements", value: "Stripe Checkout" },
            { label: "Emails", value: "Resend + React Email" },
            { label: "PDF", value: "PDFKit (server-side)" },
            { label: "Analytics", value: "Plausible (prévu)" },
            { label: "Stockage médias", value: "Cloudflare R2 (prévu)" },
            { label: "Signature", value: "Yousign eIDAS (prévu)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-6 py-3.5">
              <span className="text-sm text-white/50">{item.label}</span>
              <span className="text-sm font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
