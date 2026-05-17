"use client";

import { useTransition } from "react";
import { toggleMediaPublished, deleteMedia } from "@/app/actions/admin-medias";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export function PublishToggle({ mediaId, published }: { mediaId: string; published: boolean }) {
  const [pending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleMediaPublished(mediaId);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur lors du changement de visibilité";
        toast.error(msg);
      }
    });
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleToggle}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
        published
          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
          : "bg-white/5 text-white/30 hover:bg-white/[0.08]"
      } ${pending ? "opacity-50" : ""}`}
      aria-label={published ? "Masquer" : "Publier"}
    >
      {published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {published ? "Publié" : "Masqué"}
    </button>
  );
}

export function DeleteMediaBtn({ mediaId, title }: { mediaId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Supprimer le média "${title}" ? Cette action est irréversible.`)) return;
    startTransition(async () => {
      try {
        await deleteMedia(mediaId);
        toast.success("Média supprimé");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur lors de la suppression";
        toast.error(msg);
      }
    });
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleDelete}
      className={`inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-500/15 ${pending ? "opacity-50" : ""}`}
      aria-label={`Supprimer ${title}`}
    >
      <Trash2 className="h-3 w-3" />
    </button>
  );
}
