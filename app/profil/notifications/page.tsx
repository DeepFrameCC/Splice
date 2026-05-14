import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Bell, CheckCheck } from "lucide-react";
import MarkAllReadButton from "@/components/dashboard/MarkAllReadButton";
import NotificationItem from "@/components/dashboard/NotificationItem";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;

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
          <h1 className="font-display text-3xl font-bold text-df-ink lg:text-4xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-df-ink/50">
            {notifications.length} notification{notifications.length > 1 ? "s" : ""}
            {unreadCount > 0 && ` · ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </header>

      {notifications.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-df-blue/10">
          <Bell className="mx-auto h-10 w-10 text-df-blue/20" />
          <p className="mt-4 text-sm text-df-ink/40">Aucune notification pour le moment.</p>
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
