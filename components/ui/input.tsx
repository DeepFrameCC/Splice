import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* `default` = input dark existant (inchangé, compat pages actuelles).
   `swiss`   = input thème clair (surface blanche, bordure line-strong,
   placeholder muted AA, focus ring brand-ink). */
const inputVariants = cva(
  "flex h-10 w-full px-4 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-xl border-2 border-white/[0.08] bg-df-surface text-white ring-offset-df-night placeholder:text-white/30 focus-visible:border-df-blue focus-visible:ring-1 focus-visible:ring-df-blue/20",
        swiss:
          "rounded-swiss-md border border-line-strong bg-surface text-ink placeholder:text-muted focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
