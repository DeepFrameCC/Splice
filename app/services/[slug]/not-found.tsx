import Link from "next/link";

export default function ServiceNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-white/20">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-white">Service introuvable</h1>
      <p className="mt-2 text-white/60">
        Ce service n&apos;existe pas ou a ete retire.
      </p>
      <Link
        href="/services"
        className="mt-8 rounded-full bg-df-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-df-blue-dark"
      >
        Voir tous nos services
      </Link>
    </main>
  );
}
