"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics/track";

interface StickyMobileCtaProps {
  /** Plausible source tag (e.g. "sticky_service"). */
  source: string;
  href?: string;
  label?: string;
}

/**
 * Mobile-only fixed CTA bar shown at the bottom of conversion pages.
 * Hidden on `/devis` (where it would be redundant) and on viewports ≥ md.
 */
export function StickyMobileCta({
  source,
  href = "/devis",
  label = "Devis gratuit",
}: StickyMobileCtaProps) {
  const pathname = usePathname();
  if (pathname?.startsWith("/devis")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-df-night/90 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      <Link
        href={href}
        onClick={() => track("CTA_Devis", { source })}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-df-gold px-6 text-sm font-bold text-black transition-colors hover:bg-df-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-gold focus-visible:ring-offset-2 focus-visible:ring-offset-df-night"
      >
        <span>{label}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
