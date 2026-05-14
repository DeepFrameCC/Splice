import { verifyEmailToken } from "@/app/actions/email-verification";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";

  const result = await verifyEmailToken(token);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-df-blue/10">
        {result.ok ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold text-df-ink">
              Email vérifié !
            </h1>
            <p className="mt-2 text-sm text-df-ink/60">
              Votre adresse email a bien été vérifiée. Votre compte est maintenant pleinement actif.
            </p>
            <Link
              href="/profil"
              className="mt-6 inline-flex rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90"
            >
              Accéder à mon profil
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-bold text-df-ink">
              Vérification échouée
            </h1>
            <p className="mt-2 text-sm text-df-ink/60">
              {result.error}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/profil/parametres"
                className="inline-flex rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90"
              >
                Renvoyer un email
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-xl border border-df-blue/20 px-6 py-3 text-sm font-bold text-df-ink transition hover:bg-df-cream"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
