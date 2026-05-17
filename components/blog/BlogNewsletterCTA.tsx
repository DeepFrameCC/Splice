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
    <section className="rounded-2xl bg-df-surface px-6 py-10 text-center md:px-12 md:py-14">
      <h2 className="font-display text-2xl font-bold italic text-df-blue md:text-3xl">
        Restez informés
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-df-blue/60">
        Recevez nos derniers articles et conseils en production audiovisuelle directement dans votre boîte mail.
      </p>

      {status === "success" ? (
        <p className="mt-6 font-medium text-green-600">
          Merci ! Vous êtes inscrit. 🎬
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 rounded-full border border-white/[0.08] bg-df-surface px-4 py-2.5 text-sm text-df-blue placeholder:text-df-blue/40 outline-none focus:border-df-blue/30 focus:ring-2 focus:ring-white/[0.08]"
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
