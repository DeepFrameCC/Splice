"use server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleLike(mediaId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("UNAUTHORIZED");

  const existing = await db.like.findUnique({ where: { userId_mediaId: { userId, mediaId } } });
  if (existing) {
    await db.like.delete({ where: { userId_mediaId: { userId, mediaId } } });
    revalidatePath("/photos"); revalidatePath("/videos"); revalidatePath("/profil/likes");
    return { liked: false };
  }
  await db.like.create({ data: { userId, mediaId } });
  revalidatePath("/photos"); revalidatePath("/videos"); revalidatePath("/profil/likes");
  return { liked: true };
}
