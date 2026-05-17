"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("NON_AUTHENTIFIE");
  return userId;
}

export async function getUnreadCount(): Promise<number> {
  const userId = await requireAuth();
  return db.notification.count({ where: { userId, read: false } });
}

export async function markNotificationRead(notificationId: string) {
  const userId = await requireAuth();
  await db.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
  revalidatePath("/profil/notifications");
}

export async function markAllNotificationsRead() {
  const userId = await requireAuth();
  await db.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  revalidatePath("/profil/notifications");
}
