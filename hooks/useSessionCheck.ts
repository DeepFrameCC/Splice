"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Periodically checks if the user session is still valid.
 * Redirects to login with a toast if the session has expired.
 */
export function useSessionCheck() {
  const router = useRouter();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!data?.user) {
        toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        router.push("/login");
      }
    } catch {
      // Network error — skip silently
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(checkSession, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkSession]);
}
