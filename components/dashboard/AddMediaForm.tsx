"use client";

import { useState, useTransition } from "react";
import { Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { createMedia } from "@/app/actions/admin-medias";

interface AddMediaFormProps {
  groups?: string[];
}

export default function AddMediaForm({ groups = [] }: AddMediaFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [groupMode, setGroupMode] = useState<"none" | "existing" | "new">("none");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const rawGroupKey = groupMode === "existing"
      ? (fd.get("groupKeyExisting") as string).trim()
      : groupMode === "new"
        ? (fd.get("groupKeyNew") as string).trim()
        : "";
    const rawGroupOrder = fd.get("groupOrder") as string;

    const data = {
      type: fd.get("type") as "PHOTO" | "VIDEO",
      url: (fd.get("url") as string).trim(),
      thumbnailUrl: (fd.get("thumbnailUrl") as string).trim() || undefined,
      title: (fd.get("title") as string).trim(),
      description: (fd.get("description") as string).trim() || undefined,
      category: (fd.get("category") as string).trim() || undefined,
      client: (fd.get("client") as string).trim() || undefined,
      owner: fd.get("owner") as "LOUISIA" | "TY",
      prixEstime: Number(fd.get("prixEstime")) || 0,
      published: fd.get("published") === "on",
      groupKey: rawGroupKey || undefined,
      groupOrder: rawGroupKey && rawGroupOrder !== "" ? Number(rawGroupOrder) : undefined,
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
        setGroupMode("none");
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
    <div className="rounded-2xl bg-df-surface p-6 shadow-sm ring-1 ring-white/[0.08]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-white">Ajouter un média</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1 text-white/30 hover:bg-white/5 hover:text-white"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-white">Titre *</span>
          <input
            name="title"
            type="text"
            required
            placeholder="Ex: Porsche 911 — Session photo"
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-white">Type *</span>
          <select
            name="type"
            required
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          >
            <option value="VIDEO">Vidéo</option>
            <option value="PHOTO">Photo</option>
          </select>
        </label>

        <label>
          <span className="text-sm font-bold text-white">Propriétaire *</span>
          <select
            name="owner"
            required
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          >
            <option value="LOUISIA">Louisia</option>
            <option value="TY">Ty</option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-white">URL du média *</span>
          <input
            name="url"
            type="url"
            required
            placeholder="https://exemple.com/video.mp4 ou /videos/mon-fichier.mp4"
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
          <p className="mt-1 text-xs text-white/30">
            URL directe vers le fichier vidéo/photo (hébergé sur R2, S3, ou dans /public)
          </p>
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-white">URL de la miniature</span>
          <input
            name="thumbnailUrl"
            type="url"
            placeholder="https://exemple.com/thumb.jpg (optionnel)"
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-white">Catégorie</span>
          <select
            name="category"
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
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
          <span className="text-sm font-bold text-white">Client</span>
          <input
            name="client"
            type="text"
            placeholder="Nom du client"
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-white">Prix estimé (€)</span>
          <input
            name="prixEstime"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-white">Description</span>
          <textarea
            name="description"
            rows={2}
            placeholder="Description optionnelle"
            className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
          />
        </label>

        {/* Group / Carousel */}
        <div className="sm:col-span-2 space-y-2">
          <span className="text-sm font-bold text-white">Groupe (carrousel)</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-sm text-white/60">
              <input type="radio" name="groupModeRadio" checked={groupMode === "none"} onChange={() => setGroupMode("none")} className="accent-df-blue" />
              Aucun
            </label>
            {groups.length > 0 && (
              <label className="flex items-center gap-1.5 text-sm text-white/60">
                <input type="radio" name="groupModeRadio" checked={groupMode === "existing"} onChange={() => setGroupMode("existing")} className="accent-df-blue" />
                Existant
              </label>
            )}
            <label className="flex items-center gap-1.5 text-sm text-white/60">
              <input type="radio" name="groupModeRadio" checked={groupMode === "new"} onChange={() => setGroupMode("new")} className="accent-df-blue" />
              Nouveau
            </label>
          </div>
          {groupMode === "existing" && (
            <select
              name="groupKeyExisting"
              className="w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
            >
              {groups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}
          {groupMode === "new" && (
            <input
              name="groupKeyNew"
              type="text"
              placeholder="Ex: lowrider, mariage-dupont"
              className="w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
            />
          )}
          {groupMode !== "none" && (
            <label>
              <span className="text-xs text-white/40">Ordre dans le groupe (0 = 1re slide)</span>
              <input
                name="groupOrder"
                type="number"
                min={0}
                defaultValue={0}
                className="mt-1 w-full rounded-xl border-2 border-white/10 px-3 py-2 text-sm outline-none focus:border-df-blue"
              />
            </label>
          )}
        </div>

        <label className="flex items-center gap-3">
          <input
            name="published"
            type="checkbox"
            defaultChecked
            className="h-5 w-5 accent-df-blue"
          />
          <span className="text-sm font-bold text-white">Publier immédiatement</span>
        </label>

        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/5"
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
