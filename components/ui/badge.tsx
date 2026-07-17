import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-df-gold focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-df-blue text-white",
        secondary: "bg-df-surface text-white",
        gold: "bg-df-gold/20 text-df-gold",
        destructive: "bg-red-500/15 text-red-400",
        success: "bg-emerald-500/15 text-emerald-400",
        outline: "border border-white/20 text-white",
        /* ── Variants "Swiss minimal" (thème clair) — textes -ink AA sur tints ── */
        swiss: "border border-line bg-surface-2 text-ink",
        "swiss-brand": "bg-brand-soft text-brand-ink",
        "swiss-success": "bg-success/10 text-success-ink",
        "swiss-warning": "bg-warning/10 text-warning-ink",
        "swiss-danger": "bg-danger/10 text-danger-ink",
        "swiss-outline": "border border-line-strong text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
