import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Read incoming cookies from the request header directly
  const cookieHeader = req.headers.get("cookie") || "";
  const incomingNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0] ?? "")
    .filter((n): n is string => n.length > 0);

  const response = NextResponse.json({ ok: true, incoming: incomingNames });

  // Clear __Host- prefixed cookies (require secure + path=/ + NO domain)
  for (const name of incomingNames.filter((n) => n.startsWith("__Host-"))) {
    response.headers.append(
      "Set-Cookie",
      `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
    );
  }

  // Clear __Secure- prefixed cookies (require secure)
  for (const name of incomingNames.filter((n) => n.startsWith("__Secure-"))) {
    response.headers.append(
      "Set-Cookie",
      `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
    );
  }

  // Clear non-prefixed cookies
  for (const name of incomingNames.filter((n) => !n.startsWith("__"))) {
    response.headers.append(
      "Set-Cookie",
      `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
    );
  }

  // Also explicitly clear known Auth.js names with raw Set-Cookie headers
  const explicit = [
    `__Secure-authjs.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`,
    `__Host-authjs.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`,
    `__Secure-authjs.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`,
    `authjs.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
    `authjs.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
    `authjs.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
  ];

  for (const header of explicit) {
    response.headers.append("Set-Cookie", header);
  }

  return response;
}
