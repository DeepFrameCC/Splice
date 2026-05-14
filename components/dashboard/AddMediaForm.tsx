"use client";

import { useState, useTransition } from "react";
import { Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { createMedia } from "@/app/actions/admin-medias";

export default function AddMediaForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const data = {
      type: fd.get("type") as "PHOTO" | "VIDEO",
      url: (fd.get("url") as string).trim(),
      thumbnailUrl: (fd.get("thumbnailUrl") as string).trim() || undefined,
      title: (fd.get("title") as string).trim(),
      description: (fd.get("description") as string).trim() || undefined,
      category: (fd.get("category") as string).trim() || undefined,
      client: (fd.get("client") as string).trim() || undefined,
      owner: fd.get("owner") as "PAPI" | "LOUISIA" | "TY",
      prixEstime: Number(fd.get("prixEstime")) || 0,
      published: fd.get("published") === "on",
    };

    if (!data.url || !data.title) {
      toast.error("URL et titre sont obligatoires");
      return;
    }

    startTransition(async () => {
      try {
        await createMedia(data);
        toast.success("Média ajouté !");
        form.reset();
        setOpen(false);
      } catch (err: any) {
        toast.error(err?.message ?? "Erreur lors de l'ajout");
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-df-blue px-4 py-2.5 text-sm font-bold text-white transition hover:bg-df-blue/90"
      >
        <Plus className="h-4 w-4" />
        Ajouter un média
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-df-ink">Ajouter un média</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1 text-df-ink/40 hover:bg-df-ink/5 hover:text-df-ink"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-df-ink">Titre *</span>
          <input
            name="title"
            type="text"
            required
            placeholder="Ex: Porsche 911 — Session photo"
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-df-ink">Type *</span>
          <select
            name="type"
            required
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          >
            <option value="VIDEO">Vidéo</option>
            <option value="PHOTO">Photo</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-df-ink">Propriétaire *</span>
          <select
            name="owner"
            required
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          >
            <option value="PAPI">Papi</option>
            <option value="LOUISIA">Louisia</option>
            <option value="TY">Ty</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-df-ink">URL du média *</span>
          <input
            name="url"
            type="url"
            required
            placeholder="https://exemple.com/video.mp4 ou /videos/mon-fichier.mp4"
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
          <p className="mt-1 text-xs text-df-ink/40">
            URL directe vers le fichier vidéo/photo (hébergé sur R2, S3, ou dans /public)
          </p>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-df-ink">URL de la miniature</span>
          <input
            name="thumbnailUrl"
            type="url"
            placeholder="https://exemple.com/thumb.jpg (optionnel)"
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-df-ink">Catégorie</span>
          <select
            name="category"
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          >
            <option value="">— Aucune —</option>
            <option value="automobile">Automobile</option>
            <option value="film-marque">Film de marque</option>
            <option value="reseaux-sociaux">Réseaux sociaux</option>
            <option value="evenementiel">Événementiel</option>
            <option value="produit">Produit</option>
            <option value="portrait">Portrait</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="evenement">Événement</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-df-ink">Client</span>
          <input
            name="client"
            type="text"
            placeholder="Nom du client"
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-df-ink">Prix estimé (€)</span>
          <input
            name="prixEstime"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-df-ink">Description</span>
          <textarea
            name="description"
            rows={2}
            placeholder="Description optionnelle"
            className="mt-1 w-full rounded-xl border-2 border-df-blue/20 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label className="flex items-center gap-3">
          <input
            name="published"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 accent-df-blue"
          />
          <span className="text-sm font-bold text-df-ink">Publier immédiatement</span>
        </label>

        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-df-blue/20 px-4 py-2 text-sm font-bold text-df-ink transition hover:bg-df-cream"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-df-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-df-blue/90 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {pending ? "Ajout en cours…" : "Ajouter le média"}
          </button>
        </div>
      </form>
    </div>
  );
}
