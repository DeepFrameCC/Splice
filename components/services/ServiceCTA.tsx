import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface Props {
  variant: "inline" | "block";
  serviceName: string;
}

export function ServiceCTA({ variant, serviceName }: Props) {
  if (variant === "inline") {
    return (
      <div className="my-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md px-6 py-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-df-gold/10 text-df-gold">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-white/80">
            Un projet de <span className="text-white font-bold">{serviceName}</span> ? Obtenez votre devis sur-mesure en 2 minutes.
          </p>
        </div>
        <Link
          href="/devis"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-df-gold px-5 py-2.5 text-xs font-bold text-black transition-all duration-300 hover:bg-df-gold/90 hover:scale-[1.02] shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
        >
          <span>Demander un devis</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-20 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 md:p-14 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_10px_50px_-12px_rgba(0,0,0,0.5)]">
      {/* Background glow effects */}
      <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-df-gold/5 blur-3xl" />
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-df-gold/5 blur-3xl" />

      <div className="relative max-w-2xl mx-auto flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-df-gold/10 text-df-gold mb-6 animate-[bounce_1s_ease-in-out_1]">
          <Sparkles className="h-6 w-6" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Lancez votre projet {serviceName}
        </h2>

        <p className="mt-4 text-white/60 text-base md:text-lg leading-relaxed">
          Discutons de votre besoin. Remplissez notre assistant de devis en 2 minutes ou planifiez un appel avec notre équipe. Réponse garantie sous 24h.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/devis"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-df-gold px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-df-gold/90 hover:scale-[1.02] shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
          >
            <span>Obtenir mon devis gratuit</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05]"
          >
            Nous contacter
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/40 tracking-wide font-medium uppercase">
          Gratuit · Sans engagement · Étude sous 24h
        </p>
      </div>
    </section>
  );
}
