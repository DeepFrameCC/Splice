import { db } from "@/lib/db";
import { Shield, Clock, User, Globe, AlertTriangle } from "lucide-react";
import type { AuditAction } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import AdminFilters from "@/components/dashboard/AdminFilters";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN: "Connexion",
  LOGOUT: "Déconnexion",
  LOGIN_FAILED: "Échec connexion",
  PASSWORD_CHANGE: "Mot de passe modifié",
  PASSWORD_RESET: "Mot de passe réinitialisé",
  EMAIL_VERIFIED: "Email vérifié",
  DEVIS_CREATED: "Devis créé",
  DEVIS_UPDATED: "Devis mis à jour",
  DEVIS_DELETED: "Devis supprimé",
  FACTURE_CREATED: "Facture créée",
  CONTRAT_CREATED: "Contrat créé",
  CONTRAT_UPDATED: "Contrat mis à jour",
  PAYMENT_SUCCESS: "Paiement réussi",
  PAYMENT_FAILED: "Paiement échoué",
  SUBSCRIPTION_CREATED: "Abonnement créé",
  SUBSCRIPTION_CANCELED: "Abonnement résilié",
  ADMIN_ACTION: "Action admin",
  SETTINGS_UPDATED: "Paramètres modifiés",
  CONSENT_UPDATED: "Consentement modifié",
  LIVRAISON_UPLOADED: "Livraison déposée",
  LIVRAISON_DOWNLOADED: "Livraison téléchargée",
  LIVRAISON_DELETED: "Livraison supprimée",
};

const ACTION_VARIANT: Record<string, "default" | "destructive" | "success" | "gold" | "secondary"> = {
  LOGIN: "success",
  LOGOUT: "secondary",
  LOGIN_FAILED: "destructive",
  PAYMENT_SUCCESS: "success",
  PAYMENT_FAILED: "destructive",
  DEVIS_CREATED: "gold",
  ADMIN_ACTION: "default",
};

const SENSITIVE_ACTIONS: AuditAction[] = [
  "LOGIN_FAILED",
  "PAYMENT_FAILED",
  "ADMIN_ACTION",
  "SETTINGS_UPDATED",
];

const statusOptions = [
  { value: "LOGIN", label: "Connexion" },
  { value: "LOGIN_FAILED", label: "Échec connexion" },
  { value: "DEVIS_CREATED", label: "Devis créé" },
  { value: "DEVIS_UPDATED", label: "Devis MAJ" },
  { value: "PAYMENT_SUCCESS", label: "Paiement OK" },
  { value: "PAYMENT_FAILED", label: "Paiement échoué" },
  { value: "ADMIN_ACTION", label: "Action admin" },
  { value: "SETTINGS_UPDATED", label: "Paramètres" },
];

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const actionParam = typeof sp.status === "string" ? sp.status : undefined;
  const qParam = typeof sp.q === "string" ? sp.q : undefined;

  const where: Record<string, unknown> = {};
  if (actionParam && Object.keys(ACTION_LABELS).includes(actionParam)) {
    where.action = actionParam;
  }
  if (qParam) {
    where.OR = [
      { target: { contains: qParam, mode: "insensitive" } },
      { user: { pseudo: { contains: qParam, mode: "insensitive" } } },
      { ipAddress: { contains: qParam } },
    ];
  }

  const logs = await db.auditLog.findMany({
    where,
    include: { user: { select: { pseudo: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  // Count sensitive actions in last 24h
  const h24ago = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sensitiveCount = logs.filter(
    (l) => SENSITIVE_ACTIONS.includes(l.action) && l.createdAt > h24ago
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
            Journal d&apos;audit
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {logs.length} actions enregistrées
          </p>
        </div>
        <Suspense>
          <AdminFilters
            statusOptions={statusOptions}
            currentStatus={actionParam ?? ""}
            currentSearch={qParam ?? ""}
          />
        </Suspense>
      </header>

      {/* Alert sensitive actions */}
      {sensitiveCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-500/10 px-5 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm font-bold text-amber-800">
            {sensitiveCount} action{sensitiveCount > 1 ? "s" : ""} sensible{sensitiveCount > 1 ? "s" : ""} dans les dernières 24h
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] text-left">
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Date</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Action</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Utilisateur</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Cible</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/30">Détails</th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-white/30">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => {
              const isSensitive = SENSITIVE_ACTIONS.includes(log.action);
              return (
                <tr
                  key={log.id}
                  className={`border-b border-white/[0.06] transition hover:bg-white/[0.04] ${
                    i % 2 === 0 ? "bg-df-surface" : "bg-white/[0.02]"
                  } ${isSensitive ? "!bg-amber-500/10/50" : ""}`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {log.createdAt.toLocaleDateString("fr-FR")}{" "}
                        {log.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={ACTION_VARIANT[log.action] ?? "secondary"}>
                      {ACTION_LABELS[log.action] ?? log.action}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    {log.user ? (
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-white/20" />
                        <span className="font-medium text-white">@{log.user.pseudo}</span>
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {log.target ? (
                      <span className="font-mono text-xs text-white/50">
                        {log.target.slice(0, 20)}{log.target.length > 20 ? "…" : ""}
                      </span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="max-w-[200px] px-5 py-3">
                    {log.metadata ? (
                      <span className="truncate text-[11px] text-white/30">
                        {JSON.stringify(log.metadata).slice(0, 60)}
                      </span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {log.ipAddress ? (
                      <div className="flex items-center gap-1.5 text-xs text-white/30">
                        <Globe className="h-3.5 w-3.5" />
                        {log.ipAddress}
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Shield className="mx-auto h-10 w-10 text-white/20" />
            <p className="mt-4 text-sm text-white/30">Aucune action enregistrée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
