import { NextRequest, NextResponse } from "next/server";

/**
 * Logout endpoint — clears all Auth.js cookies and redirects to "/".
 *
 * Supports both GET (direct navigation / <a> link) and POST (fetch).
 * GET+redirect is preferred because the browser reliably processes
 * Set-Cookie headers on navigation responses, unlike fetch().
 */

function clearCookiesAndRedirect(req: NextRequest) {
  const redirectUrl = new URL("/", req.url);
  const response = NextResponse.redirect(redirectUrl, { status: 302 });

  const cookieHeader = req.headers.get("cookie") ?? "";
  const names = cookieHeader
    .split(";")
    .map((c) => {
      const trimmed = c.trim();
      const eqIdx = trimmed.indexOf("=");
      return eqIdx > 0 ? trimmed.substring(0, eqIdx) : "";
    })
    .filter((n) => n.length > 0);

  // Clear every incoming cookie
  for (const name of names) {
    response.cookies.set(name, "", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
  }

  // Also explicitly clear known Auth.js cookie names
  const knownNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Host-authjs.csrf-token",
    "authjs.callback-url",
    "__Secure-authjs.callback-url",
  ];

  for (const name of knownNames) {
    response.cookies.set(name, "", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
  }

  return response;
}

export async function GET(req: NextRequest) {
  return clearCookiesAndRedirect(req);
}

export async function POST(req: NextRequest) {
  return clearCookiesAndRedirect(req);
}
