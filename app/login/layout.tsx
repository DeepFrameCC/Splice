import type { Metadata } from "next";

// Page fonctionnelle (contenu mince) — exclue de l'index.
export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace client Splice Studio.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
