import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { audit } from "@/lib/audit";

/**
 * Logout endpoint — clears all Auth.js cookies via raw Set-Cookie headers
 * and redirects to "/".
 *
 * This is the canonical logout path (LogoutButton hard-navigates here).
 * Clearing cookies through `cookies()` inside a Server Action proved
 * unreliable on Cloudflare Workers for `__Secure-` prefixed cookies: the
 * deletion never reached the browser and the session survived. Raw
 * Set-Cookie headers on a 302 response are applied unconditionally.
 */

function isPrefetch(req: NextRequest) {
  // Chrome speculative loads (address-bar prefetch) must not log the user out.
  const purpose = req.headers.get("sec-purpose") ?? req.headers.get("purpose") ?? "";
  return purpose.includes("prefetch");
}

function isCrossSite(req: NextRequest) {
  // Logout CSRF guard: refuse cookie clearing triggered from another site.
  // "same-origin" = in-app navigation, "none" = typed URL / bookmark.
  const site = req.headers.get("sec-fetch-site");
  return site !== null && site !== "same-origin" && site !== "none";
}

async function clearCookiesAndRedirect(req: NextRequest) {
  if (isPrefetch(req)) return new NextResponse(null, { status: 204 });
  if (isCrossSite(req)) return NextResponse.redirect(new URL("/", req.url), { status: 302 });

  // Audit before the session is dropped (best effort, never blocks logout).
  try {
    const session = await auth();
    if (session?.user?.id) await audit({ action: "LOGOUT", userId: session.user.id });
  } catch (err) {
    console.error("[logout] audit failed", err);
  }

  const redirectUrl = new URL("/", req.url);
  const response = NextResponse.redirect(redirectUrl, { status: 302 });

  // Parse incoming cookie names (covers chunked cookies like *.session-token.0)
  const cookieHeader = req.headers.get("cookie") ?? "";
  const names = cookieHeader
    .split(";")
    .map((c) => {
      const trimmed = c.trim();
      const eqIdx = trimmed.indexOf("=");
      return eqIdx > 0 ? trimmed.substring(0, eqIdx) : "";
    })
    .filter((n) => n.length > 0 && (n.includes("authjs") || n.includes("next-auth")));

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
