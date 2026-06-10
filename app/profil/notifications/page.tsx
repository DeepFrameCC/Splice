import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Bell } from "lucide-react";
import MarkAllReadButton from "@/components/dashboard/MarkAllReadButton";
import NotificationItem from "@/components/dashboard/NotificationItem";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={
          notifications.length > 0
            ? `${notifications.length} notification${notifications.length > 1 ? "s" : ""}${unreadCount > 0 ? ` · ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : ""}`
            : undefined
        }
        action={unreadCount > 0 ? <MarkAllReadButton /> : undefined}
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Aucune notification"
          description="Tu seras prévenu ici à chaque étape : validation de devis, paiement reçu, contrat prêt, ou livraison de tes fichiers."
        />
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
