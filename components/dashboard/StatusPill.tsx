type StatusKind = "ATTENTE" | "VALIDE" | "REFUSE" | "PAYE" | "ABONNE" | "EMISE" | "PAYEE" | "ANNULEE" | "A_VENIR" | "EN_COURS" | "FINI";

const map: Record<StatusKind, { label: string; bg: string; dot: string }> = {
  ATTENTE: { label: "En attente", bg: "bg-amber-500/15 text-amber-400",  dot: "bg-amber-500" },
  VALIDE:  { label: "Valid\u00e9",     bg: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-500" },
  REFUSE:  { label: "Refus\u00e9",     bg: "bg-rose-100 text-rose-900",   dot: "bg-rose-500" },
  PAYE:    { label: "Pay\u00e9",       bg: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-500" },
  ABONNE:  { label: "Abonn\u00e9",     bg: "bg-df-gold/15 text-df-gold",  dot: "bg-df-gold" },
  EMISE:   { label: "\u00c9mise",      bg: "bg-amber-500/15 text-amber-400",  dot: "bg-amber-500" },
  PAYEE:   { label: "Pay\u00e9e",      bg: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-500" },
  ANNULEE: { label: "Annul\u00e9e",    bg: "bg-rose-100 text-rose-900",   dot: "bg-rose-500" },
  A_VENIR: { label: "\u00c0 venir",    bg: "bg-amber-500/15 text-amber-400",  dot: "bg-amber-500" },
  EN_COURS:{ label: "En cours",   bg: "bg-emerald-500/15 text-emerald-400", dot: "bg-emerald-500" },
  FINI:    { label: "Termin\u00e9",    bg: "bg-sky-100 text-sky-900",     dot: "bg-sky-500" }
};

export default function StatusPill({ status }: { status: StatusKind }) {
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${s.bg}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
    </span>
  );
}
