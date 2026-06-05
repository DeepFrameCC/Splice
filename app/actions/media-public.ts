"use server";

import { db } from "@/lib/db";

export async function getPublishedMediaCount(): Promise<number> {
  try {
    return await db.media.count({
      where: {
        published: true,
      },
    });
  } catch (error) {
    console.error("Error fetching published media count:", error);
    // Return a sensible fallback or 0
    return 0;
  }
}
