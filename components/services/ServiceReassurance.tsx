const GUARANTEES = [
  {
    title: "Expertise audiovisuelle",
    description: "Trois fondateurs, trois spécialités complémentaires. Chaque projet est porté par le profil le plus adapté.",
  },
  {
    title: "Délais tenus",
    description: "Planning calé en amont, livraison à la date convenue. Express 48h disponible sur demande.",
  },
  {
    title: "Qualité cinéma",
    description: "Matériel professionnel, étalonnage DaVinci, master 4K. Le rendu final se distingue des productions génériques.",
  },
];

export function ServiceReassurance() {
  return (
    <section id="reassurance" aria-labelledby="reassurance-h2" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-df-gold">Nos Engagements</p>
          <h2 id="reassurance-h2" className="mt-1 text-3xl font-extrabold tracking-tight text-white">
            Garanties Splice
          </h2>
        </div>
        <div className="h-px flex-1 bg-white/[0.08] mx-8 hidden md:block" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {GUARANTEES.map((g) => (
          <div
            key={g.title}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-df-gold/30 hover:bg-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
          >
            <h3 className="font-bold text-white group-hover:text-df-gold transition-colors duration-300 text-lg">
              {g.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60 group-hover:text-white/80 transition-colors duration-300">
              {g.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
