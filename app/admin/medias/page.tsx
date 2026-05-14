import { db } from "@/lib/db";
import { Image as ImageIcon, Video, Eye, EyeOff, Heart } from "lucide-react";
import { PublishToggle, DeleteMediaBtn } from "@/components/dashboard/MediaToggleBtn";

export const dynamic = "force-dynamic";

export default async function AdminMediasPage() {
  const medias = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { likes: true } }, monteur: { select: { pseudo: true } } },
  });

  const stats = {
    total: medias.length,
    photos: medias.filter((m) => m.type === "PHOTO").length,
    videos: medias.filter((m) => m.type === "VIDEO").length,
    published: medias.filter((m) => m.published).length,
    hidden: medias.filter((m) => !m.published).length,
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
          Médias
        </h1>
        <p className="mt-1 text-sm text-df-ink/50">
          {stats.total} médias — {stats.photos} photos, {stats.videos} vidéos · {stats.published} publiés, {stats.hidden} masqués
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Photos", value: stats.photos, icon: ImageIcon, color: "text-df-blue", bg: "bg-df-blue/5" },
          { label: "Vidéos", value: stats.videos, icon: Video, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Publiés", value: stats.published, icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Masqués", value: stats.hidden, icon: EyeOff, color: "text-df-ink/40", bg: "bg-df-ink/5" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-df-blue/10">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-df-ink">{s.value}</p>
            <p className="text-xs text-df-ink/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Media grid */}
      {medias.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-df-blue/10">
          <ImageIcon className="mx-auto h-10 w-10 text-df-blue/20" />
          <p className="mt-4 text-sm text-df-ink/40">Aucun média pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {medias.map((m) => (
            <div
              key={m.id}
              className={`group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition ${
                m.published ? "ring-df-blue/10" : "ring-red-200/50 opacity-75"
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-df-ink/5">
                {m.thumbnailUrl ? (
                  <img
                    src={m.thumbnailUrl}
                    alt={m.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : m.url ? (
                  <img
                    src={m.url}
                    alt={m.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    {m.type === "VIDEO" ? (
                      <Video className="h-8 w-8 text-df-ink/20" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-df-ink/20" />
                    )}
                  </div>
                )}

                {/* Type badge */}
                <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  m.type === "VIDEO" ? "bg-purple-500 text-white" : "bg-df-blue text-white"
                }`}>
                  {m.type}
                </span>

                {/* Likes */}
                {m._count.likes > 0 && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                    <Heart className="h-2.5 w-2.5 fill-rose-400 text-rose-400" />
                    {m._count.likes}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="truncate font-bold text-df-ink">{m.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-df-ink/40">
                  <span>{m.owner}</span>
                  {m.monteur && <span>· @{m.monteur.pseudo}</span>}
                  {m.category && <span>· {m.category}</span>}
                </div>
                <p className="mt-1 text-xs font-bold text-df-blue">
                  {m.prixEstime.toLocaleString("fr-FR")} €
                </p>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <PublishToggle mediaId={m.id} published={m.published} />
                  <DeleteMediaBtn mediaId={m.id} title={m.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
