"use client";

import { useTransition, useState } from "react";

interface Props {
  token: string;
  action: (token: string) => Promise<void>;
}

export default function VerifyEmailForm({ token, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (loading || pending) return;
        setLoading(true);
        startTransition(async () => {
          try {
            await action(token);
          } finally {
            setLoading(false);
          }
        });
      }}
      className="mt-6"
    >
      <button
        type="submit"
        disabled={pending || loading}
        className="inline-flex rounded-xl bg-df-blue px-6 py-3 text-sm font-bold text-white shadow-lg shadow-df-blue/25 transition hover:bg-df-blue/90 disabled:opacity-60"
      >
        {pending || loading ? "Vérification..." : "Confirmer mon email"}
      </button>
    </form>
  );
}
