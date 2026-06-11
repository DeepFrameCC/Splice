"use client";

import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { Project, ProjectMedia, CATEGORIES, PROJECTS } from "./data";
import MediaCarousel from "./MediaCarousel";
import Lightbox from "./Lightbox";

interface MediaItem {
  id: string;
  type: "PHOTO" | "VIDEO";
  url: string;
  thumbnailUrl: string | null;
  title: string;
  description?: string | null;
  category: string | null;
  client: string | null;
  duration: string | null;
  createdAt: string;
  groupKey?: string | null;
  groupOrder?: number | null;
}

interface ProjetsClientProps {
  medias: MediaItem[];
  likedIds: string[];
  isAuthed: boolean;
  toggleLike: (mediaId: string) => Promise<{ liked: boolean }>;
  /** Deep-link `?media=<id>` : ouvre la lightbox directement sur ce média. */
  initialMediaId?: string | null;
}

// Map database categories to Projets v2 categories
function mapDbCategoryToPj(dbCat: string | null): string {
  if (!dbCat) return "produit";
  const cat = dbCat.toLowerCase();
  if (cat.includes("auto")) return "auto";
  if (cat.includes("brand") || cat.includes("marque") || cat.includes("corporate")) return "brand";
  if (cat.includes("social") || cat.includes("pub") || cat.includes("clip") || cat.includes("reel")) return "social";
  if (cat.includes("event") || cat.includes("evene") || cat.includes("after")) return "event";
  if (cat.includes("podcast") || cat.includes("interview")) return "podcast";
  return "produit"; // Fallback for portrait, urbain, photo, lifestyle, etc.
}

/* ── Catégorie Icons ───────────────────────────────────────────── */
function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-4 h-4">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-4 h-4">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/* ── Card projet ───────────────────────────────────────────── */
interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project, startIdx: number) => void;
  priority?: boolean;
}

function ProjectCard({ project, onOpen, priority = false }: ProjectCardProps) {
  return (
    <article
      className="pj-card"
      data-anim="project"
      data-cat={project.cat}
    >
      <MediaCarousel
        medias={project.medias}
        projectTitle={project.title}
        onOpenLightbox={(startIdx) => onOpen(project, startIdx)}
        priority={priority}
      />
      <div className="pj-body">
        <div className="pj-tag-row">
          <span>{project.tag}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <span className="pj-client">{project.client}</span>
        <button
          type="button"
          className="pj-cta"
          onClick={() => onOpen(project, 0)}
        >
          Voir le projet
        </button>
      </div>
    </article>
  );
}

/* ── Section catégorie ─────────────────────────────────────── */
interface CategorySectionProps {
  category: typeof CATEGORIES[number];
  projects: Project[];
  onOpen: (project: Project, startIdx: number) => void;
  /** Eagerly load the very first card's first image (LCP candidate). */
  priorityFirst?: boolean;
}

