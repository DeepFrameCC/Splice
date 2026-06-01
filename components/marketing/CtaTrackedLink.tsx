"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics/track";

interface CtaTrackedLinkProps {
  href: string;
  className?: string;
  /** Plausible event name; defaults to "CTA_Devis". */
  event?: string;
  /** Identifies where the CTA was clicked (e.g. "blog_article", "service_block"). */
  source: string;
  children: ReactNode;
}

/**
 * A Next.js Link that fires a Plausible event on click without blocking navigation.
 * Kept intentionally minimal so it can live inside Server Component CTA blocks.
 */
export function CtaTrackedLink({
  href,
  className,
  event = "CTA_Devis",
  source,
  children,
}: CtaTrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, { source })}
    >
      {children}
    </Link>
  );
}
