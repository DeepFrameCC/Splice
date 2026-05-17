"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

type Props = {
  profile: {
    prenom: string;
    nom: string;
    nomEntreprise: string;
    adresse: string;
    codePostal: string;
    ville: string;
    tel: string;
    bio: string;
  };
};

export default function ProfileForm({ profile }: Props) {
  const [state, action, pending] = useActionState(updateProfileAction, null);

  return (
    <form action={action} className="space-y-5">
      {/* Nom / Entreprise */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" name="prenom" defaultValue={profile.prenom} placeholder="Votre prénom" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" defaultValue={profile.nom} placeholder="Votre nom" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nomEntreprise">Nom d&apos;entreprise</Label>
        <Input id="nomEntreprise" name="nomEntreprise" defaultValue={profile.nomEntreprise} placeholder="(facultatif)" />
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label htmlFor="tel">Téléphone</Label>
        <Input id="tel" name="tel" type="tel" defaultValue={profile.tel} placeholder="06 XX XX XX XX" />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="adresse">Adresse</Label>
        <Input id="adresse" name="adresse" defaultValue={profile.adresse} placeholder="Rue, numéro" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="codePostal">Code postal</Label>
          <Input id="codePostal" name="codePostal" defaultValue={profile.codePostal} placeholder="37550" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ville">Ville</Label>
          <Input id="ville" name="ville" defaultValue={profile.ville} placeholder="Saint-Avertin" />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={profile.bio}
          placeholder="Quelques mots sur vous ou votre activité..."
          className="flex w-full rounded-xl border border-white/10 bg-df-surface px-4 py-3 text-sm text-white ring-offset-df-night placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-blue focus-visible:ring-offset-2"
        />
      </div>

      {/* Feedback */}
      {state?.error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
          <CheckCircle className="h-4 w-4" /> {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
