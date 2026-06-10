import type { Metadata } from "next";
import { preload } from "react-dom";
import HomeContent from "@/components/home/HomeContent";
import { scenes } from "@/lib/home/scenes";
import { db } from "@/lib/db";

export const revalidate = 3600; // statique + ISR (compteur galerie rafraîchi toutes les heures)

// Canonical de la home (absent du layout) — résolu via metadataBase.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Préload du poster hero (image LCP) — limité à la home (auparavant dans le
  // layout racine, il était téléchargé inutilement sur toutes les pages).
  const heroPoster = scenes[0]?.poster;
  if (heroPoster) {
    preload(heroPoster, { as: "image", fetchPriority: "high" });
  }

  let mediaCount = 0;
  try {
    mediaCount = await db.media.count({ where: { published: true } });
  } catch {
    // DB indisponible au build/revalidate — l'ISR sert la dernière page valide.
  }
  return <HomeContent mediaCount={mediaCount} />;
}
