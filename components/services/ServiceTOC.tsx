interface TOCSection {
  id: string;
  label: string;
}

interface Props {
  sections: TOCSection[];
}

export function ServiceTOC({ sections }: Props) {
  return (
    <nav aria-label="Sommaire" className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-df-gold">Sommaire</p>
      <ol className="mt-3 space-y-2">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="group flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-df-gold/10 text-[10px] font-bold text-df-gold group-hover:bg-df-gold group-hover:text-white transition">
                {i + 1}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
