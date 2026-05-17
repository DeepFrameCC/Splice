import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Bell, CheckCheck } from "lucide-react";
import MarkAllReadButton from "@/components/dashboard/MarkAllReadButton";
import NotificationItem from "@/components/dashboard/NotificationItem";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white lg:text-4xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {notifications.length} notification{notifications.length > 1 ? "s" : ""}
            {unreadCount > 0 && ` · ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </header>

      {notifications.length === 0 ? (
        <div className="rounded-2xl bg-white/5 p-12 text-center shadow-sm ring-1 ring-white/10">
          <Bell className="mx-auto h-10 w-10 text-white/20" />
          <p className="mt-4 text-sm text-white/30">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={{
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                read: n.read,
                href: n.href,
                createdAt: n.createdAt.toISOString(),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
