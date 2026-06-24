"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import { Project, getThumbSrc } from "./data";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { safeEncodeUrl } from "@/lib/seo";

interface LightboxProps {
  project: Project;
  startIdx: number;
  onClose: () => void;
  likedIds?: string[];
  isAuthed?: boolean;
  toggleLike?: (mediaId: string) => Promise<{ liked: boolean }>;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Lightbox({
  project,
  startIdx,
  onClose,
  likedIds = [],
  isAuthed = false,
  toggleLike,
}: LightboxProps) {
  const [i, setI] = useState(startIdx || 0);
  const n = project.medias.length;
  const cur = project.medias[i];

  const [likesState, setLikesState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    project.medias.forEach((m) => {
      initial[m.id] = likedIds.includes(m.id);
    });
    return initial;
  });
  const [pending, start] = useTransition();

  const isLiked = cur ? likesState[cur.id] ?? false : false;

  const [aspectRatio, setAspectRatio] = useState<string>("16/9");

  useEffect(() => {
    if (cur) {
      setAspectRatio(cur.type === "video" ? "16/9" : "4/3");
    }
  }, [i, cur]);

  const onLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      toast.error("Connecte-toi pour liker");
      return;
    }
    if (!toggleLike || !cur?.id) return;
    const mediaId = cur.id;
    const wasLiked = isLiked;
    setLikesState((prev) => ({ ...prev, [mediaId]: !wasLiked }));
    start(async () => {
      try {
        const res = await toggleLike(mediaId);
        setLikesState((prev) => ({ ...prev, [mediaId]: res.liked }));
      } catch {
        setLikesState((prev) => ({ ...prev, [mediaId]: wasLiked }));
        toast.error("Erreur");
      }
    });
  };

  const go = useCallback(
    (delta: number) => {
      setI((prev) => {
        const next = prev + delta;
        if (next < 0) return 0;
        if (next > n - 1) return n - 1;
        return next;
      });
    },
    [n]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(+1);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  if (!cur) return null;

  const stageSrc = getThumbSrc(cur);
  const bgClass = `pj-g${cur.g ?? 0}`;

  return (
    <div
      className="pj-lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Projet : ${project.title}`}
    >
      {/* Header bar */}
      <div className="pj-lb-head">
        <div className="meta-l">
          <h3>{project.title}</h3>
          <span className="client">
            {project.client} · {project.year}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onLike}
            disabled={pending}
            aria-label={isLiked ? "Retirer le like" : "Liker"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-[#F36B1F] text-[#F36B1F]" : "text-white/70"}`} />
          </button>
          <button
            className="pj-lb-close"
            onClick={onClose}
            aria-label="Fermer"
            style={{ margin: 0 }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Slide stage */}
      <div className="pj-lb-stage">
        <div className="pj-lb-frame" style={{ aspectRatio }}>
          {!stageSrc && cur.type !== "video" ? (
            <div className={`pj-slide-bg ${bgClass}`} />
          ) : cur.type === "video" ? (
            <video
              src={safeEncodeUrl(cur.url)}
              poster={safeEncodeUrl(cur.thumbnailUrl) ?? undefined}
              controls
              autoPlay
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                if (video.videoWidth && video.videoHeight) {
                  setAspectRatio(`${video.videoWidth}/${video.videoHeight}`);
                }
              }}
              className="absolute inset-0 w-full h-full object-contain bg-[#090918]"
            />
          ) : (
            <Image
              src={stageSrc!}
              alt={cur.caption || project.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  setAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`);
                }
              }}
              className="object-contain"
              priority
            />
          )}

          <div className="pj-corners" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>

          {cur.caption && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                // Lift the caption above the native video control bar so it never
                // covers the volume / timeline / fullscreen controls.
                bottom: cur.type === "video" ? 56 : 0,
                padding: "32px 24px 16px",
                background: "linear-gradient(to top, rgba(0,0,0,.7), transparent)",
                color: "#fff",
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: 14,
                letterSpacing: "-0.005em",
                zIndex: 2,
                // Decorative overlay — never intercept clicks meant for the
                // video controls underneath.
                pointerEvents: "none",
              }}
            >
              {cur.caption}
            </div>
          )}
        </div>

        {/* Side navigation arrows */}
        {n > 1 && (
          <>
            <button
              className="pj-lb-nav prev"
              onClick={() => go(-1)}
              disabled={i === 0}
              aria-label="Précédent"
            >
              <ChevronLeft />
            </button>
            <button
              className="pj-lb-nav next"
              onClick={() => go(+1)}
              disabled={i === n - 1}
              aria-label="Suivant"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Footer bar */}
      <div className="pj-lb-foot">
        <span>
          {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>

        {n > 1 && (
          <div className="pj-lb-thumbs" role="tablist" aria-label="Vignettes">
            {project.medias.map((m, idx) => {
              const thumbSrc = getThumbSrc(m);
              const thumbBgClass = `pj-g${m.g ?? 0}`;
              return (
                <button
                  key={m.id || idx}
                  type="button"
                  className={`pj-lb-thumb ${idx === i ? "on" : ""}`}
                  onClick={() => setI(idx)}
                  aria-label={`Voir le média ${idx + 1}`}
                >
                  {!thumbSrc ? (
                    <div className={`pj-lb-thumb-bg ${thumbBgClass}`} />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={thumbSrc}
                        alt={`Média ${idx + 1}`}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
        <span style={{ textTransform: "uppercase" }}>
          {cur.type === "video" ? "Vidéo" : "Photo"}
        </span>
      </div>
    </div>
  );
}
