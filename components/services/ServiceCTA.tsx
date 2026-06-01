import { Sparkles, ArrowRight } from "lucide-react";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import { CtaTrackedLink } from "@/components/marketing/CtaTrackedLink";

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
        <CtaTrackedLink
          href="/devis"
          source="service_inline"
          className="w-full sm:w-auto shrink-0 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-df-gold px-5 py-2.5 text-xs font-bold text-black transition-all duration-300 hover:bg-df-gold/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-gold focus-visible:ring-offset-2 focus-visible:ring-offset-df-night shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
        >
          <span>Demander un devis</span>
          <ArrowRight className="h-3 w-3" />
        </CtaTrackedLink>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <CtaBlock
        variant="primary"
        source="service_block"
        title={`Lancez votre projet ${serviceName}`}
        subtitle="Discutons de votre besoin. Remplissez notre assistant de devis en 2 minutes ou planifiez un appel avec notre équipe."
        primaryHref="/devis"
        primaryLabel="Obtenir mon devis gratuit"
        secondaryHref="/contact"
        secondaryLabel="Nous contacter"
        reassurance="Gratuit · Sans engagement · Réponse sous 24h"
      />
    </div>
  );
}
