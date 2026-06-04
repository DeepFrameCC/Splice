import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED = [/^\/profil/, /^\/admin/, /^\/equipe-dashboard/];
const ADMIN_ONLY = [/^\/admin/];
const TEAM_OR_ADMIN = [/^\/admin/, /^\/equipe-dashboard/];

// Private API endpoints — must not be indexed even if URLs leak.
// /api/stripe/webhook is intentionally excluded: only Stripe's servers should reach it.
const PRIVATE_API = [
  /^\/api\/devis\//,
  /^\/api\/facture\//,
  /^\/api\/stripe\/checkout/,
  /^\/api\/auth\//,
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as any)?.role as string | undefined;

  // API routes: only add noindex hint, skip CSP/nonce injection.
  // CSP is meaningless on JSON responses and the nonce would never be consumed.
  if (pathname.startsWith("/api/")) {
    const apiRes = NextResponse.next({ request: { headers: new Headers(req.headers) } });
    if (PRIVATE_API.some((p) => p.test(pathname))) {
      apiRes.headers.set("X-Robots-Tag", "noindex, nofollow");
      apiRes.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      apiRes.headers.set("Pragma", "no-cache");
      apiRes.headers.set("Expires", "0");
    }
    return apiRes;
  }

  // Auth checks (HTML routes)
  const isProtected = PROTECTED.some((p) => p.test(pathname));
  if (isProtected && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isProtected) {
    if (ADMIN_ONLY.some((p) => p.test(pathname)) && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/profil", req.nextUrl));
    }
    if (TEAM_OR_ADMIN.some((p) => p.test(pathname)) && role !== "ADMIN" && role !== "TEAM") {
      return NextResponse.redirect(new URL("/profil", req.nextUrl));
    }
  }

  // CSP with dynamic nonce
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";

  // Prevent dynamic nonce cache conflicts on purely static/public display routes
  const isStaticRoute =
    pathname === "/" ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/agence-communication-orleans") ||
    pathname.startsWith("/photographe-evenementiel") ||
    pathname.startsWith("/galerie") ||
    pathname.startsWith("/equipe") ||
    pathname.startsWith("/mentions-legales") ||
    pathname.startsWith("/confidentialite") ||
    pathname.startsWith("/cookies") ||
    pathname.startsWith("/tarifs") ||
    pathname.startsWith("/avis");

  const scriptSrc = isStaticRoute
    ? `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com https://challenges.cloudflare.com https://plausible.io https://www.googletagmanager.com https://*.sentry.io`
    : `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com https://challenges.cloudflare.com https://plausible.io https://www.googletagmanager.com https://*.sentry.io`;

  const csp = [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https://*.r2.dev https://cdn.splicestudio.fr https://media.splicestudio.fr https://www.google-analytics.com`,
    `media-src 'self' https://media.splicestudio.fr`,
    `connect-src 'self' https://api.resend.com https://api.stripe.com https://challenges.cloudflare.com https://plausible.io https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.sentry.io`,
    `frame-src https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com`,
    `worker-src blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(isDev ? [] : [`upgrade-insecure-requests`]),
  ].join("; ");

  const res = NextResponse.next({
    request: { headers: new Headers(req.headers) },
  });

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("x-nonce", nonce);

  // Prevent indexing of protected pages
  if (isProtected) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
});

// Cover HTML routes and private API endpoints. Skip _next internals and static assets.
export const config = {
  matcher: [
    "/((?!monitoring|_next/static|_next/image|favicon.ico|logo.svg|og-image.jpg|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|mp4|webm|woff|woff2|ttf)).*)",
  ],
};
