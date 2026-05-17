import NavWrapper from "@/components/layout/NavWrapper";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devis envoyé",
  description: "Votre demande de devis a bien été envoyée.",
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string; total?: string }>;
}) {
  const { numero, total } = await searchParams;

  return (
    <>
      <NavWrapper />
      <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1
          className="text-3xl font-black text-df-blue md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Demande envoyée !
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-white/70">
          Votre demande de devis{numero ? <> <strong className="text-df-blue">n°{numero}</strong></> : ""}{" "}
          {total ? <>pour un total de <strong className="text-df-blue">{total} €</strong> </> : ""}
          a bien été enregistrée.
        </p>

        <p className="mt-2 text-base text-white/50">
          Un email de confirmation vient de vous être envoyé. Notre équipe revient vers vous sous 48h.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full border-2 border-df-blue px-6 py-3 text-sm font-bold text-df-blue transition hover:bg-df-blue hover:text-white"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-df-gold px-6 py-3 text-sm font-bold text-white transition hover:scale-105 hover:shadow-lg"
          >
            Créer un compte pour suivre mon devis
          </Link>
        </div>
      </section>
    </>
  );
}
