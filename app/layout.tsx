import type { Metadata } from "next";
import localFont from "next/font/local";
import ToasterClient from "@/components/layout/ToasterClient";
import CookieBanner from "@/components/layout/CookieBanner";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import AuthProvider from "@/components/layout/AuthProvider";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, buildLocalBusinessJsonLd, BASE_URL } from "@/lib/seo";
import "./globals.css";
import "./prototype-styles.css";

const display = localFont({
  src: "../public/fonts/Anton-Regular.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

const sans = localFont({
  src: [
    { path: "../public/fonts/Poppins-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Poppins-Italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/Poppins-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/Poppins-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Splice Studio — Production audiovisuelle · Orléans & Tours",
    template: "%s | Splice Studio",
  },
  description:
    "Boîte de production audiovisuelle basée à Orléans et Tours. Pubs réseaux sociaux, shootings automobile, films de marque, aftermovies. Devis en ligne.",
  authors: [{ name: "Splice Studio" }],
  creator: "Splice Studio",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Splice Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Splice Studio — Production audiovisuelle · Orléans & Tours",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* Analytics (GTM/GA4/Plausible) : chargés par GoogleAnalytics en bas
            de body, uniquement après consentement (df_consent.analytics). */}
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            buildOrganizationJsonLd(),
            buildWebSiteJsonLd(),
            buildLocalBusinessJsonLd(),
          ].map(({ "@context": _unused, ...rest }) => rest),
        }} />
      </head>
      <body className="min-h-screen flex flex-col bg-df-night text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-md focus:bg-df-blue focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline focus:outline-2 focus:outline-df-gold"
        >
          Aller au contenu
        </a>
        <AuthProvider>
          <main id="main-content" className="flex-1">{children}</main>
        </AuthProvider>
        <ToasterClient />
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
