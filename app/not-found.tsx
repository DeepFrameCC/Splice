import Link from "next/link";


export default function NotFound() {
  return (
    <div className="min-h-screen bg-df-surface flex flex-col items-center justify-center px-6 text-center">
      <span className="mb-10 font-display text-2xl font-bold tracking-wide text-[#0E0E22]/30">DEEPFRAME</span>

      <p
        style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.18em" }}
        className="text-xs uppercase text-[#F36B1F] mb-4"
      >
        Erreur 404
      </p>

      <h1
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        className="text-5xl md:text-7xl font-bold text-[#F36B1F] leading-none mb-6"
      >
        Page<br />introuvable.
      </h1>

      <p className="text-[#0E0E22]/60 text-lg max-w-md mb-10">
        Cette page n&apos;existe pas ou a été déplacée. Retourne à l&apos;accueil pour reprendre là où tu en étais.
      </p>

      <Link
        href="/"
        style={{
          background: "#F36B1F",
          color: "#1A1408",
          borderRadius: "999px",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: 14,
          padding: "14px 28px",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Retour à l&apos;accueil →
      </Link>
    </div>
  );
}
