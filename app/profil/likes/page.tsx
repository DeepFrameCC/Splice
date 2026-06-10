import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { FOUNDER_HANDLE } from "@/lib/pricing";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

export default async function MesLikes() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  const likes = await db.like.findMany({
    where: { userId },
    include: { media: { include: { monteur: { select: { pseudo: true } } } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <PageHeader
        title="Mes inspirations"
        subtitle="Les photos et vidéos que tu as likées, avec leur estimation et le matériel utilisé"
      />

      {likes.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aucune inspiration sauvegardée"
          description="Parcours la galerie et like les réalisations qui te parlent : tu retrouves ici leur estimation de prix et le matériel utilisé pour les tourner."
          action={
            <Link href="/galerie" className="btn-primary">
              Explorer la galerie
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {likes.map(({ media: m }) => (
            <Link key={m.id} href={`/galerie?media=${m.id}`}
              className="group overflow-hidden rounded-2xl bg-df-surface ring-1 ring-white/[0.08] transition hover:ring-df-gold/40">
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
                  <p className="font-display uppercase tracking-wider text-df-gold text-sm">{FOUNDER_HANDLE[m.owner]}</p>
                  <Heart className="h-4 w-4 fill-df-gold text-df-gold" />
                </div>
                <p className="text-xs font-bold text-white truncate group-hover:text-df-gold transition-colors">{m.title}</p>
                <p className="mt-1 text-xs text-white/60">~ <span className="font-bold text-df-gold">{m.prixEstime} €</span></p>
                {m.monteur && <p className="text-xs text-white/50">Monté par {m.monteur.pseudo}</p>}
                {m.materiel.length > 0 && <p className="text-xs text-white/40 truncate">{m.materiel.join(", ")}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
