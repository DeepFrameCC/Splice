import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED = [/^\/profil/, /^\/devis/, /^\/admin/];
const ADMIN_ONLY = [/^\/admin/];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Auth checks
  const isProtected = PROTECTED.some((p) => p.test(pathname));
  if (isProtected && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isProtected) {
    const isAdmin = (req.auth?.user as any)?.role === "ADMIN";
    if (ADMIN_ONLY.some((p) => p.test(pathname)) && !isAdmin) {
      return NextResponse.redirect(new URL("/profil", req.nextUrl));
    }
  }

  // CSP with dynamic nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https://*.supabase.co https://*.r2.dev https://utfs.io`,
    `connect-src 'self' https://api.resend.com https://api.stripe.com`,
    `frame-src https://js.stripe.com https://hooks.stripe.com`,
    `worker-src blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
  ].join("; ");

  const res = NextResponse.next({
    request: { headers: new Headers(req.headers) },
  });

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("x-nonce", nonce);

  return res;
});

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
