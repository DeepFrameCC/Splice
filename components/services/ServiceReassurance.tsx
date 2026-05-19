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
    <section id="reassurance" aria-labelledby="reassurance-h2" className="mt-16 scroll-mt-24">
      <h2 id="reassurance-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Nos engagements
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {GUARANTEES.map((g) => (
          <div key={g.title} className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-6">
            <h3 className="font-semibold text-white">{g.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{g.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
