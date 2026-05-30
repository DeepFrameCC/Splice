import type { Metadata } from "next";
import localFont from "next/font/local";
import ToasterClient from "@/components/layout/ToasterClient";
import CookieBanner from "@/components/layout/CookieBanner";
import PlausibleScript from "@/components/layout/PlausibleScript";
import JsonLd from "@/components/JsonLd";
import { buildWebSiteJsonLd, buildLocalBusinessJsonLd, BASE_URL } from "@/lib/seo";
import "./globals.css";
import "./prototype-styles.css";

const display = localFont({
  src: "../public/fonts/Anton-Regular.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

const sans = localFont({
  src: [
    { path: "../public/fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Poppins-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Poppins-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Splice — Production audiovisuelle · Orléans & Tours",
    template: "%s | Splice",
  },
  description:
    "Boîte de production audiovisuelle basée à Orléans et Tours. Pubs réseaux sociaux, shootings automobile, films de marque, aftermovies. Devis en ligne.",
  keywords: [
    "production audiovisuelle", "vidéaste", "Orléans", "Tours",
    "pub réseaux sociaux", "shooting automobile", "film de marque", "aftermovie",
  ],
  authors: [{ name: "Splice" }],
  creator: "Splice",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Splice",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Splice — Production audiovisuelle · Orléans & Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: "/logo-1.svg",
    apple: "/logo-1.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Splice",
  url: BASE_URL,
  logo: `${BASE_URL}/logo-1.svg`,
  description:
    "Boite de production audiovisuelle basee a Orleans et Tours. Pubs reseaux sociaux, shootings automobile, films de marque, aftermovies.",
  email: "contact.splicestudio@gmail.com",
  areaServed: {
    "@type": "Place",
    name: "Centre-Val de Loire, France",
  },
  sameAs: [
    "https://www.instagram.com/splice.cc/",
    "https://www.facebook.com/Splicecc/",
    "https://instagram.com/by.louisia",
    "https://instagram.com/t.y97one",
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <head>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            jsonLd,
            ...[buildWebSiteJsonLd(), buildLocalBusinessJsonLd()].map(
              ({ "@context": _, ...rest }) => rest
            ),
          ],
        }} inHead />
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
