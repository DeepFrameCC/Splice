"use client";

import { useTransition, useState } from "react";
import { sendVerificationEmail } from "@/app/actions/email-verification";
import { AlertTriangle, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmailVerificationBanner({ verified }: { verified: boolean }) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (verified) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3">
        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-400">
          Adresse email vérifiée
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">
            Adresse email non vérifiée
          </p>
          <p className="mt-1 text-xs text-amber-700/70">
            Vérifiez votre email pour accéder à toutes les fonctionnalités.
          </p>

          {sent ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <Mail className="h-3.5 w-3.5" /> Email envoyé ! Vérifiez votre boîte de réception.
            </p>
          ) : (
            <Button
              variant="gold"
              size="sm"
              className="mt-3"
              disabled={pending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const result = await sendVerificationEmail();
                  if (result.ok) {
                    setSent(true);
                  } else {
                    setError(result.error ?? "Erreur inconnue");
                  }
                });
              }}
            >
              {pending ? "Envoi…" : "Envoyer le lien de vérification"}
            </Button>
          )}

          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
