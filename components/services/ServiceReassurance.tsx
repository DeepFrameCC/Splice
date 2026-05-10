const GUARANTEES = [
  {
    title: "Expertise audiovisuelle",
    description: "Trois fondateurs, trois specialites complementaires. Chaque projet est porte par le profil le plus adapte.",
  },
  {
    title: "Delais tenus",
    description: "Planning cale en amont, livraison a la date convenue. Express 48h disponible sur demande.",
  },
  {
    title: "Qualite cinema",
    description: "Materiel professionnel, etalonnage DaVinci, master 4K. Le rendu final se distingue des productions generiques.",
  },
];

export function ServiceReassurance() {
  return (
    <section id="reassurance" aria-labelledby="reassurance-h2" className="mt-16 scroll-mt-24">
      <h2 id="reassurance-h2" className="text-2xl font-semibold tracking-tight text-df-blue md:text-3xl">
        Nos engagements
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {GUARANTEES.map((g) => (
          <div key={g.title} className="rounded-xl border border-df-blue/10 bg-df-cream/40 p-6">
            <h3 className="font-semibold text-df-ink">{g.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-df-ink/70">{g.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
