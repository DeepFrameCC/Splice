import { db } from "@/lib/db";
import type { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
}

/** Fire-and-forget notification creation */
export async function notify(input: CreateNotificationInput): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        href: input.href ?? null,
      },
    });
  } catch (e) {
    // Fire-and-forget: don't break business flow
    console.error("[notify] Failed to create notification:", e);
  }
}
