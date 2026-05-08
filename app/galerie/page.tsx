import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { FOUNDER_LABEL } from "@/lib/pricing";
import type { Founder } from "@prisma/client";
import MediaCard from "@/components/gallery/MediaCard";
import VideoCard from "@/components/gallery/VideoCard";
import FilterTabs from "@/components/gallery/FilterTabs";
import { toggleLike } from "@/app/actions/likes";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Toutes les réalisations DeepFrame — photos et vidéos. Shootings auto, pubs réseaux sociaux, films de marque.",
};

const TYPE_TABS = [
  { value: "",       label: "Tout" },
  { value: "PHOTO",  label: "Photos" },
  { value: "VIDEO",  label: "Vidéos" },
];

export default async function GaleriePage({
  searchParams,
}: {
  searchParams: Promise<{ owner?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const typeFilter = sp.type === "PHOTO" || sp.type === "VIDEO" ? sp.type : undefined;
  const ownerFilter = sp.owner === "PAPI" || sp.owner === "LOUISIA" || sp.owner === "TY" ? sp.owner : undefined;

  let medias: any[] = [];
  let likedIds = new Set<string>();
  let dbError = false;
  let userId: string | undefined;

  try {
    const session = await auth();
    userId = (session?.user as any)?.id as string | undefined;

    const where: any = { published: true };
    if (typeFilter)  where.type  = typeFilter;
    if (ownerFilter) where.owner = ownerFilter;

    const [fetchedMedias, likes] = await Promise.all([
      db.media.findMany({
        where,
        include: { monteur: { select: { pseudo: true } } },
        orderBy: { createdAt: "desc" },
      }),
      userId
        ? db.like.findMany({ where: { userId }, select: { mediaId: true } })
        : Promise.resolve([]),
    ]);

    medias = fetchedMedias;
    likedIds = new Set(likes.map((l) => l.mediaId));
  } catch (e) {
    console.error("[galerie] DB error:", e);
    dbError = true;
  }

  const buildUrl = (params: Record<string, string | undefined>) => {
    const base = new URLSearchParams();
    if (params.owner) base.set("owner", params.owner);
    if (params.type)  base.set("type",  params.type);
    const q = base.toString();
    return `/galerie${q ? `?${q}` : ""}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      {/* Header */}
      <header className="mb-10">
        <h1 className="font-display text-5xl italic text-df-blue md:text-6xl">Galerie</h1>
        <p className="mt-2 text-df-blue/70 text-lg">Photos et vidéos — toutes nos réalisations.</p>
      </header>

      {/* Filtres : type + owner */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">

        {/* Onglets Type */}
        <div className="flex gap-2 flex-wrap">
          {TYPE_TABS.map((t) => {
            const active = (sp.type ?? "") === t.value;
            return (
              <Link
                key={t.value}
                href={buildUrl({ owner: sp.owner, type: t.value || undefined })}
                className={[
                  "rounded-full px-5 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-df-blue text-white"
                    : "bg-df-cream text-df-blue hover:bg-df-gold",
                ].join(" ")}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        {/* Filtre Owner */}
        <FilterTabs basePath="/galerie" current={sp.owner} extraParams={sp.type ? { type: sp.type } : {}} />
      </div>

      {/* Grille */}
      {dbError ? (
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-6 text-amber-800">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-bold">Service temporairement indisponible</p>
            <p className="text-sm">La galerie sera de retour très bientôt.</p>
          </div>
        </div>
      ) : medias.length === 0 ? (
        <p className="rounded-xl bg-df-cream p-10 text-center text-df-blue/70 text-lg">
          Aucun contenu publié pour l&apos;instant — bientôt en ligne.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {medias.map((m) =>
            m.type === "VIDEO" ? (
              <VideoCard
                key={m.id}
                id={m.id}
                src={m.url}
                thumbnail={m.thumbnailUrl ?? ""}
                preview={m.previewUrl ?? undefined}
                title={m.title}
                ownerHandle={FOUNDER_LABEL[m.owner as Founder]}
                prixEstime={m.prixEstime}
                materiel={m.materiel}
                monteur={m.monteur?.pseudo ?? null}
                liked={likedIds.has(m.id)}
                isAuthed={Boolean(userId)}
                toggleLike={toggleLike}
              />
            ) : (
              <MediaCard
                key={m.id}
                id={m.id}
                src={m.url}
                title={m.title}
                ownerHandle={FOUNDER_LABEL[m.owner as Founder]}
                prixEstime={m.prixEstime}
                materiel={m.materiel}
                monteur={m.monteur?.pseudo ?? null}
                liked={likedIds.has(m.id)}
                isAuthed={Boolean(userId)}
                toggleLike={toggleLike}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}
