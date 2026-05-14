"use server";

import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  return (session?.user as { id?: string } | undefined)?.id;
}

const updateMediaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  client: z.string().max(200).optional(),
  prixEstime: z.number().int().min(0),
  published: z.boolean(),
});

export async function updateMedia(mediaId: string, data: z.infer<typeof updateMediaSchema>) {
  const adminId = await requireAdmin();
  const validated = updateMediaSchema.parse(data);

  await db.media.update({
    where: { id: mediaId },
    data: {
      title: validated.title,
      description: validated.description || null,
      category: validated.category || null,
      client: validated.client || null,
      prixEstime: validated.prixEstime,
      published: validated.published,
    },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: mediaId,
    metadata: { type: "media_updated", title: validated.title },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}

export async function toggleMediaPublished(mediaId: string) {
  const adminId = await requireAdmin();
  const media = await db.media.findUniqueOrThrow({ where: { id: mediaId } });

  await db.media.update({
    where: { id: mediaId },
    data: { published: !media.published },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: mediaId,
    metadata: { type: "media_visibility", published: !media.published },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}

export async function deleteMedia(mediaId: string) {
  const adminId = await requireAdmin();

  // Delete likes first
  await db.like.deleteMany({ where: { mediaId } });
  await db.media.delete({ where: { id: mediaId } });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: mediaId,
    metadata: { type: "media_deleted" },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}

