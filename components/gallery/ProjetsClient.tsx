"use client";

import { useState, useMemo, useCallback } from "react";
import { Heart, Lock, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import toast from "react-hot-toast";

/* ── Types ──────────────────────────────────────────────────────── */

interface MediaItem {
  id: string;
  type: "PHOTO" | "VIDEO";
  url: string;
  thumbnailUrl: string | null;
  title: string;
  category: string | null;
  client: string | null;
  duration: string | null;
  createdAt: string;
}

interface ProjetsClientProps {
  medias: MediaItem[];
  likedIds: string[];
  isAuthed: boolean;
  toggleLike: (mediaId: string) => Promise<{ liked: boolean }>;
}

/* ── Filters config ─────────────────────────────────────────────── */

const VIDEO_FILTERS = [
  { id: "all", label: "Tous" },
  { id: "automobile", label: "Automobile" },
  { id: "film-marque", label: "Films de marque" },
  { id: "reseaux-sociaux", label: "Réseaux sociaux" },
  { id: "evenementiel", label: "Événementiel" },
];

const PHOTO_FILTERS = [
  { id: "all", label: "Tous" },
  { id: "automobile", label: "Automobile" },
  { id: "produit", label: "Produit" },
  { id: "portrait", label: "Portrait" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "evenement", label: "Événement" },
];

/* ── Gradient backgrounds (when no thumbnail) ───────────────────── */

const GRADIENTS = [
  "radial-gradient(ellipse at 70% 30%, rgba(255,189,89,.4), transparent 60%), linear-gradient(135deg, #1901AD 0%, #2E1B7A 60%, #0A0A23 100%)",
  "radial-gradient(ellipse at 20% 80%, rgba(25,1,173,.45), transparent 65%), linear-gradient(160deg, #F2D8A8 0%, #C8956D 60%, #5C3A1F 100%)",
  "radial-gradient(ellipse at 50% 50%, rgba(255,189,89,.35), transparent 60%), linear-gradient(210deg, #0A0A23 0%, #1901AD 100%)",
  "linear-gradient(135deg, #FFBD59 0%, #FF7B00 60%, #B8501D 100%)",
  "radial-gradient(ellipse at 80% 20%, rgba(255,189,89,.6), transparent 55%), linear-gradient(160deg, #1F0B5C 0%, #0A0A23 100%)",
  "linear-gradient(160deg, #2A1F12 0%, #6E4422 50%, #B57B3F 100%)",
];

/* ── Category label map ─────────────────────────────────────────── */

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

/* ── ProjectCard ────────────────────────────────────────────────── */

function ProjectCard({
  media,
  index,
  isPhoto,
  liked,
  isAuthed,
  toggleLike,
  onOpen,
}: {
  media: MediaItem;
  index: number;
  isPhoto: boolean;
  liked: boolean;
  isAuthed: boolean;
  toggleLike: (mediaId: string) => Promise<{ liked: boolean }>;
  onOpen: (media: MediaItem) => void;
}) {
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [pending, start] = useTransition();
  const year = new Date(media.createdAt).getFullYear();
  const gradientIdx = index % GRADIENTS.length;
  const hasThumb = !!media.thumbnailUrl;
  const categoryLabel = media.category
    ? CATEGORY_LABELS[media.category] ?? media.category
    : null;

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
        const r = await toggleLike(media.id);
        setOptimisticLiked(r.liked);
      } catch {
        setOptimisticLiked((p) => !p);
        toast.error("Erreur");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(media);
    }
  };

  return (
    <div
      className="pj-card"
      data-anim="project"
      onClick={() => onOpen(media)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir ${media.title}`}
    >
      {/* Thumbnail */}
      <div
        className="pj-thumb"
        style={hasThumb ? undefined : { background: GRADIENTS[gradientIdx] }}
      >
        {hasThumb && (
          <Image
            src={media.thumbnailUrl!}
            alt={media.title}
            fill
            sizes="(max-width: 920px) 50vw, 33vw"
            className="object-cover"
          />
        )}

        {/* Corner brackets */}
        <div className="pj-corners" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        {/* Medium badge */}
        <span className="pj-medium">{isPhoto ? "PHOTO" : "VIDÉO"}</span>

        {/* Timecode (video only) */}
        {!isPhoto && media.duration && (
          <span className="pj-tc">TC {media.duration}</span>
        )}

        {/* Play / expand button */}
        <div className="pj-play">{isPhoto ? "↗" : "▶"}</div>

        {/* Like button */}
        <button
          onClick={onLike}
          disabled={pending}
          aria-label={optimisticLiked ? "Retirer le like" : "Liker"}
          className="pj-like"
        >
          {isAuthed ? (
            <Heart
              className={`h-4 w-4 ${
                optimisticLiked ? "fill-[#FFBD59] text-[#FFBD59]" : "text-white"
              }`}
            />
          ) : (
            <Lock className="h-3.5 w-3.5 text-white" />
          )}
        </button>
      </div>

      {/* Card body */}
      <div className="pj-body">
        <span className="pj-tag">
          {categoryLabel ? `${categoryLabel} · ${year}` : String(year)}
        </span>
        <h3>{media.title}</h3>
        {media.client && <span className="pj-client">{media.client}</span>}
      </div>
    </div>
  );
}

/* ── Main Client Component ──────────────────────────────────────── */

export default function ProjetsClient({
  medias,
  likedIds,
  isAuthed,
  toggleLike,
}: ProjetsClientProps) {
  const [tab, setTab] = useState<"video" | "photo">("video");
  const [filter, setFilter] = useState("all");
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const likedSet = useMemo(() => new Set(likedIds), [likedIds]);

  const openMedia = useCallback((media: MediaItem) => setActiveMedia(media), []);
  const closeMedia = useCallback(() => setActiveMedia(null), []);

  const isPhoto = tab === "photo";
  const filters = isPhoto ? PHOTO_FILTERS : VIDEO_FILTERS;

  const videoCount = medias.filter((m) => m.type === "VIDEO").length;
  const photoCount = medias.filter((m) => m.type === "PHOTO").length;

  const filtered = useMemo(() => {
    const typeFilter = isPhoto ? "PHOTO" : "VIDEO";
    return medias
      .filter((m) => m.type === typeFilter)
      .filter((m) => filter === "all" || m.category === filter);
  }, [medias, isPhoto, filter]);

  // Navigation in lightbox
  const currentIndex = activeMedia
    ? filtered.findIndex((m) => m.id === activeMedia.id)
    : -1;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < filtered.length - 1;

  const goPrev = useCallback(() => {
    if (canPrev) setActiveMedia(filtered[currentIndex - 1] ?? null);
  }, [canPrev, currentIndex, filtered]);

  const goNext = useCallback(() => {
    if (canNext) setActiveMedia(filtered[currentIndex + 1] ?? null);
  }, [canNext, currentIndex, filtered]);

  // Keyboard navigation in modal
  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeMedia();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [closeMedia, goPrev, goNext]
  );

  const switchTab = (t: "video" | "photo") => {
    setTab(t);
    setFilter("all");
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="pj-hero">
        <div className="pj-eyebrow" data-anim="eyebrow">Portfolio</div>
        <h1 data-anim="hero-title">
          Ce qu&apos;on a tourné,
          <br />
          <em>ce qu&apos;on a shooté</em>.
        </h1>
        <p data-anim="hero-meta">
          Un échantillon de nos productions récentes. Filmer une voiture au
          crépuscule, raconter une marque, capter un événement, signer un
          portrait — pour chaque projet, une intention claire.
        </p>
      </section>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <div className="pj-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "video"}
          className={`pj-tab ${tab === "video" ? "on" : ""}`}
          onClick={() => switchTab("video")}
        >
          Vidéo <em>{videoCount}</em>
        </button>
        <button
          role="tab"
          aria-selected={tab === "photo"}
          className={`pj-tab ${tab === "photo" ? "on" : ""}`}
          onClick={() => switchTab("photo")}
        >
          Photo <em>{photoCount}</em>
        </button>
      </div>

      {/* ── Filter chips ──────────────────────────────────────────── */}
      <div className="pj-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`pj-chip ${filter === f.id ? "on" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Grid ──────────────────────────────────────────────────── */}
      <div className={`pj-grid ${isPhoto ? "is-photo" : ""}`}>
        {filtered.length === 0 ? (
          <div className="pj-empty">
            Aucun projet ne correspond à ce filtre.
          </div>
        ) : (
          filtered.map((m, i) => (
            <ProjectCard
              key={m.id}
              media={m}
              index={i}
              isPhoto={isPhoto}
              liked={likedSet.has(m.id)}
              isAuthed={isAuthed}
              toggleLike={toggleLike}
              onOpen={openMedia}
            />
          ))
        )}
      </div>

      {/* ── CTA vers devis ────────────────────────────────────────── */}
      <div className="pj-cta-section">
        <p className="pj-cta-text">Un projet en tête ? On en discute.</p>
        <Link href="/devis" className="pj-cta-btn">
          Demander un devis →
        </Link>
      </div>

      {/* ── Media modal (photos + videos) ─────────────────────────── */}
      {activeMedia && (
        <div
          className="pj-modal-overlay"
          onClick={closeMedia}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={activeMedia.title}
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <div
            className="pj-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="pj-modal-close"
              onClick={closeMedia}
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Navigation arrows */}
            {canPrev && (
              <button
                className="pj-modal-nav pj-modal-prev"
                onClick={goPrev}
                aria-label="Précédent"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {canNext && (
              <button
                className="pj-modal-nav pj-modal-next"
                onClick={goNext}
                aria-label="Suivant"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Media content */}
            {activeMedia.type === "VIDEO" ? (
              <video
                src={activeMedia.url}
                poster={activeMedia.thumbnailUrl ?? undefined}
                controls
                autoPlay
                className="pj-modal-video"
              />
            ) : (
              <div className="pj-modal-photo">
                <Image
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  fill
                  sizes="(max-width: 768px) 95vw, 900px"
                  className="object-contain"
                  priority
                />
              </div>
            )}

            <div className="pj-modal-info">
              <span className="pj-tag">
                {activeMedia.category
                  ? `${CATEGORY_LABELS[activeMedia.category] ?? activeMedia.category} · ${new Date(activeMedia.createdAt).getFullYear()}`
                  : String(new Date(activeMedia.createdAt).getFullYear())}
              </span>
              <h3>{activeMedia.title}</h3>
              {activeMedia.client && (
                <span className="pj-client">{activeMedia.client}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
