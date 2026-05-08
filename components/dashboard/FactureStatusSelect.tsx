"use client";
import { useTransition } from "react";
import { changerStatutFacture } from "@/app/actions/admin";
import toast from "react-hot-toast";

const STATUS_OPTIONS: { value: "EMISE" | "PAYEE" | "ANNULEE"; label: string }[] = [
  { value: "EMISE", label: "Emise" },
  { value: "PAYEE", label: "Payee" },
  { value: "ANNULEE", label: "Annulee" }
];

export default function FactureStatusSelect({ factureId, current }: { factureId: string; current: string }) {
  const [pending, start] = useTransition();

  return (
    <select
      disabled={pending}
      value={current}
      onChange={(e) => {
        const newStatus = e.target.value as "EMISE" | "PAYEE" | "ANNULEE";
        start(async () => {
          await changerStatutFacture(factureId, newStatus);
          toast.success("Statut mis a jour");
        });
      }}
      className="rounded-lg border-2 border-df-blue/15 px-2 py-1 text-xs font-bold text-df-blue outline-none transition focus:border-df-blue disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
