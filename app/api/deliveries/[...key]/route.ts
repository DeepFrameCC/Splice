import { auth } from "@/lib/auth";
import { getBucket } from "@/lib/r2/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const { key } = await params;
  const objectKey = key.join("/");

  // Ownership check (anti-IDOR) : les clés de livraison sont préfixées par
  // l'identifiant du client propriétaire (`{userId}/...`). Un CLIENT ne peut
  // télécharger que ses propres livrables ; TEAM/ADMIN ont accès à tout.
  // 404 (et non 403) pour ne pas révéler l'existence d'un objet.
  const role = (session.user as { role?: string }).role;
  const userId = session.user.id;
  const isStaff = role === "ADMIN" || role === "TEAM";
  if (!isStaff && (!userId || !objectKey.startsWith(`${userId}/`))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const obj = await getBucket("SPLICE_DELIVERIES").get(objectKey);
  if (!obj) return new NextResponse("Not found", { status: 404 });

  // Neutralise toute injection dans l'en-tête Content-Disposition
  // (guillemets / caractères de contrôle issus du segment d'URL décodé).
  const rawName = objectKey.split("/").pop() ?? "fichier";
  const safeName = rawName.replace(/["\\\r\n]/g, "_").replace(/[^\x20-\x7E]/g, "_") || "fichier";

  return new NextResponse(obj.body as unknown as ReadableStream, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
