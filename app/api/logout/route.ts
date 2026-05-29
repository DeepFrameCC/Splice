import { NextRequest, NextResponse } from "next/server";

/**
 * Logout endpoint — clears all Auth.js cookies via raw Set-Cookie headers
 * and redirects to "/".
 *
 * response.cookies.set() does NOT add Secure flag automatically for
 * __Secure- prefixed cookies, so the browser silently ignores the clear.
 * Raw Set-Cookie headers with correct prefix attributes fix this.
 */

function clearCookiesAndRedirect(req: NextRequest) {
  const redirectUrl = new URL("/", req.url);
  const response = NextResponse.redirect(redirectUrl, { status: 302 });

  // Parse incoming cookie names
  const cookieHeader = req.headers.get("cookie") ?? "";
  const names = cookieHeader
    .split(";")
    .map((c) => {
      const trimmed = c.trim();
      const eqIdx = trimmed.indexOf("=");
      return eqIdx > 0 ? trimmed.substring(0, eqIdx) : "";
    })
    .filter((n) => n.length > 0);

  // Add known Auth.js names that might not be in incoming cookies
  const knownNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Host-authjs.csrf-token",
    "authjs.callback-url",
    "__Secure-authjs.callback-url",
  ];
  for (const kn of knownNames) {
    if (!names.includes(kn)) names.push(kn);
  }

  // Build raw Set-Cookie headers with correct attributes per prefix type
  for (const name of names) {
    const expires = "Expires=Thu, 01 Jan 1970 00:00:00 GMT";

    if (name.startsWith("__Host-")) {
      // __Host- requires: Secure; Path=/; NO Domain
      response.headers.append(
        "Set-Cookie",
        `${name}=; Path=/; ${expires}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
      );
    } else if (name.startsWith("__Secure-")) {
      // __Secure- requires: Secure
      response.headers.append(
        "Set-Cookie",
        `${name}=; Path=/; ${expires}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
      );
    } else {
      // Regular cookies
      response.headers.append(
        "Set-Cookie",
        `${name}=; Path=/; ${expires}; Max-Age=0; HttpOnly; SameSite=Lax`
      );
      // Also try with Secure in case it was set with Secure
      response.headers.append(
        "Set-Cookie",
        `${name}=; Path=/; ${expires}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
      );
    }
  }

  return response;
}

export async function GET(req: NextRequest) {
  return clearCookiesAndRedirect(req);
}

export async function POST(req: NextRequest) {
  return clearCookiesAndRedirect(req);
}
