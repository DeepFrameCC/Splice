"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";


const founders = [
  { handle: "@papiforcex", role: "Réalisateur / Vidéaste", bio: "Captation événementielle, brand films, drone.", gradient: "gradient-papi" },
  { handle: "@by.louisia", role: "Photographe", bio: "Portrait, mode, image de marque, retouche soignée.", gradient: "gradient-louisia" },
  { handle: "@t.y97one",  role: "Monteur / Motion designer", bio: "Montage dynamique, motion design, formats réseaux.", gradient: "gradient-ty" }
];

export default function FoundersSlider() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % founders.length);
  const prev = () => setI((p) => (p - 1 + founders.length) % founders.length);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {founders.map((f, idx) => (
        <article
          key={f.handle}
          className={`${f.gradient} card-hover relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${idx === i ? "md:scale-105 md:ring-4 md:ring-df-gold" : "md:scale-95 md:opacity-80"} transition-all duration-500`}
        >
          <div className="grid h-32 w-32 mx-auto place-items-center rounded-full bg-white/15 backdrop-blur-sm">
            <User className="h-16 w-16 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="mt-4 text-center text-2xl font-bold">{f.handle}</h3>
          <p className="mt-1 text-center text-sm opacity-80">{f.role}</p>
          <p className="mt-4 text-center text-sm">{f.bio}</p>
        </article>
      ))}

      <div className="col-span-full flex items-center justify-center gap-3 md:hidden">
        <button onClick={prev} aria-label="Précédent" className="grid h-10 w-10 place-items-center rounded-full bg-df-blue text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-bold text-df-blue">{i + 1} / {founders.length}</span>
        <button onClick={next} aria-label="Suivant" className="grid h-10 w-10 place-items-center rounded-full bg-df-blue text-white">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
