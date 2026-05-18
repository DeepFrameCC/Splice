"use client";

import { useTransition } from "react";
import Link from "next/link";
import { markNotificationRead } from "@/app/actions/notifications";
import {
  FileText,
  Receipt,
  FileSignature,
  CreditCard,
  Info,
  Eye,
} from "lucide-react";
import type { NotificationType } from "@prisma/client";

const TYPE_CONFIG: Record<NotificationType, { icon: typeof FileText; color: string; bg: string }> = {
  DEVIS_STATUS: { icon: FileText, color: "text-df-gold", bg: "bg-df-gold/10" },
  FACTURE_EMISE: { icon: Receipt, color: "text-df-gold", bg: "bg-df-gold/10" },
  CONTRAT_SIGNE: { icon: FileSignature, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  PAYMENT_CONFIRM: { icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  SYSTEM: { icon: Info, color: "text-white/50", bg: "bg-df-surface" },
};

type Props = {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    href: string | null;
    createdAt: string;
  };
};

export default function NotificationItem({ notification: n }: Props) {
  const [pending, startTransition] = useTransition();
  const config = TYPE_CONFIG[n.type as NotificationType] ?? TYPE_CONFIG.SYSTEM;
  const Icon = config.icon;

  function handleMarkRead() {
    if (!n.read) {
      startTransition(() => markNotificationRead(n.id));
    }
  }

  return (
    <div
      className={`rounded-2xl bg-df-surface p-4 shadow-sm ring-1 transition hover:shadow-md ${
        n.read ? "ring-white/[0.06]" : "ring-df-gold/15 bg-df-gold/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-df-gold" />}
            <p className="text-sm font-bold text-white">{n.title}</p>
          </div>
          <p className="mt-1 text-sm text-white/50">{n.message}</p>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-xs text-white/20">
              {new Date(n.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!n.read && (
              <button
                onClick={handleMarkRead}
                disabled={pending}
                className="text-xs font-medium text-df-gold hover:underline"
              >
                Marquer comme lu
              </button>
            )}
            {n.href && (
              <Link
                href={n.href}
                onClick={handleMarkRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-df-gold hover:underline"
              >
                <Eye className="h-3 w-3" /> Voir
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
