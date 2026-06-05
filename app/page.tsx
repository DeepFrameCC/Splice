import HomeContent from "@/components/home/HomeContent";
import { db } from "@/lib/db";

export const revalidate = 3600; // statique + ISR (compteur galerie rafraîchi toutes les heures)

export default async function Home() {
  let mediaCount = 0;
  try {
    mediaCount = await db.media.count({ where: { published: true } });
  } catch {
    // DB indisponible au build/revalidate — l'ISR sert la dernière page valide.
  }
  return <HomeContent mediaCount={mediaCount} />;
}
