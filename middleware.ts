import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED = [/^\/profil/, /^\/devis/, /^\/admin/];
const ADMIN_ONLY = [/^\/admin/];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => p.test(pathname));
  if (!isProtected) return NextResponse.next();

  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const isAdmin = (req.auth.user as any)?.role === "ADMIN";
  if (ADMIN_ONLY.some((p) => p.test(pathname)) && !isAdmin) {
    return NextResponse.redirect(new URL("/profil", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
