"use client";

import { useState, useTransition } from "react";
import { exportMyData, requestAccountDeletion } from "@/app/actions/rgpd";
import { Download, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";

export default function RGPDSection() {
  const [isPending, startTransition] = useTransition();
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "done">("idle");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      a.download = `deepframe-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess("Export téléchargé.");
    });
  }

  function handleDeleteRequest() {
    if (!password) {
      setError("Entrez votre mot de passe pour confirmer.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await requestAccountDeletion(password);
      if (!result.success) {
        setError(result.error ?? "Erreur lors de la demande");
        return;
      }
      setDeleteStep("done");
      setPassword("");
    });
  }

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="flex items-start gap-4 rounded-xl border border-df-blue/10 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-df-blue/5">
          <Download className="h-5 w-5 text-df-blue" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-sm font-bold text-df-ink">
            Exporter mes données
          </h3>
          <p className="mt-1 text-xs text-df-ink/50">
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
      <div className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50/50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-sm font-bold text-red-800">
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
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Demander la suppression
            </button>
          )}

          {deleteStep === "confirm" && (
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-2 rounded-lg bg-red-100 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <p className="text-xs font-bold text-red-800">
                  Cette action est irréversible. Votre compte sera anonymisé dans un délai de 30 jours.
                </p>
              </div>
              <div>
                <label htmlFor="delete-password" className="mb-1 block text-xs font-bold text-red-700">
                  Confirmez avec votre mot de passe
                </label>
                <input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full max-w-xs rounded-xl border border-red-300 px-4 py-2.5 text-sm text-df-ink outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDeleteRequest}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {isPending ? "..." : "Confirmer la suppression"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteStep("idle");
                    setPassword("");
                    setError(null);
                  }}
                  className="rounded-full px-4 py-2 text-xs font-bold text-df-ink/50 transition hover:bg-df-cream"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {deleteStep === "done" && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <p className="text-xs font-bold text-emerald-700">
                Demande enregistrée. Votre compte sera traité dans un délai de 30 jours.
                Vous recevrez une confirmation par email.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback messages */}
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
      {success && <p className="text-sm font-bold text-emerald-600">{success}</p>}
    </div>
  );
}
