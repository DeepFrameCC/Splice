"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function ResetForm() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPasswordAction, null as { ok: boolean; error?: string } | null);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Nouveau mot de passe</CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe sécurisé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-1.5">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min 8 caractères"
                autoComplete="new-password"
                className="h-12"
              />
            </div>

            {state?.error && (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
                {state.error}
              </div>
            )}

            <Button type="submit" disabled={pending} size="lg" className="w-full">
              {pending ? "Mise à jour…" : "Mettre à jour"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return <Suspense><ResetForm /></Suspense>;
}
