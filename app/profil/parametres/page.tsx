import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Settings, ShieldCheck } from "lucide-react";
import ProfileForm from "@/components/dashboard/ProfileForm";
import PasswordForm from "@/components/dashboard/PasswordForm";
import TwoFactorSection from "@/components/dashboard/TwoFactorSection";
import EmailVerificationBanner from "@/components/dashboard/EmailVerificationBanner";
import RGPDSection from "@/components/dashboard/RGPDSection";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-df-ink/50">
          Gérez vos informations personnelles et la sécurité de votre compte
        </p>
      </header>

      {/* Email Verification */}
      <EmailVerificationBanner verified={!!user.emailVerified} />

      {/* Profile Section */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
        <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-df-ink">
          <Settings className="h-5 w-5 text-df-blue" />
          Informations personnelles
        </h2>
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
      </section>

      {/* Password Section */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
        <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-df-ink">
          <Settings className="h-5 w-5 text-df-gold" />
          Mot de passe
        </h2>
        <PasswordForm />
      </section>

      {/* 2FA Section */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
        <TwoFactorSection
          enabled={user.twoFactorEnabled}
          email={user.email}
        />
      </section>

      {/* RGPD Section */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
        <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-df-ink">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Vos données personnelles (RGPD)
        </h2>
        <RGPDSection />
      </section>
    </div>
  );
}
