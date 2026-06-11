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

  const OPTIONS: { value: BillingCycle; label: string; badge?: string }[] = [
    { value: "MENSUEL", label: "Mensuel" },
    { value: "ANNUEL", label: "Annuel", badge: "Économisez" },
    { value: "SANS_ENGAGEMENT", label: "Sans engagement" },
  ];

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className={`rounded-full px-5 py-2 text-sm font-bold transition ${
            cycle === opt.value
              ? "bg-df-gold text-white shadow"
              : "text-white/60 hover:text-white"
          }`}
        >
          {opt.label}
          {opt.badge && (
            <span className="ml-1.5 text-[10px] font-bold text-emerald-400">
              {opt.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
