"use client";

import { useTransition } from "react";
import { markAllNotificationsRead } from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

export default function MarkAllReadButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => markAllNotificationsRead())}
    >
      <CheckCheck className="mr-1.5 h-4 w-4" />
      {pending ? "Traitement…" : "Tout marquer comme lu"}
    </Button>
  );
}
