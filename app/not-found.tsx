import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0E22] flex flex-col items-center justify-center px-6 text-center">
      <span
        style={{ color: "rgba(255, 255, 255, 0.45)" }}
        className="mb-10 font-display text-2xl font-bold tracking-wide"
      >
        SPLICE STUDIO
      </span>

      <h1
        style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.18em" }}
        className="text-xs uppercase text-[#F36B1F] mb-4"
      >
        Page introuvable (404)
      </h1>

      <h2
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        className="text-4xl md:text-6xl font-bold text-[#F36B1F] leading-none mb-6"
      >
        Oups, cette page<br />n&apos;existe pas.
      </h2>

      <p
        style={{ color: "rgba(255, 255, 255, 0.6)" }}
        className="text-lg max-w-md mb-10"
      >
        Le lien est peut-être expiré, ou la ressource a été supprimée lors de notre phase de mise en ligne.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/profil"
          style={{
            background: "#F36B1F",
            color: "#0E0E22",
            borderRadius: "999px",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 14,
            padding: "14px 28px",
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Aller au tableau de bord
        </Link>
        <Link
          href="/"
          style={{
            background: "transparent",
            color: "#F36B1F",
            borderRadius: "999px",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 14,
            padding: "14px 28px",
            border: "1.5px solid #F36B1F",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
