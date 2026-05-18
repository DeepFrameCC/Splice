import { MapPin } from "lucide-react";

interface Props {
  text: string;
  serviceName: string;
}

export function ServiceZone({ text, serviceName }: Props) {
  if (!text) return null;

  return (
    <section id="zone" aria-labelledby="zone-h2" className="mt-16 scroll-mt-24">
      <h2
        id="zone-h2"
        className="font-display text-2xl font-bold text-white"
      >
        Zone d&apos;intervention
      </h2>

      <div className="mt-8 flex items-start gap-4 rounded-xl border border-white/[0.08] bg-white/[0.04] p-6">
        <MapPin
          className="mt-0.5 h-5 w-5 shrink-0 text-df-gold"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-white/70">{text}</p>
      </div>
    </section>
  );
}
