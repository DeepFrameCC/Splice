import { Founder } from "@prisma/client";
import { FOUNDER_LABEL } from "@/lib/pricing";

const FOUNDER_ROLE: Record<Founder, string> = {
  PAPI: "Videaste / Realisateur",
  LOUISIA: "Photographe",
  TY: "Monteur / Motion Designer",
};

interface Props {
  members: string[];
}

export function ServiceTeam({ members }: Props) {
  if (members.length === 0) return null;

  const validMembers = members.filter(
    (m): m is Founder => m in FOUNDER_ROLE,
  );

  if (validMembers.length === 0) return null;

  return (
    <section id="equipe" aria-labelledby="equipe-h2" className="mt-16 scroll-mt-24">
      <h2
        id="equipe-h2"
        className="font-display text-2xl font-bold text-white"
      >
        L&apos;equipe sur ce projet
      </h2>

      <div className="mt-8 flex flex-wrap gap-4">
        {validMembers.map((code) => {
          const displayName = FOUNDER_LABEL[code];
          const initial = displayName.replace("@", "").charAt(0).toUpperCase();

          return (
            <div
              key={code}
              className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.04] p-5"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-df-gold/10 text-sm font-bold text-df-gold"
                aria-hidden="true"
              >
                {initial}
              </span>

              <div>
                <p className="text-sm font-bold text-white">{displayName}</p>
                <p className="text-xs text-white/40">{FOUNDER_ROLE[code]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