function CategorySection({ category, projects, onOpen, priorityFirst = false }: CategorySectionProps) {
  if (projects.length === 0) return null;
  return (
    <section className="pj-section" aria-labelledby={`sec-${category.id}`}>
      <div className="pj-section-head">
        <div>
          <div className="pj-section-eyebrow">{category.eyebrow}</div>
          <h2 id={`sec-${category.id}`}>
            {category.id === "auto" && <>Shootings <em>automobile</em></>}
            {category.id === "brand" && <>Films de <em>marque</em></>}
            {category.id === "social" && <>Pubs & <em>social</em></>}
            {category.id === "produit" && <>Photo produit <em>& lifestyle</em></>}
            {category.id === "event" && <>Aftermovies <em>& événements</em></>}
            {category.id === "podcast" && <>Podcasts <em>& interviews</em></>}
          </h2>
          <p className="pj-section-sub">{category.sub}</p>
        </div>
        <div className="pj-section-count">
          {projects.length === 1 ? "1 projet" : `${projects.length} projets`}
          <b>{String(projects.length).padStart(2, "0")}</b>
        </div>
      </div>
      <div className="pj-grid">
        {projects.map((p, idx) => (
          <ProjectCard
            key={p.id}
            project={p}
            onOpen={onOpen}
            priority={priorityFirst && idx === 0}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Main ProjetsClient Component ─────────────────────────── */
export default function ProjetsClient({ medias, likedIds, isAuthed, toggleLike, initialMediaId = null }: ProjetsClientProps) {
  const [tab, setTab] = useState<"video" | "photo">("video");
  const [filter, setFilter] = useState("all");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [openIdx, setOpenIdx] = useState(0);
  const deepLinkConsumed = useRef(false);

  // Group database media items by groupKey or create standalones
  const allProjects = useMemo(() => {
    if (!medias || medias.length === 0) {
      // Fallback to static PROJECTS if database gallery is empty
      return PROJECTS;
    }

    const groups: Record<string, MediaItem[]> = {};
    medias.forEach((m) => {
      const key = m.groupKey || `standalone-${m.id}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });

    const parsed: Project[] = [];
    Object.keys(groups).forEach((key) => {
      const items = groups[key];
      if (!items || items.length === 0) return;
      items.sort((a, b) => (a.groupOrder ?? 0) - (b.groupOrder ?? 0));
      const first = items[0];
      if (!first) return;

      const year = new Date(first.createdAt).getFullYear();
      const types = new Set(items.map((m) => m.type));
      let tag = "Photo";
      if (types.has("VIDEO") && types.has("PHOTO")) {
        tag = "Film + photo";
      } else if (types.has("VIDEO")) {
        tag = "Film";
      }

      const client = first.client || "Splice Studio";
      const cat = mapDbCategoryToPj(first.category);

      parsed.push({
        id: key,
        cat,
        title: first.title,
        client,
        year,
        tag,
        medias: items.map((m, idx) => ({
          id: m.id,
          type: m.type === "VIDEO" ? "video" : "photo",
          url: m.url,
          thumbnailUrl: m.thumbnailUrl,
          caption: m.description || m.title,
          g: (idx + key.charCodeAt(0)) % 8, // Premium fallback gradients
          duration: m.duration || undefined,
          tc: m.type === "VIDEO" ? "00:01:10:00" : undefined,
        })),
      });
    });

    return parsed;
  }, [medias]);

  // Project projection: keeps only projects containing current tab media type
  // and filters project's medias array to contain only that tab type
  const projectedProjects = useMemo(() => {
    return allProjects
      .map((p) => {
        const matchingMedias = p.medias.filter((m) => m.type === tab);
        if (matchingMedias.length === 0) return null;
        return { ...p, medias: matchingMedias };
      })
      .filter(Boolean) as Project[];
  }, [allProjects, tab]);

  // Category filter
  const filteredProjects = useMemo(() => {
    if (filter === "all") return projectedProjects;
    return projectedProjects.filter((p) => p.cat === filter);
  }, [projectedProjects, filter]);

  // Group by category to render category sections
  const groupedProjects = useMemo(() => {
    const map = new Map<string, Project[]>();
    CATEGORIES.forEach((c) => map.set(c.id, []));
    filteredProjects.forEach((p) => {
      map.get(p.cat)?.push(p);
    });
    return map;
  }, [filteredProjects]);

  const totalFilteredCount = useMemo(() => {
    let count = 0;
    groupedProjects.forEach((arr) => (count += arr.length));
    return count;
  }, [groupedProjects]);

  // First category that has projects → its first card holds the LCP image.
  const firstCatWithProjects = useMemo(
    () => CATEGORIES.find((c) => (groupedProjects.get(c.id) || []).length > 0)?.id,
    [groupedProjects]
  );

  // Tab counters (projets containing at least 1 video / 1 photo)
  const tabCounts = useMemo(() => {
    return {
      video: allProjects.filter((p) => p.medias.some((m) => m.type === "video")).length,
      photo: allProjects.filter((p) => p.medias.some((m) => m.type === "photo")).length,
    };
  }, [allProjects]);

  // Category counters filtered by active tab type
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projectedProjects.length };
    CATEGORIES.forEach((cat) => {
      c[cat.id] = projectedProjects.filter((p) => p.cat === cat.id).length;
    });
    return c;
  }, [projectedProjects]);

  const switchTab = (t: "video" | "photo") => {
    setTab(t);
    setFilter("all");
  };

  // Deep-link ?media=<id> : bascule sur le bon onglet et ouvre la lightbox
  // sur le média visé (une seule fois, pas après fermeture manuelle).
  useEffect(() => {
    if (!initialMediaId || deepLinkConsumed.current) return;
    for (const p of allProjects) {
      const idx = p.medias.findIndex((m) => m.id === initialMediaId);
      if (idx === -1) continue;
      deepLinkConsumed.current = true;
      setTab(p.medias[idx]!.type === "video" ? "video" : "photo");
      setOpenProject(p);
      setOpenIdx(idx);
      return;
    }
  }, [initialMediaId, allProjects]);

  const handleOpen = (project: Project, idx = 0) => {
    setOpenProject(project);
    setOpenIdx(idx);
  };

  return (
    <div className="df-root">
      {/* Hero */}
      <section className="pj-hero">
        <div>
          <div className="pj-eyebrow" data-anim="eyebrow">Portfolio</div>
          <h1 data-anim="hero-title">
            Ce qu&apos;on a tourné,
            <br />
            <em>ce qu&apos;on a shooté</em>.
          </h1>
          <p data-anim="hero-meta">
            Un échantillon de nos productions récentes. Filmer une voiture au crépuscule, raconter une marque, capter un événement, signer un portrait — pour chaque projet, une intention claire.
          </p>
          <div className="pj-hero-meta" data-anim="hero-meta">
            <div>
              <b>{allProjects.length}</b>projets
            </div>
            <div>
              <b>{allProjects.reduce((s, p) => s + p.medias.filter((m) => m.type === "video").length, 0)}</b>vidéos
            </div>
            <div>
              <b>{allProjects.reduce((s, p) => s + p.medias.filter((m) => m.type === "photo").length, 0)}</b>photos
            </div>
          </div>
        </div>
        <div className="pj-hero-mosaic hidden md:grid" aria-hidden="true">
          <div className="pj-slide-bg pj-g0" />
          <div className="pj-slide-bg pj-g1" />
          <div className="pj-slide-bg pj-g4" />
          <div className="pj-slide-bg pj-g3" />
          <div className="pj-slide-bg pj-g5" />
        </div>
      </section>

      {/* Tabs */}
      <div className="pj-tabs" role="tablist" aria-label="Type de média">
        <button
          role="tab"
          aria-selected={tab === "video"}
          className={`pj-tab ${tab === "video" ? "on" : ""}`}
          onClick={() => switchTab("video")}
        >
          <VideoIcon /> Vidéo <em>{tabCounts.video}</em>
        </button>
        <button
          role="tab"
          aria-selected={tab === "photo"}
          className={`pj-tab ${tab === "photo" ? "on" : ""}`}
          onClick={() => switchTab("photo")}
        >
          <PhotoIcon /> Photo <em>{tabCounts.photo}</em>
        </button>
      </div>

      {/* Category filters */}
      <div className="pj-filters">
        <span className="pj-filters-label">Filtrer</span>
        <button
          className={`pj-chip ${filter === "all" ? "on" : ""}`}
          onClick={() => setFilter("all")}
        >
          Tous <em>{counts.all}</em>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`pj-chip ${filter === c.id ? "on" : ""}`}
            onClick={() => setFilter(c.id)}
            disabled={counts[c.id] === 0}
          >
            {c.label} <em>{counts[c.id]}</em>
          </button>
        ))}
      </div>

      {/* Category Sections Grid */}
      <main key={tab + ":" + filter}>
        {totalFilteredCount === 0 ? (
          <div className="pj-section text-center py-24 text-white/60">
            Aucun projet ne correspond à ce filtre.
          </div>
        ) : (
          CATEGORIES.map((cat) => (
            <Fragment key={cat.id}>
              <CategorySection
                category={cat}
                projects={groupedProjects.get(cat.id) || []}
                onOpen={handleOpen}
                priorityFirst={cat.id === firstCatWithProjects}
              />
              {cat.id === "auto" && (groupedProjects.get("auto")?.length ?? 0) > 0 && (
                <p
                  className="mx-6 md:mx-auto"
                  style={{ maxWidth: 720, textAlign: "center", margin: "0 auto 8px", padding: "0 24px 24px", color: "rgba(255,255,255,0.7)", fontSize: 14 }}
                >
                  Envie d&apos;un projet détaillé&nbsp;? Lisez notre{" "}
                  <Link
                    href="/realisations/ck-clean-auto"
                    style={{ color: "#F36B1F", fontWeight: 600, textDecoration: "underline" }}
                  >
                    étude de cas shooting auto CK Clean Auto à Orléans
                  </Link>
                  .
                </p>
              )}
            </Fragment>
          ))
        )}
      </main>

      {/* Final CTA */}
      <section className="pj-cta-final mx-6 md:mx-auto">
        <div>
          <h2>Vous avez <em>un projet</em> ?</h2>
          <p>On vous répond sous 24 h, avec une première intuition de production. Devis gratuit, pas de prise de tête.</p>
        </div>
        <div className="pj-cta-final-actions flex-wrap md:flex-nowrap">
          <Link href="/devis" className="btn-primary py-4 px-8 text-base">
            Demander un devis
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center py-4 px-8 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition text-base">
            Nous contacter
          </Link>
        </div>
      </section>

      {/* Lightbox details modal */}
      {openProject && (
        <Lightbox
          project={openProject}
          startIdx={openIdx}
          onClose={() => setOpenProject(null)}
          likedIds={likedIds}
          isAuthed={isAuthed}
          toggleLike={toggleLike}
        />
      )}
    </div>
  );
}
