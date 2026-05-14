import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { FOUNDER_LABEL } from "@/lib/pricing";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MesLikes() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;
  const likes = await db.like.findMany({
    where: { userId },
    include: { media: { include: { monteur: { select: { pseudo: true } } } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-4xl italic text-df-blue">Mes likes / Inspirations</h1>
      <p className="mb-6 text-df-blue/70">Photos et vidéos sauvegardées avec leur estimation.</p>

      {likes.length === 0 ? (
        <p className="rounded-xl bg-df-cream p-6 text-center text-df-blue/70">Likez des médias dans la galerie pour voir leur estimation et le matériel utilisé.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {likes.map(({ media: m }) => (
            <Link key={m.id} href={m.type === "VIDEO" ? `/videos/${m.id}` : `/photos`}
              className="group overflow-hidden rounded-2xl bg-df-cream shadow-md ring-1 ring-df-blue/10 transition hover:scale-[1.03]">
              {m.type === "PHOTO" ? (
                <div className="relative aspect-square w-full">
                  <Image
                    src={m.url}
                    alt={m.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <video src={m.url} poster={m.thumbnailUrl ?? undefined} muted className="aspect-[9/16] w-full object-cover" />
              )}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="font-display italic text-df-blue text-sm">{FOUNDER_LABEL[m.owner]}</p>
                  <Heart className="h-4 w-4 fill-df-gold text-df-gold" />
                </div>
                <p className="text-xs font-bold text-df-blue truncate">{m.title}</p>
                <p className="mt-1 text-xs text-df-blue/70">~ <span className="font-bold text-df-gold">{m.prixEstime} €</span></p>
                {m.monteur && <p className="text-xs text-df-blue/60">Monté par {m.monteur.pseudo}</p>}
                {m.materiel.length > 0 && <p className="text-xs text-df-blue/60 truncate">{m.materiel.join(", ")}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
