import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { toggleLike } from "@/app/actions/likes";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import ProjetsClient from "@/components/gallery/ProjetsClient";
import GalerieAnimations from "@/components/gallery/GalerieAnimations";
import { buildGalleryJsonLd, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { StickyMobileCta } from "@/components/marketing/StickyMobileCta";
import type { Metadata } from "next";
import "./projets.css";

async function getPublishedMedias() {
  return db.media.findMany({
    where: { published: true },
    orderBy: [
      { createdAt: "desc" },
    ],
  });
}

export const metadata: Metadata = {
  title: "Galerie photo & vidéo — réalisations Orléans & Tours",
  description:
    "Decouvrez notre portfolio : films cinematiques, evenements, portraits et urbain. Orleans / Tours / Centre-Val de Loire.",
  openGraph: {
    title: "Galerie Splice Studio — Orléans & Tours",
    description: "Notre portfolio audiovisuel.",
    url: `${BASE_URL}/galerie`,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${BASE_URL}/galerie` },
};

export default async function GaleriePage({
  searchParams,
}: {
  searchParams: Promise<{ media?: string }>;
}) {
  const { media: initialMediaId } = await searchParams;
  let medias: Array<{
    id: string;
    type: "PHOTO" | "VIDEO";
    url: string;
    thumbnailUrl: string | null;
    title: string;
    description: string | null;
    category: string | null;
    client: string | null;
    duration: string | null;
    createdAt: string;
    groupKey: string | null;
    groupOrder: number | null;
  }> = [];
  let likedIds: string[] = [];
  let isAuthed = false;
  try {
    const session = await auth();
    const userId = session?.user?.id;
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
      type: m.type as "PHOTO" | "VIDEO",
      url: m.url,
      thumbnailUrl: m.thumbnailUrl,
      title: m.title,
      description: m.description,
      category: m.category,
      client: m.client,
      duration: m.duration,
      createdAt: m.createdAt.toISOString(),
      groupKey: m.groupKey,
      groupOrder: m.groupOrder,
    }));
    likedIds = likes.map((l) => l.mediaId);
  } catch (e) {
    console.error("[galerie] DB error:", e);
    return (
      <div className="df-site">
        <NavWrapper />
        <div style={{ background: "#0E0E22", minHeight: "100vh", padding: "160px 40px", textAlign: "center" }}>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>La galerie est momentanément indisponible.</p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 12 }}>
            Réessayez dans quelques instants ou{" "}
            <a href="/contact" style={{ color: "#F36B1F", textDecoration: "underline" }}>contactez-nous</a>.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="df-site">
      <JsonLd data={buildGalleryJsonLd(medias.length, medias)} />
      <NavWrapper />
      <GalerieAnimations />
      <div style={{ background: "#0E0E22", minHeight: "100vh", paddingTop: 80 }}>
        <ProjetsClient
          medias={medias}
          likedIds={likedIds}
          isAuthed={isAuthed}
          toggleLike={toggleLike}
          initialMediaId={initialMediaId ?? null}
        />
      </div>
      <Footer />
      <StickyMobileCta source="sticky_galerie" label="Un projet ? Devis gratuit" />
    </div>
  );
}
