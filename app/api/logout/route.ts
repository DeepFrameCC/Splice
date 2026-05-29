import { NextRequest, NextResponse } from "next/server";

/**
 * Logout via navigation (GET), not fetch.
 * Browser navigates here → cookies are cleared via Set-Cookie → redirect to "/".
 * Using GET+redirect ensures the browser processes Set-Cookie headers reliably,
 * unlike fetch() which may not apply __Secure-/__Host- prefixed cookie changes.
 */
export async function GET(req: NextRequest) {
  const redirectUrl = new URL("/", req.url);
  const response = NextResponse.redirect(redirectUrl);

  // Get all incoming cookie names
  const cookieHeader = req.headers.get("cookie") || "";
  const incomingNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter((n): n is string => typeof n === "string" && n.length > 0);

  // Clear every incoming cookie
  for (const name of incomingNames) {
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
