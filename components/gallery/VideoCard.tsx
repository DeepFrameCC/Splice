"use client";
import { Heart, Lock, Play } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
type Props = {
  id: string;
  src: string;
  thumbnail: string;
  preview?: string;
  title: string;
  ownerHandle: string;
  prixEstime?: number;
  materiel?: string[];
  monteur?: string | null;
  liked: boolean;
  isAuthed: boolean;
  toggleLike: (mediaId: string) => Promise<{ liked: boolean }>;
};

export default function VideoCard({ id, src, thumbnail, preview, title, ownerHandle, prixEstime, materiel, monteur, liked, isAuthed, toggleLike }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [pending, start] = useTransition();
  const [reveal, setReveal] = useState(false);

  const onEnter = () => { ref.current?.play().catch(() => {}); };
  const onLeave = () => { if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; } };

  const onLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthed) { toast.error("Connecte-toi pour liker et voir le détail"); return; }
    setOptimisticLiked((p) => !p);
    setReveal(true);
    start(async () => {
      try { const r = await toggleLike(id); setOptimisticLiked(r.liked); }
      catch { setOptimisticLiked((p) => !p); toast.error("Erreur"); }
    });
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-df-blue/10 transition-transform duration-300 ease-out hover:scale-105"
    >
      <Link href={`/videos/${id}`} className="block">
        <video
          ref={ref}
          poster={thumbnail}
          src={preview ?? src}
          muted
          playsInline
          loop
          preload="metadata"
          className="aspect-[9/16] w-full object-cover"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-100 transition group-hover:opacity-0">
          <Play className="h-14 w-14 text-white drop-shadow-lg" />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white">
          <p className="font-display italic text-df-gold text-sm">{ownerHandle}</p>
          <h3 className="text-sm font-bold">{title}</h3>
          {reveal && isAuthed && (
            <div className="mt-2 space-y-1 text-xs">
              {prixEstime && <p>Estimation : <span className="font-bold text-df-gold">{prixEstime} €</span></p>}
              {monteur && <p>Monté par {monteur}</p>}
              {materiel && materiel.length > 0 && <p className="opacity-80">{materiel.join(", ")}</p>}
            </div>
          )}
        </div>
      </Link>
      <button onClick={onLike} disabled={pending} aria-label={optimisticLiked ? "Retirer le like" : "Liker"}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110">
        {isAuthed ? <Heart className={`h-5 w-5 ${optimisticLiked ? "fill-df-gold text-df-gold" : "text-df-blue"}`} /> : <Lock className="h-4 w-4 text-df-blue" />}
      </button>
    </div>
  );
}
