import type { Metadata } from "next";
import { Inter, Montserrat, Poppins, JetBrains_Mono } from "next/font/google";
import ToasterClient from "@/components/layout/ToasterClient";
import "./globals.css";
import "./prototype-styles.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-display", display: "swap" });
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
    "https://instagram.com/papiforcex",
    "https://instagram.com/by.louisia",
    "https://instagram.com/t.y97one",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${montserrat.variable} ${poppins.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-df-ink antialiased">
        <main className="flex-1">{children}</main>
        <ToasterClient />
      </body>
    </html>
  );
}
