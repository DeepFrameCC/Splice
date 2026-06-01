import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { CtaTrackedLink } from "./CtaTrackedLink";

interface CtaBlockProps {
  /**
   * `primary`: full gold-accented conversion section (end of articles, services).
   * `soft`: lighter inline band for less prominent placements.
   */
  variant?: "primary" | "soft";
  title: string;
  subtitle?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Reassurance line under the buttons. Pass `null` to hide. */
  reassurance?: string | null;
  /** Plausible source tag for the primary CTA (e.g. "blog_article"). */
  source: string;
}

const DEFAULT_REASSURANCE = "Réponse sous 24h · Sans engagement";

/**
 * Canonical marketing call-to-action block.
 * Server Component; the primary button delegates to a tiny client wrapper
 * (`CtaTrackedLink`) so a Plausible event fires without blocking navigation.
 */
export function CtaBlock({
  variant = "primary",
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  reassurance = DEFAULT_REASSURANCE,
  source,
}: CtaBlockProps) {
  const primaryClasses =
    "w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-df-gold px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-df-gold/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-gold focus-visible:ring-offset-2 focus-visible:ring-offset-df-night shadow-[0_4px_20px_rgba(212,175,55,0.25)]";

  const secondaryClasses =
    "w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

  if (variant === "soft") {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center text-white sm:p-8">
        <h2 className="font-sans text-xl font-extrabold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/60 sm:text-base">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaTrackedLink href={primaryHref} source={source} className={primaryClasses}>
            <span>{primaryLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </CtaTrackedLink>
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className={secondaryClasses}>
              {secondaryLabel}
            </Link>
          )}
        </div>
        {reassurance && (
          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-white/40">
            {reassurance}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_10px_50px_-12px_rgba(0,0,0,0.5)] sm:p-8 md:p-14">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-df-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-df-gold/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-df-gold/10 text-df-gold">
          <Sparkles className="h-6 w-6" />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
            {subtitle}
          </p>
        )}

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <CtaTrackedLink href={primaryHref} source={source} className={primaryClasses}>
            <span>{primaryLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </CtaTrackedLink>
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className={secondaryClasses}>
              {secondaryLabel}
            </Link>
          )}
        </div>

        {reassurance && (
          <p className="mt-6 text-xs font-medium uppercase tracking-wide text-white/40">
            {reassurance}
          </p>
        )}
      </div>
    </section>
  );
}
