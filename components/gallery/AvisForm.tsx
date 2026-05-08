"use client";
import { useState, useTransition } from "react";
import { Star, Send } from "lucide-react";
import { submitAvis } from "@/app/actions/avis";
import toast from "react-hot-toast";

export default function AvisForm() {
  const [note, setNote] = useState(5);
  const [hover, setHover] = useState(0);
  const [nom, setNom] = useState("");
  const [contenu, setContenu] = useState("");
  const [pending, start] = useTransition();
  const [success, setSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !contenu.trim()) { toast.error("Veuillez remplir tous les champs"); return; }
    start(async () => {
      try {
        await submitAvis({ auteurNom: nom.trim(), contenu: contenu.trim(), note });
        setSuccess(true);
        setNom("");
        setContenu("");
        setNote(5);
        toast.success("Merci pour votre avis !");
      } catch (e: any) {
        toast.error(e?.message ?? "Erreur lors de l'envoi");
      }
    });
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl bg-emerald-50 p-8 text-center">
        <p className="font-display text-2xl italic text-emerald-800">Merci pour votre avis ! ✓</p>
        <p className="mt-2 text-sm text-emerald-700">Votre avis sera publié après validation par notre équipe.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-df-blue underline">
          Laisser un autre avis
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg rounded-3xl bg-white p-6 shadow-lg ring-1 ring-df-blue/10">
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setNote(i + 1)}
            className="p-1 transition hover:scale-110"
          >
            <Star className={`h-7 w-7 ${i < (hover || note) ? "fill-df-gold text-df-gold" : "text-df-blue/20"}`} />
          </button>
        ))}
      </div>
      <p className="mt-1 text-center text-xs text-df-blue/60">{note}/5 étoile{note > 1 ? "s" : ""}</p>

      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Votre nom ou celui de votre entreprise"
        required
        className="mt-4 w-full rounded-xl border-2 border-df-blue/15 px-4 py-3 text-sm outline-none transition focus:border-df-blue"
      />

      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Décrivez votre expérience avec Deepframe…"
        required
        rows={4}
        className="mt-3 w-full rounded-xl border-2 border-df-blue/15 px-4 py-3 text-sm outline-none transition focus:border-df-blue"
      />

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-4 w-full disabled:opacity-50"
      >
        {pending ? "Envoi…" : <><Send className="h-4 w-4" /> Envoyer mon avis</>}
      </button>

      <p className="mt-3 text-center text-xs text-df-blue/50">
        Votre avis sera publié après modération.
      </p>
    </form>
  );
}
