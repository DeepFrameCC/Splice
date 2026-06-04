"use client";

import { useState, useTransition } from "react";
import { exportMyData, deleteMyAccount } from "@/app/actions/rgpd";
import { Download, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function RGPDSection() {
  const [isPending, startTransition] = useTransition();
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm">("idle");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  function handleExport() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await exportMyData();
      if (!result.success || !result.data) {
        setError(result.error ?? "Erreur lors de l'export");
        return;
      }

      // Download as JSON file
      const blob = new Blob([result.data], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `splice-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess("Export téléchargé.");
    });
  }

  function handleDelete() {
    if (!password) {
      setError("Entrez votre mot de passe pour confirmer.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteMyAccount(password);
      if (!result.success) {
        setError(result.error ?? "Erreur lors de la suppression");
        return;
      }
      // Account is gone and the session is invalidated server-side. Keep the
      // overlay up and hard-navigate so we never re-render the (now forbidden)
      // dashboard.
      setLeaving(true);
      window.location.assign("/?compte_supprime=1");
    });
  }

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="flex items-start gap-4 rounded-xl border border-white/[0.08] p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-df-gold/10">
          <Download className="h-5 w-5 text-df-gold" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-sm font-bold text-white">
            Exporter mes données
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Téléchargez l&apos;ensemble de vos données personnelles au format JSON
            (RGPD art. 15 &amp; 20 — droit d&apos;accès &amp; portabilité).
          </p>
          <button
            type="button"
            onClick={handleExport}
            disabled={isPending}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-df-blue px-4 py-2 text-xs font-bold text-white transition hover:bg-df-blue-dark disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {isPending ? "Export en cours..." : "Télécharger mes données"}
          </button>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="flex items-start gap-4 rounded-xl border border-red-500/20 bg-red-500/10/50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-sm font-bold text-red-400">
            Supprimer mon compte
          </h3>
          <p className="mt-1 text-xs text-red-600/70">
            Demander la suppression de votre compte et de vos données personnelles
            (RGPD art. 17 — droit à l&apos;effacement). Les documents comptables
            (factures) sont conservés 10 ans conformément à la loi.
          </p>

          {deleteStep === "idle" && (
            <button
              type="button"
              onClick={() => setDeleteStep("confirm")}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-500/15"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Demander la suppression
            </button>
          )}

          {deleteStep === "confirm" && (
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-2 rounded-lg bg-red-500/15 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <p className="text-xs font-bold text-red-400">
                  Cette action est irréversible. Votre compte et vos données
                  personnelles sont supprimés immédiatement et vous êtes
                  déconnecté. Les factures sont conservées 10 ans (obligation
                  légale comptable).
                </p>
              </div>
              <div>
                <label htmlFor="delete-password" className="mb-1 block text-xs font-bold text-red-400">
                  Confirmez avec votre mot de passe
                </label>
                <Input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full max-w-xs border-red-500/30 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending || leaving}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending || leaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Suppression…
                    </>
                  ) : (
                    "Confirmer la suppression"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteStep("idle");
                    setPassword("");
                    setError(null);
                  }}
                  disabled={isPending || leaving}
                  className="rounded-full px-4 py-2 text-xs font-bold text-white/40 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback messages */}
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
      {success && <p className="text-sm font-bold text-emerald-400">{success}</p>}

      {/* Full-screen overlay during account deletion + logout */}
      {leaving && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-[#0E0E22] text-white"
        >
          <Loader2 className="h-6 w-6 animate-spin text-[#F36B1F]" />
          <p className="text-sm font-medium tracking-wide text-white/80">
            Suppression du compte et déconnexion…
          </p>
        </div>
      )}
    </div>
  );
}
