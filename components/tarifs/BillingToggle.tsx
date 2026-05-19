"use client";
import { useState } from "react";
import type { BillingCycle } from "@/lib/pricing";

interface BillingToggleProps {
  defaultCycle?: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export default function BillingToggle({
  defaultCycle = "MENSUEL",
  onChange,
}: BillingToggleProps) {
  const [cycle, setCycle] = useState<BillingCycle>(defaultCycle);

  const toggle = (c: BillingCycle) => {
    setCycle(c);
    onChange(c);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
      <button
        type="button"
        onClick={() => toggle("MENSUEL")}
        className={`rounded-full px-5 py-2 text-sm font-bold transition ${
          cycle === "MENSUEL"
            ? "bg-df-gold text-white shadow"
            : "text-white/60 hover:text-white"
        }`}
      >
        Mensuel
      </button>
      <button
        type="button"
        onClick={() => toggle("ANNUEL")}
        className={`rounded-full px-5 py-2 text-sm font-bold transition ${
          cycle === "ANNUEL"
            ? "bg-df-gold text-white shadow"
            : "text-white/60 hover:text-white"
        }`}
      >
        Annuel
        <span className="ml-1.5 text-[10px] font-bold text-emerald-400">
          Économisez
        </span>
      </button>
    </div>
  );
}
