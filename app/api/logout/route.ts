import { NextRequest, NextResponse } from "next/server";

/**
 * Debug + logout endpoint.
 * GET  → shows all cookies the browser sends (for diagnosis)
 * POST → clears all cookies and returns what was cleared
 */
export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "(vide)";
  const allCookies = req.cookies.getAll().map((c) => `${c.name}=${c.value.substring(0, 20)}...`);
  return NextResponse.json({
    rawCookieHeader: cookieHeader.substring(0, 500),
    parsedCookies: allCookies,
    count: allCookies.length,
  });
}

export async function POST(req: NextRequest) {
  const incomingCookies = req.cookies.getAll();
  const cleared: string[] = [];

  const response = NextResponse.json({
    ok: true,
    incomingCookieNames: incomingCookies.map((c) => c.name),
    cleared,
  });

  // Clear EVERY cookie the browser sent, not just known names
  for (const cookie of incomingCookies) {
    cleared.push(cookie.name);

    // Method 1: NextResponse.cookies.set with expires in the past
    response.cookies.set(cookie.name, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    // Method 2: Also try without secure flag
    response.cookies.set(cookie.name, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  }

  // Also explicitly clear known Auth.js names even if not in incoming cookies
  const knownNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Host-authjs.csrf-token",
    "authjs.callback-url",
    "__Secure-authjs.callback-url",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
  ];

  for (const name of knownNames) {
    if (!cleared.includes(name)) {
      cleared.push(name);
      response.cookies.set(name, "", {
        expires: new Date(0),
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
    }
  }

  return response;
}
