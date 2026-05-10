interface TOCSection {
  id: string;
  label: string;
}

interface Props {
  sections: TOCSection[];
}

export function ServiceTOC({ sections }: Props) {
  return (
    <nav aria-label="Sommaire" className="rounded-xl border border-df-blue/10 bg-df-cream/50 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-df-blue/50">Sommaire</p>
      <ol className="mt-3 space-y-2">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="group flex items-center gap-2 text-sm text-df-ink/70 transition hover:text-df-blue"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-df-blue/10 text-[10px] font-bold text-df-blue group-hover:bg-df-blue group-hover:text-white transition">
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
