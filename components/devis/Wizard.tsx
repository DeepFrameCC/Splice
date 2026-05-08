"use client";
import { useTransition } from "react";
import { useDevisForm } from "./store";
import { Step1, Step2, Step3, Step4 } from "./Steps";
import Recap from "./Recap";
import { submitDevis } from "@/app/actions/devis";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import toast from "react-hot-toast";

const steps = [
  { n: 1, label: "Prestation" },
  { n: 2, label: "Suppléments" },
  { n: 3, label: "Diffusion" },
  { n: 4, label: "Coordonnées" }
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
      } catch (e: any) {
        if (e?.digest?.includes?.("NEXT_REDIRECT")) throw e;
        toast.error(e?.message ?? "Erreur lors de l'envoi");
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <ol className="mb-8 flex items-center justify-between gap-2">
          {steps.map((s, i) => (
            <li key={s.n} className="flex flex-1 items-center gap-2">
              <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${f.step >= s.n ? "bg-df-blue text-white" : "bg-df-cream text-df-blue/50"}`}>{s.n}</span>
              <span className={`hidden text-sm font-bold md:block ${f.step >= s.n ? "text-df-blue" : "text-df-blue/40"}`}>{s.label}</span>
              {i < steps.length - 1 && <span className={`h-0.5 flex-1 ${f.step > s.n ? "bg-df-blue" : "bg-df-cream"}`} />}
            </li>
          ))}
        </ol>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-df-blue/10 md:p-8">
          {f.step === 1 && <Step1 />}
          {f.step === 2 && <Step2 />}
          {f.step === 3 && <Step3 />}
          {f.step === 4 && <Step4 />}

          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={f.prev} disabled={f.step === 1}
              className="inline-flex items-center gap-2 rounded-full border-2 border-df-blue px-5 py-3 font-bold text-df-blue transition hover:bg-df-blue hover:text-white disabled:opacity-30">
              <ChevronLeft className="h-5 w-5" /> Retour
            </button>
            {f.step < 4 ? (
              <button type="button" onClick={f.next} disabled={!canNext()} className="btn-primary disabled:opacity-50">
                Suivant <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button type="button" onClick={onSubmit} disabled={pending || !canNext()} className="btn-primary disabled:opacity-50">
                {pending ? "Envoi…" : <>Envoyer le devis <Send className="h-5 w-5" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
      <Recap />
    </div>
  );
}
