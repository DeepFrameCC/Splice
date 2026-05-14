import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border-2 border-df-blue/20 bg-white px-4 py-2 text-sm text-df-ink ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-df-blue/40 focus-visible:outline-none focus-visible:border-df-blue focus-visible:ring-1 focus-visible:ring-df-blue/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
