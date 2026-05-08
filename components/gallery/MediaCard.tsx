"use client";
import { Heart, Lock } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type Props = {
  id: string;
  src: string;
  title: string;
  ownerHandle: string;
  prixEstime?: number;
  materiel?: string[];
  monteur?: string | null;
  liked: boolean;
  isAuthed: boolean;
  toggleLike: (mediaId: string) => Promise<{ liked: boolean }>;
};

export default function MediaCard({ id, src, title, ownerHandle, prixEstime, materiel, monteur, liked, isAuthed, toggleLike }: Props) {
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [pending, start] = useTransition();
  const [revealInfo, setRevealInfo] = useState(false);

  const onLike = () => {
    if (!isAuthed) { toast.error("Connecte-toi pour liker et voir le prix estimé"); return; }
    setOptimisticLiked((p) => !p);
    setRevealInfo(true);
    start(async () => {
      try {
        const res = await toggleLike(id);
        setOptimisticLiked(res.liked);
      } catch { setOptimisticLiked((p) => !p); toast.error("Erreur"); }
    });
  };

  return (
    <motion.figure
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-df-cream shadow-md ring-1 ring-df-blue/10"
    >
      <Image src={src} alt={title} width={800} height={1000} className="h-auto w-full object-cover transition group-hover:brightness-105" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-df-blue/90 via-df-blue/40 to-transparent p-4 text-white opacity-0 transition group-hover:opacity-100">
        <p className="font-display italic text-df-gold">{ownerHandle}</p>
        <h3 className="text-sm font-bold">{title}</h3>
        {revealInfo && isAuthed && (
          <div className="mt-2 space-y-1 text-xs">
            {prixEstime && <p>Estimation : <span className="font-bold text-df-gold">{prixEstime} €</span></p>}
            {monteur && <p>Monté par {monteur}</p>}
            {materiel && materiel.length > 0 && <p className="opacity-80">Matériel : {materiel.join(", ")}</p>}
          </div>
        )}
      </div>
      <button
        onClick={onLike}
        aria-label={optimisticLiked ? "Retirer le like" : "Liker"}
        disabled={pending}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
      >
        {isAuthed
          ? <Heart className={`h-5 w-5 ${optimisticLiked ? "fill-df-gold text-df-gold" : "text-df-blue"}`} />
          : <Lock className="h-4 w-4 text-df-blue" />}
      </button>
    </motion.figure>
  );
}
