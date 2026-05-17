import Link from "next/link";

interface Props {
  variant: "inline" | "block";
  serviceName: string;
}

export function ServiceCTA({ variant, serviceName }: Props) {
  if (variant === "inline") {
    return (
      <div className="my-12 flex items-center gap-4 rounded-lg border border-df-gold/30 bg-white/[0.05] px-6 py-4">
        <p className="text-sm text-white/80">
          Un projet {serviceName} ? Obtenez votre devis en ligne en 2 minutes.
        </p>
        <Link
          href="/devis"
          className="shrink-0 rounded-full bg-df-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-df-blue-dark"
        >
          Demander un devis
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-20 rounded-2xl bg-df-blue px-6 py-12 text-center md:px-12 md:py-16">
      <h2 className="text-2xl font-bold text-white md:text-3xl">
        Lancez votre projet {serviceName}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-white/80">
        Devis gratuit, sans engagement. Notre equipe revient vers vous sous 24h.
      </p>
      <Link
        href="/devis"
        className="mt-8 inline-block rounded-full bg-df-gold px-8 py-3 text-sm font-bold text-white transition hover:bg-df-gold-soft"
      >
        Obtenir mon devis gratuit
      </Link>
    </section>
  );
}
