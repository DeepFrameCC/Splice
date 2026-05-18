import { Cpu } from "lucide-react";
import type { Equipment } from "@/lib/services/types";

interface Props {
  items: Equipment[];
}

export function ServiceEquipment({ items }: Props) {
  if (!items.length) return null;

  return (
    <section id="equipement" aria-labelledby="equipement-h2" className="mt-16 scroll-mt-24">
      <h2 id="equipement-h2" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Équipement utilisé
      </h2>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-df-gold" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              {item.detail && <p className="mt-1 text-xs text-white/50">{item.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
