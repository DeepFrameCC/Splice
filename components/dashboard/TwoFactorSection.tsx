"use client";

import { useState, useActionState } from "react";
import { generate2FASetup, enable2FAAction, disable2FAAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ShieldCheck, ShieldOff, CheckCircle } from "lucide-react";

type Props = {
  enabled: boolean;
  email: string;
};

export default function TwoFactorSection({ enabled, email }: Props) {
  const [setupMode, setSetupMode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [enableState, enableAction, enablePending] = useActionState(enable2FAAction, null);
  const [disableState, disableAction, disablePending] = useActionState(disable2FAAction, null);

  async function startSetup() {
    setLoading(true);
    try {
      const result = await generate2FASetup();
      if ("error" in result) return;
      setSecret(result.secret);
      setQrDataUrl(result.qrDataUrl);
      setSetupMode(true);
    } finally {
      setLoading(false);
    }
  }

  if (enabled && !disableState?.ok) {
    return (
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          Double authentification
        </h2>

        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-400">
            La double authentification est <span className="font-bold">activée</span> sur votre compte.
          </p>
        </div>

        <form action={disableAction} className="space-y-4">
          <p className="text-sm text-white/50">
            Pour désactiver la 2FA, confirmez votre mot de passe.
          </p>
          <div className="max-w-xs space-y-2">
            <Label htmlFor="disable-password">Mot de passe</Label>
            <Input id="disable-password" name="password" type="password" autoComplete="current-password" />
          </div>

          {disableState?.error && (
            <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{disableState.error}</p>
          )}

          <Button type="submit" variant="destructive" disabled={disablePending}>
            {disablePending ? "Désactivation…" : "Désactiver la 2FA"}
          </Button>
        </form>
      </div>
    );
  }

  if (enableState?.ok || disableState?.ok) {
    return (
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
          <Shield className="h-5 w-5 text-df-blue" />
          Double authentification
        </h2>
        <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          {enableState?.ok ? enableState.message : disableState?.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-white">
        <ShieldOff className="h-5 w-5 text-amber-500" />
        Double authentification
      </h2>

      {!setupMode ? (
        <div>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-amber-500/10 px-4 py-3">
            <ShieldOff className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-700">
              La double authentification n&apos;est <span className="font-bold">pas activée</span>.
              Nous recommandons de l&apos;activer pour sécuriser votre compte.
            </p>
          </div>
          <Button onClick={startSetup} disabled={loading} variant="gold">
            {loading ? "Génération…" : "Configurer la 2FA"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-white/70">
            Scannez ce QR code avec votre application d&apos;authentification
            (Google Authenticator, Authy, etc.) puis entrez le code à 6 chiffres.
          </p>

          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/[0.04] p-6">
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR Code 2FA" width={200} height={200} className="rounded-xl" />
            )}
            {secret && (
              <div className="text-center">
                <p className="text-xs text-white/40">Clé manuelle :</p>
                <code className="mt-1 block rounded-lg bg-df-surface px-3 py-1.5 font-mono text-xs text-df-blue ring-1 ring-white/[0.08]">
                  {secret}
                </code>
              </div>
            )}
          </div>

          <form action={enableAction} className="space-y-4">
            <div className="max-w-xs space-y-2">
              <Label htmlFor="totp-code">Code à 6 chiffres</Label>
              <Input
                id="totp-code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>

            {enableState?.error && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{enableState.error}</p>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={enablePending}>
                {enablePending ? "Vérification…" : "Activer la 2FA"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setSetupMode(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
