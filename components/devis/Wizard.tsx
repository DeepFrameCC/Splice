"use client";
import { useTransition } from "react";
import { useDevisForm } from "./store";
import { Step1, Step2, Step3, Step4 } from "./Steps";
import Recap from "./Recap";
import { submitDevis } from "@/app/actions/devis";
import { ChevronLeft, ChevronRight, Send, Shield, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const steps = [
  { n: 1, label: "Prestation", desc: "Choisissez votre pack" },
  { n: 2, label: "Suppléments", desc: "Options & tournage" },
  { n: 3, label: "Diffusion", desc: "Livraison & formats" },
  { n: 4, label: "Coordonnées", desc: "Vos informations" },
];

export default function Wizard() {
  const f = useDevisForm();
  const [pending, start] = useTransition();

  const canNext = () => {
    if (f.step === 1) return Boolean(f.pack);
    if (f.step === 4) return f.nomContact && f.emailContact && f.telContact && f.lieuTournage;
    return true;
  };

  const onSubmit = () => {
    start(async () => {
      try {
        await submitDevis({ ...f, dateTournage: f.dateTournage || undefined });
      } catch (e: unknown) {
        if (e && typeof e === "object" && "digest" in e) {
          const digest = (e as { digest?: string }).digest;
          if (digest?.includes?.("NEXT_REDIRECT")) throw e;
        }
        const msg = e instanceof Error ? e.message : "Erreur lors de l'envoi";
        toast.error(msg);
      }
    });
  };

  const progress = (f.step / 4) * 100;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-df-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-df-glauque-mid to-df-gold transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs font-bold text-white/50">
            Étape {f.step} sur 4
          </p>
        </div>

        {/* Steps indicator */}
        <ol className="mb-8 flex items-center justify-between gap-2">
          {steps.map((s, i) => (
            <li key={s.n} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-all duration-300 ${
                  f.step > s.n
                    ? "bg-emerald-500 text-white"
                    : f.step === s.n
                    ? "bg-df-glauque-mid text-white shadow-md shadow-df-glauque-mid/30"
                    : "bg-df-surface text-white/50"
                }`}
              >
                {f.step > s.n ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  s.n
                )}
              </span>
              <div className="hidden md:block">
                <span
                  className={`text-sm font-bold ${
                    f.step >= s.n ? "text-white" : "text-white/40"
                  }`}
                >
                  {s.label}
                </span>
                <span className="block text-[10px] text-white/40">{s.desc}</span>
              </div>
              {i < steps.length - 1 && (
                <span
                  className={`h-0.5 flex-1 transition-colors duration-300 ${
                    f.step > s.n ? "bg-emerald-500" : "bg-df-surface"
                  }`}
                />
              )}
            </li>
          ))}
        </ol>

        {/* Step content */}
        <div className="relative z-10 rounded-3xl bg-df-surface p-6 shadow ring-1 ring-white/[0.08] md:p-8">
          {f.step === 1 && <Step1 />}
          {f.step === 2 && <Step2 />}
          {f.step === 3 && <Step3 />}
          {f.step === 4 && <Step4 />}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={f.prev}
              disabled={f.step === 1}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-5 py-3 font-bold text-white/70 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" /> Retour
            </button>
            {f.step < 4 ? (
              <button
                type="button"
                onClick={f.next}
                disabled={!canNext()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={pending || !canNext()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Envoi en cours…
                  </>
                ) : (
                  <>Envoyer le devis <Send className="h-5 w-5" /></>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-df-glauque-300" />
            Données sécurisées
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-df-glauque-300" />
            Réponse sous 24h
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-df-glauque-300" />
            Sans engagement
          </span>
        </div>
      </div>
      <Recap />
    </div>
  );
}
