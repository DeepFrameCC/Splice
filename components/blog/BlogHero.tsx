export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-df-ink py-20 md:py-28">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-df-blue/30 via-transparent to-df-gold/10" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-df-gold/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
          L&apos;Écho Créatif — Blog &amp; Insights
        </p>
        <h1 className="mt-4 font-sans text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl leading-tight">
          Nos ressources &amp; <em className="not-italic text-df-gold">conseils</em>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70 leading-relaxed font-sans">
          Découvrez nos guides pratiques, retours d&apos;expérience et analyses sur la production vidéo, le motion design et la stratégie digitale en Centre-Val de Loire.
        </p>
      </div>
    </section>
  );
}
