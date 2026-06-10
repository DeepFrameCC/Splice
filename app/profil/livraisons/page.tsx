import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Download, FileVideo, FileImage, FileArchive, FileText, PackageOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader, EmptyState, Panel } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
}

function iconFor(contentType: string): LucideIcon {
  if (contentType.startsWith("video/")) return FileVideo;
  if (contentType.startsWith("image/")) return FileImage;
  if (contentType.includes("zip")) return FileArchive;
  return FileText;
}

// Encode chaque segment du chemin sans casser les "/" attendus par la route
// catch-all /api/deliveries/[...key].
function downloadHref(r2Key: string): string {
  return `/api/deliveries/${r2Key.split("/").map(encodeURIComponent).join("/")}`;
}

export default async function MesLivraisons() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const livraisons = await db.livraison.findMany({
    where: { userId },
    include: { devis: { select: { numero: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Mes livraisons"
        subtitle={
          livraisons.length > 0
            ? `${livraisons.length} fichier${livraisons.length !== 1 ? "s" : ""} prêt${livraisons.length !== 1 ? "s" : ""} à télécharger`
            : undefined
        }
      />

      {livraisons.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="Aucune livraison pour l'instant"
          description="Tes montages finaux, photos HD et autres livrables apparaîtront ici dès qu'on les met à disposition. Tu seras notifié à chaque dépôt."
        />
      ) : (
        <ul className="space-y-3">
          {livraisons.map((l) => {
            const Icon = iconFor(l.contentType);
            return (
              <li key={l.id}>
                <Panel className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-df-gold/10 ring-1 ring-df-gold/20">
                    <Icon className="h-5 w-5 text-df-gold" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">{l.titre}</p>
                    {l.description && (
                      <p className="mt-0.5 line-clamp-1 text-sm text-white/60">{l.description}</p>
                    )}
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/45">
                      <span className="tabular-nums">{formatSize(l.taille)}</span>
                      <span aria-hidden>·</span>
                      <span>{l.createdAt.toLocaleDateString("fr-FR")}</span>
                      {l.devis && (
                        <>
                          <span aria-hidden>·</span>
                          <span>Devis n°{l.devis.numero}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <a
                    href={downloadHref(l.r2Key)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-df-gold px-4 py-2 text-sm font-bold text-white transition hover:bg-df-gold/90"
                    aria-label={`Télécharger ${l.titre}`}
                  >
                    <Download className="h-4 w-4" aria-hidden /> Télécharger
                  </a>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
