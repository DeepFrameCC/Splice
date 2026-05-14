import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED = [/^\/profil/, /^\/admin/, /^\/equipe-dashboard/];
const ADMIN_ONLY = [/^\/admin/];
const TEAM_OR_ADMIN = [/^\/admin/, /^\/equipe-dashboard/];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as any)?.role as string | undefined;

  // Auth checks
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
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https://*.supabase.co https://*.r2.dev https://utfs.io`,
    `connect-src 'self' https://api.resend.com https://api.stripe.com https://www.google.com/recaptcha/`,
    `frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com/recaptcha/`,
    `worker-src blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
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

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
