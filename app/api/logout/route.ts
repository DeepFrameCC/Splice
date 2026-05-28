import { NextResponse } from "next/server";

/**
 * Custom logout endpoint that manually clears all Auth.js session cookies.
 * Auth.js v5 beta signout doesn't reliably clear cookies on Cloudflare Workers.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });

  // All possible Auth.js v5 cookie names (HTTP + HTTPS prefixed)
  const cookieNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Host-authjs.csrf-token",
    "authjs.callback-url",
    "__Secure-authjs.callback-url",
    // Legacy next-auth names (just in case)
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  for (const name of cookieNames) {
    // Clear with multiple path/domain combos to cover all cases
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    response.cookies.set(name, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  }

  return response;
}
