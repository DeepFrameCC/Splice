import { CheckCircle, Clock, Clapperboard } from "lucide-react";

const steps = [
  { key: "A_VENIR",  label: "A venir",  icon: Clock },
  { key: "EN_COURS", label: "En cours",  icon: Clapperboard },
  { key: "FINI",     label: "Termine", icon: CheckCircle },
] as const;

type ContratStatus = "A_VENIR" | "EN_COURS" | "FINI";

export default function ContratTimeline({ status }: { status: ContratStatus }) {
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-1" role="list" aria-label="Progression du contrat">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center gap-1" role="listitem">
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                done
                  ? "bg-df-blue text-white"
                  : "bg-df-cream text-df-blue/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-4 rounded-full transition-colors ${
                  i < currentIndex ? "bg-df-blue" : "bg-df-blue/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
