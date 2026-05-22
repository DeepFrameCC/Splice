import type { FAQItem } from "@/lib/services/types";

interface Props {
  items: FAQItem[];
}

export function ServiceFAQ({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8 divide-y divide-white/[0.08]">
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-white transition hover:text-df-gold">
            {item.question}
            <span className="ml-4 shrink-0 text-df-gold/40 transition group-open:rotate-45">+</span>
          </summary>
          <p
            className="mt-3 max-w-3xl leading-relaxed text-white/70"
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </details>
      ))}
    </div>
  );
}
