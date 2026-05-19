"use server";

import { auth, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/audit";
import { z } from "zod";

async function requireAdmin(): Promise<string> {
  const session = await auth();
  const role = session?.user?.role;
  if (!isAdmin(role)) throw new Error("FORBIDDEN");
  const id = session?.user?.id;
  if (!id) throw new Error("FORBIDDEN");
  return id;
}

// ─── Service form schema ──────────────────────────────────────────

export const serviceFormSchema = z.object({
  name: z.string().min(2),
  shortName: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug invalide"),
  metaTitle: z.string().min(2),
  metaDescription: z.string().min(2),
  h1: z.string().min(2),
  introParagraph: z.string().min(10),
  problemQuestion: z.string().min(2),
  problemAnswer: z.string().min(10),
  serviceType: z.string().min(1),
  priceRange: z.string().default("$$$"),
  coverImageUrl: z.string().default(""),
  coverImageAlt: z.string().default(""),
  videoUrl: z.string().optional(),
  category: z.enum(["video", "photo", "motion", "audio"]),
  sortOrder: z.number().int().default(0),
  iconName: z.string().optional(),
  zoneText: z.string().optional(),
  isPublished: z.boolean().default(true),
});

// ─── Toggle publish ───────────────────────────────────────────────

export async function publishService(serviceId: string) {
  const adminId = await requireAdmin();

  const service = await db.service.update({
    where: { id: serviceId },
    data: { isPublished: true },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: serviceId,
    metadata: { type: "service_published", name: service.name },
  });

  revalidatePath("/services");
  revalidatePath(`/services/${service.slug}`);
  revalidatePath("/admin/services");
}

export async function unpublishService(serviceId: string) {
  const adminId = await requireAdmin();

  const service = await db.service.update({
    where: { id: serviceId },
    data: { isPublished: false },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: serviceId,
    metadata: { type: "service_unpublished", name: service.name },
  });

  revalidatePath("/services");
  revalidatePath(`/services/${service.slug}`);
  revalidatePath("/admin/services");
}

// ─── Update service ───────────────────────────────────────────────

export async function updateService(
  serviceId: string,
  formData: z.infer<typeof serviceFormSchema>,
) {
  const adminId = await requireAdmin();
  const data = serviceFormSchema.parse(formData);

  const service = await db.service.update({
    where: { id: serviceId },
    data: {
      name: data.name,
      shortName: data.shortName,
      slug: data.slug,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      h1: data.h1,
      introParagraph: data.introParagraph,
      problemQuestion: data.problemQuestion,
      problemAnswer: data.problemAnswer,
      serviceType: data.serviceType,
      priceRange: data.priceRange,
      coverImageUrl: data.coverImageUrl,
      coverImageAlt: data.coverImageAlt,
      videoUrl: data.videoUrl || null,
      category: data.category,
      sortOrder: data.sortOrder,
      iconName: data.iconName || null,
      zoneText: data.zoneText || null,
      isPublished: data.isPublished,
    },
  });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: service.id,
    metadata: { type: "service_updated", name: service.name },
  });

  revalidatePath("/services");
  revalidatePath(`/services/${service.slug}`);
  revalidatePath("/admin/services");

  return { id: service.id, slug: service.slug };
}

// ─── Delete service ───────────────────────────────────────────────

export async function deleteService(serviceId: string) {
  const adminId = await requireAdmin();

  const service = await db.service.delete({ where: { id: serviceId } });

  await audit({
    action: "ADMIN_ACTION",
    userId: adminId,
    target: serviceId,
    metadata: { type: "service_deleted", name: service.name },
  });

  revalidatePath("/services");
  revalidatePath("/admin/services");
}
