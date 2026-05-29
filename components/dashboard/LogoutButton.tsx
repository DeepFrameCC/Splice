"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="h-3 w-3" />
        Déconnexion
      </button>
    </form>
  );
}
