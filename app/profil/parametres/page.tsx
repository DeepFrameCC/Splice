import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { User, KeyRound, ShieldCheck } from "lucide-react";
import ProfileForm from "@/components/dashboard/ProfileForm";
import PasswordForm from "@/components/dashboard/PasswordForm";
import TwoFactorSection from "@/components/dashboard/TwoFactorSection";
import EmailVerificationBanner from "@/components/dashboard/EmailVerificationBanner";
import RGPDSection from "@/components/dashboard/RGPDSection";
import { PageHeader, Panel, SectionTitle } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        subtitle="Tes informations personnelles et la sécurité de ton compte"
      />

      <EmailVerificationBanner verified={!!user.emailVerified} />

      <Panel as="section" className="p-6">
        <SectionTitle icon={User}>Informations personnelles</SectionTitle>
        <div className="mt-6">
          <ProfileForm
            profile={{
              prenom: user.profile?.prenom ?? "",
              nom: user.profile?.nom ?? "",
              nomEntreprise: user.profile?.nomEntreprise ?? "",
              adresse: user.profile?.adresse ?? "",
              codePostal: user.profile?.codePostal ?? "",
              ville: user.profile?.ville ?? "",
              tel: user.profile?.tel ?? "",
              bio: user.profile?.bio ?? "",
            }}
          />
        </div>
      </Panel>

      <Panel as="section" className="p-6">
        <SectionTitle icon={KeyRound}>Mot de passe</SectionTitle>
        <div className="mt-6">
          <PasswordForm />
        </div>
      </Panel>

      <Panel as="section" className="p-6">
        <TwoFactorSection enabled={user.twoFactorEnabled} email={user.email} />
      </Panel>

      <Panel as="section" className="p-6">
        <SectionTitle icon={ShieldCheck}>Tes données personnelles (RGPD)</SectionTitle>
        <div className="mt-6">
          <RGPDSection />
        </div>
      </Panel>
    </div>
  );
}
