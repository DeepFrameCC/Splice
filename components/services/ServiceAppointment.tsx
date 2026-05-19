import Link from "next/link";

export function ServiceAppointment() {
  return (
    <section id="rdv" aria-labelledby="rdv-h2" className="mt-16 scroll-mt-24">
      <h2
        id="rdv-h2"
        className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
      >
        Prendre rendez-vous
      </h2>

      <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-white/70">
        Discutons de votre projet. Premier échange gratuit et sans engagement
        pour définir vos besoins et vous proposer une approche sur mesure.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/devis"
          className="inline-flex items-center justify-center rounded-full bg-df-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-df-gold/90"
        >
          Demander un devis
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
        >
          Nous contacter
        </Link>
      </div>

      <p className="mt-4 text-xs text-white/40">
        Réponse sous 24h &middot; Devis sans engagement
      </p>
    </section>
  );
}
