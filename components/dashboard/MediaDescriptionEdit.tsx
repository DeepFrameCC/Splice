"use client";

import { useState, useRef, useTransition } from "react";
import { Pencil, Check, X } from "lucide-react";
import { updateMediaDescription } from "@/app/actions/admin-medias";
import toast from "react-hot-toast";

interface MediaDescriptionEditProps {
  mediaId: string;
  description: string | null;
}

export default function MediaDescriptionEdit({ mediaId, description }: MediaDescriptionEditProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(description ?? "");
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    start(async () => {
      try {
        await updateMediaDescription(mediaId, value.trim() || null);
        setEditing(false);
        toast.success("Description mise à jour");
      } catch {
        toast.error("Erreur lors de la mise à jour");
      }
    });
  };

  const handleCancel = () => {
    setValue(description ?? "");
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setEditing(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="group mt-1.5 flex w-full items-start gap-1.5 rounded-lg px-2 py-1 text-left text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white/70"
        title="Modifier la description"
      >
        <Pencil className="mt-0.5 h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition" />
        <span className="line-clamp-2">
          {description || "Ajouter une description…"}
        </span>
      </button>
    );
  }

  return (
    <div className="mt-1.5 space-y-1.5">
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Description du média (apparaît comme caption en galerie)…"
        maxLength={1000}
        rows={2}
        className="w-full resize-none rounded-lg border border-white/[0.12] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-df-gold/50 focus:outline-none focus:ring-1 focus:ring-df-gold/30 transition"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
          }
          if (e.key === "Escape") handleCancel();
        }}
      />
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="inline-flex items-center gap-1 rounded-md bg-df-gold/20 px-2 py-0.5 text-[10px] font-bold text-df-gold transition hover:bg-df-gold/30 disabled:opacity-50"
        >
          <Check className="h-3 w-3" />
          {pending ? "…" : "OK"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={pending}
          className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 disabled:opacity-50"
        >
          <X className="h-3 w-3" />
          Annuler
        </button>
        <span className="ml-auto text-[9px] text-white/20">{value.length}/1000</span>
      </div>
    </div>
  );
}
