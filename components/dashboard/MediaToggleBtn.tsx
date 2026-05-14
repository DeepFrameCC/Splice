"use client";

import { useTransition } from "react";
import { toggleMediaPublished, deleteMedia } from "@/app/actions/admin-medias";
import { Eye, EyeOff, Trash2 } from "lucide-react";

export function PublishToggle({ mediaId, published }: { mediaId: string; published: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleMediaPublished(mediaId))}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
        published
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          : "bg-df-ink/5 text-df-ink/40 hover:bg-df-ink/10"
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

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Supprimer le média "${title}" ? Cette action est irréversible.`)) return;
        startTransition(() => deleteMedia(mediaId));
      }}
      className={`inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 ${pending ? "opacity-50" : ""}`}
      aria-label={`Supprimer ${title}`}
    >
      <Trash2 className="h-3 w-3" />
    </button>
  );
}
