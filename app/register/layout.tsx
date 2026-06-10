import type { Metadata } from "next";

// Page fonctionnelle (contenu mince) — exclue de l'index.
export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte client Splice Studio pour demander un devis et suivre vos projets.",
  robots: { index: false, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
