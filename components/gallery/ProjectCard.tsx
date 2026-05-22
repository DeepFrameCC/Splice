"use client";

import { Heart, Lock, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface ProjectCardProps {
  id: string;
  type: "PHOTO" | "VIDEO";
  src: string;
  thumbnailUrl?: string | null;
  title: string;
  category?: string | null;
  client?: string | null;
  duration?: string | null;
  createdAt: string;
  liked: boolean;
  isAuthed: boolean;
  toggleLike: (mediaId: string) => Promise<{ liked: boolean }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  automobile: "Automobile",
  "film-marque": "Films de marque",
  "reseaux-sociaux": "Réseaux sociaux",
  evenementiel: "Événementiel",
  produit: "Produit",
  portrait: "Portrait",
  lifestyle: "Lifestyle",
  evenement: "Événement",
};

export default function ProjectCard({
  id,
  type,
  src,
  thumbnailUrl,
  title,
  category,
  client,
  duration,
  createdAt,
  liked,
  isAuthed,
  toggleLike,
}: ProjectCardProps) {
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [pending, start] = useTransition();
  const year = new Date(createdAt).getFullYear();
  const isVideo = type === "VIDEO";
  const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : null;
  const imageSrc = thumbnailUrl || src;

  const onLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      toast.error("Connecte-toi pour liker");
      return;
    }
    setOptimisticLiked((p) => !p);
    start(async () => {
      try {
        const r = await toggleLike(id);
        setOptimisticLiked(r.liked);
      } catch {
        setOptimisticLiked((p) => !p);
        toast.error("Erreur");
      }
    });
  };

  const card = (
    <article
      data-anim="project"
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.06] transition-all duration-300 hover:shadow-lg hover:scale-[1.03]"
    >
      {/* ── Thumbnail area (4:3) ────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Corner brackets */}
        <div aria-hidden="true">
          <i className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-white/40" />
          <i className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-white/40" />
          <i className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-white/40" />
          <i className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-white/40" />
        </div>

        {/* Badge medium (Vidéo / Photo) */}
        <span className="absolute left-3.5 top-3.5 z-[2] rounded-full bg-df-gold px-3 py-1 text-[11px] font-bold text-white">
          {isVideo ? "Vidéo" : "Photo"}
        </span>

        {/* Like button */}
        <button
          onClick={onLike}
          disabled={pending}
          aria-label={optimisticLiked ? "Retirer le like" : "Liker"}
          className="absolute right-3.5 top-3.5 z-[2] grid h-9 w-9 place-items-center rounded-full bg-df-night/90 backdrop-blur-sm transition hover:scale-110"
        >
          {isAuthed ? (
            <Heart
              className={`h-4 w-4 ${
                optimisticLiked
                  ? "fill-df-gold text-df-gold"
                  : "text-white/40"
              }`}
            />
          ) : (
            <Lock className="h-3.5 w-3.5 text-white/40" />
          )}
        </button>

        {/* Timecode (video only) */}
        {isVideo && duration && (
          <span
            className="absolute bottom-3.5 right-3.5 z-[2] rounded px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-sm"
            style={{
              fontFamily: "var(--font-sans)",
              background: "rgba(0,0,0,.5)",
            }}
          >
            {duration}
          </span>
        )}

        {/* Play button overlay (video only, on hover) */}
        {isVideo && (
          <div className="absolute inset-0 z-[1] grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-df-night/90 backdrop-blur-sm shadow-lg">
              <Play className="h-6 w-6 text-white ml-0.5" fill="currentColor" />
            </div>
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-1.5 p-4 pt-3">
        {/* Category · Year tag */}
        <span
          className="text-[11px] uppercase tracking-widest text-white/50"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {categoryLabel ? `${categoryLabel} · ${year}` : String(year)}
        </span>

        {/* Title */}
        <h3 className="font-display text-base font-bold leading-tight text-white line-clamp-2">
          {title}
        </h3>

        {/* Client */}
        {client && (
          <p className="text-sm text-white/45">{client}</p>
        )}
      </div>
    </article>
  );

  if (isVideo) {
    return (
      <Link href={`/videos/${id}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
