"use server";

import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  return session?.user?.id;
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

const createMediaSchema = z.object({
  type: z.enum(["PHOTO", "VIDEO"]),
  url: z.string().min(1).max(2000),
  thumbnailUrl: z.string().max(2000).optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  client: z.string().max(200).optional(),
  owner: z.enum(["LOUISIA", "TY"]),
  prixEstime: z.number().int().min(0),
  published: z.boolean(),
  groupKey: z.string().max(100).optional(),
  groupOrder: z.number().int().min(0).optional(),
});

export async function createMedia(data: z.infer<typeof createMediaSchema>) {
  const adminId = await requireAdmin();
  const validated = createMediaSchema.parse(data);

  const media = await db.media.create({
    data: {
      type: validated.type,
      url: validated.url,
      thumbnailUrl: validated.thumbnailUrl || null,
      title: validated.title,
      description: validated.description || null,
      category: validated.category || null,
      client: validated.client || null,
      owner: validated.owner,
      prixEstime: validated.prixEstime,
      published: validated.published,
      groupKey: validated.groupKey || null,
      groupOrder: validated.groupOrder ?? null,
    },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: media.id,
    metadata: { type: "media_created", title: validated.title },
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

/* ── Group management ─────────────────────────────────────── */

const addToGroupSchema = z.object({
  mediaId: z.string().min(1),
  groupKey: z.string().min(1).max(100),
  groupOrder: z.number().int().min(0),
});

export async function addMediaToGroup(data: z.infer<typeof addToGroupSchema>) {
  const adminId = await requireAdmin();
  const validated = addToGroupSchema.parse(data);

  await db.media.update({
    where: { id: validated.mediaId },
    data: {
      groupKey: validated.groupKey,
      groupOrder: validated.groupOrder,
    },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: validated.mediaId,
    metadata: { type: "media_added_to_group", groupKey: validated.groupKey, groupOrder: validated.groupOrder },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}

export async function removeMediaFromGroup(mediaId: string) {
  const adminId = await requireAdmin();

  await db.media.update({
    where: { id: mediaId },
    data: { groupKey: null, groupOrder: null },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: mediaId,
    metadata: { type: "media_removed_from_group" },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}

const renameGroupSchema = z.object({
  oldGroupKey: z.string().min(1),
  newGroupKey: z.string().min(1).max(100),
});

export async function renameGroup(data: z.infer<typeof renameGroupSchema>) {
  const adminId = await requireAdmin();
  const validated = renameGroupSchema.parse(data);

  const result = await db.media.updateMany({
    where: { groupKey: validated.oldGroupKey },
    data: { groupKey: validated.newGroupKey },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: validated.oldGroupKey,
    metadata: { type: "group_renamed", newGroupKey: validated.newGroupKey, count: result.count },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}

export async function dissolveGroup(groupKey: string) {
  const adminId = await requireAdmin();

  const result = await db.media.updateMany({
    where: { groupKey },
    data: { groupKey: null, groupOrder: null },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: groupKey,
    metadata: { type: "group_dissolved", count: result.count },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}

/* ── Inline description update ───────────────────────────── */

export async function updateMediaDescription(mediaId: string, description: string | null) {
  const adminId = await requireAdmin();

  const trimmed = description?.trim() || null;
  if (trimmed && trimmed.length > 1000) throw new Error("Description trop longue (max 1000 caractères)");

  await db.media.update({
    where: { id: mediaId },
    data: { description: trimmed },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: mediaId,
    metadata: { type: "media_description_updated", description: trimmed?.slice(0, 100) },
  });

  revalidatePath("/admin/medias");
  revalidatePath("/galerie");
  revalidatePath("/photos");
}
