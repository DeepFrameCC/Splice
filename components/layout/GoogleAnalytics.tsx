"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // GA4 : G-XXXXXXX
// Conteneur Tag Manager Splice Studio. ID public (visible dans le HTML) — sûr à
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Google Analytics 4 / Tag Manager loader.
 *
 * Loads ONLY when:
 *  1. the visitor has consented to analytics (localStorage `df_consent`, the
 *     exact same gate as Plausible — see PlausibleScript / CookieBanner), AND
 *  2. an ID is configured via env (NEXT_PUBLIC_GTM_ID or NEXT_PUBLIC_GA_ID).
 *
 * Inert otherwise (renders null), so the file is safe to ship before the IDs
 * exist. GTM takes precedence when both are set (it can drive GA4 itself).
 */
export default function GoogleAnalytics() {
  if (GTM_ID) {
    return (
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    );
  }

  if (GA_ID) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
        </Script>
      </>
    );
  }

  return null;
}
