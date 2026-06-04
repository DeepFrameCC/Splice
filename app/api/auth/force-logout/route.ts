import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Forced-logout endpoint used by `requireActiveUser` when a session points to a
 * user that no longer exists (deleted) or was anonymised. Clears the Auth.js
 * cookies and bounces to /login. Stateless JWT → dropping the cookie is enough.
 *
 * Cookies are written on the redirect response itself so the deletion is
 * guaranteed to reach the browser.
 */
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/login?reason=compte_supprime", req.url));
  const isProd = process.env.NODE_ENV === "production";

  const incoming = (await cookies()).getAll();
  for (const c of incoming) {
    if (c.name.includes("authjs") || c.name.includes("next-auth")) {
      res.cookies.set(c.name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        secure: isProd,
        httpOnly: true,
        sameSite: "lax",
      });
    }
  }

  return res;
}
