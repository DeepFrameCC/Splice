import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { FOUNDER_LABEL } from "@/lib/pricing";
import type { Founder } from "@prisma/client";
import MediaCard from "@/components/gallery/MediaCard";
import { toggleLike } from "@/app/actions/likes";
import FilterTabs from "@/components/gallery/FilterTabs";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PhotosPage({ searchParams }: { searchParams: Promise<{ owner?: string }> }) {
  const sp = await searchParams;

  let medias: any[] = [];
  let likedIds = new Set<string>();
  let dbError = false;
  let userId: string | undefined;

  try {
    const session = await auth();
    userId = session?.user?.id;

    const where: any = { type: "PHOTO", published: true };
    if (sp.owner === "PAPI" || sp.owner === "LOUISIA" || sp.owner === "TY") where.owner = sp.owner;

    const [fetchedMedias, likes] = await Promise.all([
      db.media.findMany({ where, include: { monteur: { select: { pseudo: true } } }, orderBy: { createdAt: "desc" } }),
      userId ? db.like.findMany({ where: { userId }, select: { mediaId: true } }) : Promise.resolve([])
    ]);
    medias = fetchedMedias;
    likedIds = new Set(likes.map((l) => l.mediaId));
  } catch (e) {
    console.error("[photos] DB error:", e);
    dbError = true;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-5xl italic text-df-blue">Photos</h1>
          <p className="mt-2 text-df-blue/70">Survolez pour zoomer. Connectez-vous pour liker et voir l&apos;estimation.</p>
        </div>
        <FilterTabs basePath="/photos" current={sp.owner} />
      </header>

      {dbError ? (
        <div className="flex items-center gap-3 rounded-xl bg-amber-500/10 p-6 text-amber-800">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-bold">Service temporairement indisponible</p>
            <p className="text-sm">La galerie sera de retour très bientôt. Merci de réessayer dans quelques instants.</p>
          </div>
        </div>
      ) : medias.length === 0 ? (
        <p className="rounded-xl bg-df-surface p-8 text-center text-df-blue/70">Aucune photo pour l&apos;instant — bientôt en ligne.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {medias.map((m) => (
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
          ))}
        </div>
      )}
    </section>
  );
}
