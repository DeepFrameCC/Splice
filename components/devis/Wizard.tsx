"use client";
import { useTransition, useEffect } from "react";
import { useDevisForm } from "./store";
import { Step1, Step2Abonnement, Step2PackParticulier, Step2FormuleBienvenue, Step3 } from "./Steps";
import Recap from "./Recap";
import { submitDevis } from "@/app/actions/devis";
import { ChevronLeft, ChevronRight, Send, Shield, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const STEP_META = [
  { n: 1, label: "Prestation", desc: "Type de prestation" },
  { n: 2, label: "Configuration", desc: "Plan & options" },
  { n: 3, label: "Coordonnées", desc: "Vos informations" },
];

interface WizardProps {
  isAuthenticated?: boolean;
  canUseFormuleBienvenue?: boolean;
  isAdmin?: boolean;
  userInfo?: { name: string; email: string } | null;
}

export default function Wizard({ isAuthenticated = false, canUseFormuleBienvenue = false, isAdmin = false, userInfo = null }: WizardProps) {
  const f = useDevisForm();
  const [pending, start] = useTransition();
  const router = useRouter();

  useEffect(() => {
    f.set("isAuthenticated", isAuthenticated);
    f.set("canUseFormuleBienvenue", canUseFormuleBienvenue);
    f.set("isAdmin", isAdmin);
    if (!isAdmin) {
      f.set("useLaunchPrice", false);
    }
    if (userInfo) {
      if (!f.nomContact) f.set("nomContact", userInfo.name);
      if (!f.emailContact) f.set("emailContact", userInfo.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, canUseFormuleBienvenue, isAdmin]);

  const canNext = () => {
    if (f.step === 1) return Boolean(f.mode);
    if (f.step === 2) {
      if (f.mode === "FORMULE_BIENVENUE") return true;
      if (f.mode === "ABONNEMENT") return Boolean(f.planId);
      return (f.nbVideos !== null && f.nbVideos > 0) || (f.nbPhotos !== null && f.nbPhotos > 0);
    }
    if (f.step === 3) {
      return Boolean(f.nomContact && f.emailContact && f.telContact && f.lieuTournage);
    }
    return true;
  };

  const onSubmit = () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour envoyer votre devis");
      router.push("/login?callbackUrl=/devis");
      return;
    }

    start(async () => {
      try {
        const payload = {
          mode: f.mode,
          planId: f.planId,
          billingCycle: f.billingCycle,
          useLaunchPrice: f.useLaunchPrice,
          nbVideos: f.nbVideos,
          nbPhotos: f.nbPhotos,
          banniere: f.banniere,
          villeDepart: f.villeDepart,
          distanceKm: f.distanceKm,
          delai: f.delai,
          duree: f.duree,
          options: f.options,
          nomEntreprise: f.nomEntreprise,
          nomContact: f.nomContact,
          emailContact: f.emailContact,
          telContact: f.telContact,
          lieuTournage: f.lieuTournage,
          dateTournage: f.dateTournage || undefined,
          remarques: f.remarques,
        };
        await submitDevis(payload as Parameters<typeof submitDevis>[0]);
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

  const progress = (f.step / 3) * 100;

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
            Étape {f.step} sur 3
          </p>
        </div>

        {/* Steps indicator */}
        <ol className="mb-8 flex items-center justify-between gap-2">
          {STEP_META.map((s, i) => (
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
                {f.step > s.n ? <CheckCircle className="h-4 w-4" /> : s.n}
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
              {i < STEP_META.length - 1 && (
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
          {f.step === 2 && f.mode === "ABONNEMENT" && <Step2Abonnement />}
          {f.step === 2 && f.mode === "PACK_PARTICULIER" && <Step2PackParticulier />}
          {f.step === 2 && f.mode === "FORMULE_BIENVENUE" && <Step2FormuleBienvenue />}
          {f.step === 3 && <Step3 />}

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
            {f.step < 3 ? (
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
                  <>
                    Envoyer le devis <Send className="h-5 w-5" />
                  </>
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
