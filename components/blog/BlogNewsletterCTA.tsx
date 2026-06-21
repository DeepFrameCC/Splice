"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function BlogNewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — no backend yet
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-df-surface p-8 ring-1 ring-white/[0.08] md:p-10">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-df-gold">
        L&apos;Écho Créatif
      </p>
      <h2 className="font-sans text-2xl font-medium tracking-tight text-white md:text-[26px] leading-tight">
        Recevez nos guides production, un par mois.
      </h2>
      <p className="mt-2 max-w-lg text-white/60 leading-relaxed">
        Conseils tournage, montage et stratégie sociale. Zéro spam, désabonnement en un clic.
      </p>

      {status === "success" ? (
        <p className="mt-6 font-medium text-df-glauque-mid">
          Merci ! Vous êtes inscrit. 🎬
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex max-w-md gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 rounded-full border border-white/[0.08] bg-df-ink px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:ring-2 focus:ring-white/[0.08]"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-df-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-df-blue/90"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">S&apos;inscrire</span>
          </button>
        </form>
      )}
    </section>
  );
}
