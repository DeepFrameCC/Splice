import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import ToasterClient from "@/components/layout/ToasterClient";
import CookieBanner from "@/components/layout/CookieBanner";
import PlausibleScript from "@/components/layout/PlausibleScript";
import "./globals.css";
import "./prototype-styles.css";

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc"),
  title: {
    default: "Deepframe — Production audiovisuelle · Orléans & Tours",
    template: "%s | Deepframe",
  },
  description:
    "Boîte de production audiovisuelle basée à Orléans et Tours. Pubs réseaux sociaux, shootings automobile, films de marque, aftermovies. Devis en ligne.",
  keywords: [
    "production audiovisuelle", "vidéaste", "Orléans", "Tours",
    "pub réseaux sociaux", "shooting automobile", "film de marque", "aftermovie",
  ],
  authors: [{ name: "Deepframe" }],
  creator: "Deepframe",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Deepframe",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Deepframe — Production audiovisuelle" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: { icon: "/logo.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DeepFrame",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc",
  logo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc"}/logo.svg`,
  description:
    "Boite de production audiovisuelle basee a Orleans et Tours. Pubs reseaux sociaux, shootings automobile, films de marque, aftermovies.",
  email: "contact@deepframe.cc",
  areaServed: {
    "@type": "Place",
    name: "Centre-Val de Loire, France",
  },
  sameAs: [
    "https://www.instagram.com/deepframe.cc/",
    "https://www.facebook.com/profile.php?id=61589292522120",
    "https://instagram.com/papiforcex",
    "https://instagram.com/by.louisia",
    "https://instagram.com/t.y97one",
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} ${jetbrains.variable}`}>
      <head>
        <script
          nonce={nonce}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-df-night text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-md focus:bg-df-blue focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline focus:outline-2 focus:outline-df-gold"
        >
          Aller au contenu
        </a>
        <main id="main-content" className="flex-1">{children}</main>
        <ToasterClient />
        <CookieBanner />
        <PlausibleScript />
      </body>
    </html>
  );
}
