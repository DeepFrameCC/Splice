import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { toggleLike } from "@/app/actions/likes";
import { unstable_cache } from "next/cache";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ProjetsClient from "@/components/gallery/ProjetsClient";
import GalerieAnimations from "@/components/gallery/GalerieAnimations";
import type { Metadata } from "next";
import "./projets.css";

// Reading the user's session forces dynamic rendering, but the public media
// list is identical for everyone, so we cache it for 60s. likedIds is still
// computed per-request.
const getPublishedMedias = unstable_cache(
  async () =>
    db.media.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
  ["galerie:published-medias"],
  { revalidate: 60, tags: ["medias"] }
);

export const metadata: Metadata = {
  title: "Portfolio — DeepFrame",
  description:
    "Découvrez nos réalisations vidéo et photo : automobile, films de marque, réseaux sociaux, événementiel, portrait, lifestyle.",
};

export default async function GaleriePage() {
  let medias: any[] = [];
  let likedIds: string[] = [];
  let isAuthed = false;

  try {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    isAuthed = Boolean(userId);

    const [fetchedMedias, likes] = await Promise.all([
      getPublishedMedias(),
      userId
        ? db.like.findMany({
            where: { userId },
            select: { mediaId: true },
          })
        : Promise.resolve([]),
    ]);

    medias = fetchedMedias.map((m) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl,
      title: m.title,
      category: m.category,
      client: m.client,
      duration: m.duration,
      createdAt: m.createdAt.toISOString(),
    }));
    likedIds = likes.map((l) => l.mediaId);
  } catch (e) {
    console.error("[galerie] DB error:", e);
  }

  return (
    <>
      <Nav />
      <GalerieAnimations />
      <div style={{ background: "#fff", minHeight: "100vh", paddingTop: 80 }}>
        <ProjetsClient
          medias={medias}
          likedIds={likedIds}
          isAuthed={isAuthed}
          toggleLike={toggleLike}
        />
      </div>
      <Footer />
    </>
  );
}
