import { Wrench } from "lucide-react";
import type { EquipmentItem } from "@/lib/services/types";

interface ServiceEquipmentProps {
  items: EquipmentItem[];
}

export function ServiceEquipment({ items }: ServiceEquipmentProps) {
  if (items.length === 0) return null;

  return (
    <section
      id="equipement"
      aria-labelledby="equipement-h2"
      className="mt-16 scroll-mt-24"
    >
      <h2
        id="equipement-h2"
        className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
      >
        {"\u00C9quipement utilis\u00E9"}
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4"
          >
            <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-df-gold" />

            <p className="text-sm leading-snug">
              <span className="font-medium text-white">{item.name}</span>
              {item.detail && (
                <span className="ml-1 text-sm text-white/50">
                  &mdash; {item.detail}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
