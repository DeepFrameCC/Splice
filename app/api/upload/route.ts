import { auth } from "@/lib/auth";
import { putObject, type BucketName } from "@/lib/r2/client";
import { z } from "zod";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const UploadSchema = z.object({
  bucket: z.enum(["SPLICE_CDN", "SPLICE_DELIVERIES", "SPLICE_ARCHIVE"]),
  key: z.string().min(1).max(512),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const role = (session.user as { role?: string }).role;
  if (role !== "TEAM" && role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const parsed = UploadSchema.safeParse({
    bucket: formData.get("bucket"),
    key: formData.get("key"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { bucket, key } = parsed.data;
  const cacheControl = bucket === "SPLICE_CDN"
    ? "public, max-age=31536000, immutable"
    : "private, no-store";

  await putObject(bucket as BucketName, key, await file.arrayBuffer(), {
    contentType: file.type,
    cacheControl,
  });

  return NextResponse.json({ ok: true, key });
}
