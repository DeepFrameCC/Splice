"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Bell } from "lucide-react";
import { getUnreadCount, markNotificationRead } from "@/app/actions/notifications";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  href: string | null;
  createdAt: string;
};

export default function NotificationBell({ initialCount, recentNotifications }: { initialCount: number; recentNotifications: Notification[] }) {
  const [count, setCount] = useState(initialCount);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Poll for new notifications every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const c = await getUnreadCount();
        setCount(c);
      } catch {}
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
      setCount((c) => Math.max(0, c - 1));
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-xl p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
        aria-label={`Notifications${count > 0 ? ` (${count} non lues)` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-df-gold px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl bg-df-surface shadow-2xl shadow-black/40 ring-1 ring-white/[0.08]">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            <Link
              href="/profil/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-df-blue hover:underline"
            >
              Tout voir
            </Link>
          </div>

          {recentNotifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-df-blue/20" />
              <p className="mt-2 text-sm text-white/30">Aucune notification</p>
            </div>
          ) : (
            <div className="max-h-80 divide-y divide-white/[0.06] overflow-y-auto">
              {recentNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 transition hover:bg-white/[0.04] ${!n.read ? "bg-df-blue/[0.08]" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-df-blue" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white">{n.title}</p>
                      <p className="mt-0.5 text-xs text-white/50 line-clamp-2">{n.message}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="text-[10px] text-white/20">
                          {new Date(n.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            disabled={pending}
                            className="text-[10px] font-medium text-df-blue hover:underline"
                          >
                            Marquer lu
                          </button>
                        )}
                        {n.href && (
                          <Link
                            href={n.href}
                            onClick={() => {
                              setOpen(false);
                              if (!n.read) handleMarkRead(n.id);
                            }}
                            className="text-[10px] font-medium text-df-gold hover:underline"
                          >
                            Voir
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
