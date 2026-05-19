import { Clock, Euro } from "lucide-react";
import Link from "next/link";

interface Props {
  priceRange: string;
}

export function ServicePricing({ priceRange }: Props) {
  return (
    <section
      id="delais"
      aria-labelledby="delais-h2"
      className="mt-16 scroll-mt-24"
    >
      <h2
        id="delais-h2"
        className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
      >
        Délais et tarifs
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Delivery card */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-6">
          <Clock className="h-5 w-5 text-df-gold" aria-hidden="true" />
          <p className="mt-3 text-lg font-semibold text-white">
            Délai standard
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Livraison sous 7 à 14 jours ouvrés selon la complexité du projet.
            Option express disponible.
          </p>
        </div>

        {/* Pricing card */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-6">
          <Euro className="h-5 w-5 text-df-gold" aria-hidden="true" />
          <p className="mt-3 text-lg font-semibold text-white">{priceRange}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Devis gratuit et sans engagement. Tarif ajusté selon vos besoins.
          </p>
        </div>
      </div>

      <Link
        href="/devis"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-df-gold hover:underline"
      >
        Demander un devis gratuit →
      </Link>
    </section>
  );
}
