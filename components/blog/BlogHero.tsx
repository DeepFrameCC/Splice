export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-df-ink py-20 md:py-28">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-df-blue/30 via-transparent to-df-gold/10" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-df-gold/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-df-gold">
          Blog &amp; Ressources
        </p>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-tight text-white md:text-6xl lg:text-7xl">
          Nos articles &amp; conseils
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">
          Guides pratiques, retours d&apos;expérience et tendances du monde audiovisuel — par l&apos;équipe DeepFrame.
        </p>
      </div>
    </section>
  );
}
