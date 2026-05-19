import { Check } from "lucide-react";

interface DeliverableItem {
  label: string;
  detail?: string;
}

interface Props {
  items: DeliverableItem[];
}

export function ServiceDeliverables({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section id="livrables" aria-labelledby="livrables-h2" className="mt-16 scroll-mt-24">
      <h2
        id="livrables-h2"
        className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
      >
        Ce que vous recevez
      </h2>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4"
          >
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-df-gold/10">
              <Check className="h-3.5 w-3.5 text-df-gold" />
            </span>

            <div>
              <p className="text-sm font-bold text-white">{item.label}</p>
              {item.detail && (
                <p className="mt-1 text-xs text-white/50">{item.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
