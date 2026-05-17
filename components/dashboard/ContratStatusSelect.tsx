"use client";
import { useTransition } from "react";
import { changerStatutContrat } from "@/app/actions/admin";
import toast from "react-hot-toast";

const STATUS_OPTIONS: { value: "A_VENIR" | "EN_COURS" | "FINI"; label: string }[] = [
  { value: "A_VENIR", label: "À venir" },
  { value: "EN_COURS", label: "En cours" },
  { value: "FINI", label: "Fini" }
];

export default function ContratStatusSelect({ contratId, current }: { contratId: string; current: string }) {
  const [pending, start] = useTransition();

  return (
    <select
      disabled={pending}
      value={current}
      onChange={(e) => {
        const newStatus = e.target.value as "A_VENIR" | "EN_COURS" | "FINI";
        start(async () => {
          await changerStatutContrat(contratId, newStatus);
          toast.success("Statut mis à jour");
        });
      }}
      className="rounded-lg border-2 border-white/10 px-2 py-1 text-xs font-bold text-df-blue outline-none transition focus:border-df-blue disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
