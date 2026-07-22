import type { Metadata } from "next";
import localFont from "next/font/local";
import ToasterClient from "@/components/layout/ToasterClient";
import CookieBanner from "@/components/layout/CookieBanner";
import MaintenanceOverlay from "@/components/layout/MaintenanceOverlay";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import AuthProvider from "@/components/layout/AuthProvider";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, buildLocalBusinessJsonLd, BASE_URL } from "@/lib/seo";
import { getAvisAggregate } from "@/lib/avis-stats";
import "./globals.css";
import "./prototype-styles.css";

const display = localFont({
  src: "../public/fonts/Outfit-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
});

const sans = localFont({
  src: "../public/fonts/Outfit-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Agence Vidéo & Photographe à Orléans — Splice Studio",
    template: "%s | Splice Studio",
  },
  description:
    "Splice Studio, agence de production vidéo et photo à Orléans et Tours. Vidéaste, motion design, reels pour entreprises. Devis en ligne gratuit.",
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
    // Pas de compte @X officiel pour l'instant — décommenter quand créé :
    // site: "@splicestudio",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: "/logo-1.svg",
    apple: "/logo-1.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Note moyenne des avis — mise en cache (TTL 1h) pour ne pas rendre toutes les
  // pages dynamiques. Alimente l'aggregateRating sitewide du LocalBusiness.
  const avisRating = await getAvisAggregate();
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
            buildLocalBusinessJsonLd(avisRating),
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
        <MaintenanceOverlay />
        <ToasterClient />
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
