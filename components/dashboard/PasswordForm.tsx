"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
          <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" placeholder="Min. 8 caractères" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          <CheckCircle className="h-4 w-4" /> {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} variant="outline">
        {pending ? "Modification…" : "Changer le mot de passe"}
      </Button>
    </form>
  );
}
