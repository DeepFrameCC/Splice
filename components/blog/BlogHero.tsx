interface BlogHeroProps {
  articleCount?: number;
  themeCount?: number;
}

export default function BlogHero({ articleCount, themeCount }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-df-ink py-16 md:py-20">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-df-blue/20 via-transparent to-df-gold/10" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-df-gold/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-end">
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-df-gold">
            <span aria-hidden className="text-base leading-none">●</span>
            L&apos;Écho Créatif
          </p>
          <h1 className="font-sans text-4xl font-medium tracking-tight text-white md:text-6xl leading-[1.04]">
            Ressources &amp; <em className="not-italic text-df-gold">conseils</em>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/65 leading-relaxed">
            Guides pratiques, retours d&apos;expérience et analyses sur la production vidéo, le motion design et la stratégie digitale en Centre-Val de Loire.
          </p>
        </div>

        {(articleCount != null || themeCount != null) && (
          <div className="flex shrink-0 gap-8">
            {articleCount != null && (
              <div className="text-left md:text-right">
                <div className="font-sans text-4xl font-semibold leading-none text-white">
                  {articleCount}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-white/50">
                  article{articleCount !== 1 ? "s" : ""}
                </div>
              </div>
            )}
            {themeCount != null && (
              <div className="text-left md:text-right">
                <div className="font-sans text-4xl font-semibold leading-none text-white">
                  {themeCount}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-white/50">
                  thème{themeCount !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
