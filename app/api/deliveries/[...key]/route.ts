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

  const obj = await getBucket("SPLICE_DELIVERIES").get(objectKey);
  if (!obj) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(obj.body as unknown as ReadableStream, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${objectKey.split("/").pop()}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
