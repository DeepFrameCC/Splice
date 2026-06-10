import { db } from "@/lib/db";
import { Package, UploadCloud } from "lucide-react";
import { PageHeader, Panel, SectionTitle, EmptyState } from "@/components/dashboard/ui";
import AdminLivraisonUpload from "@/components/dashboard/AdminLivraisonUpload";
import LivraisonDeleteButton from "@/components/dashboard/LivraisonDeleteButton";

export const dynamic = "force-dynamic";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
}

export default async function AdminLivraisons() {
  const [livraisons, users] = await Promise.all([
    db.livraison.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { pseudo: true, profile: { select: { nomEntreprise: true, prenom: true, nom: true } } } },
      },
    }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, pseudo: true, email: true, profile: { select: { nomEntreprise: true, prenom: true, nom: true } } },
    }),
  ]);

  const clients = users.map((u) => {
    const name = u.profile?.nomEntreprise || `${u.profile?.prenom ?? ""} ${u.profile?.nom ?? ""}`.trim() || u.pseudo;
    return { id: u.id, label: `${name} — ${u.email}` };
  });

  function clientName(u: (typeof livraisons)[number]["user"]): string {
    return u.profile?.nomEntreprise || `${u.profile?.prenom ?? ""} ${u.profile?.nom ?? ""}`.trim() || u.pseudo;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Livraisons"
        subtitle="Dépose les fichiers finaux dans l'espace d'un client. Il est notifié automatiquement."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Panel className="h-fit p-6">
          <SectionTitle icon={UploadCloud}>Nouvelle livraison</SectionTitle>
          <div className="mt-5">
            <AdminLivraisonUpload clients={clients} />
          </div>
        </Panel>

        <div>
          {livraisons.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Aucune livraison déposée"
              description="Les fichiers que tu déposes pour tes clients apparaissent ici, avec leur destinataire et leur taille."
            />
          ) : (
            <ul className="space-y-3">
              {livraisons.map((l) => (
                <li key={l.id}>
                  <Panel className="flex flex-wrap items-center gap-4 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-df-gold/10 ring-1 ring-df-gold/20">
                      <Package className="h-5 w-5 text-df-gold" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">{l.titre}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/45">
                        <span className="text-df-gold/90">{clientName(l.user)}</span>
                        <span aria-hidden>·</span>
                        <span className="tabular-nums">{formatSize(l.taille)}</span>
                        <span aria-hidden>·</span>
                        <span>{l.createdAt.toLocaleDateString("fr-FR")}</span>
                      </p>
                    </div>
                    <LivraisonDeleteButton id={l.id} titre={l.titre} />
                  </Panel>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
