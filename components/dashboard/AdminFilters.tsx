"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback } from "react";

type Props = {
  statusOptions: { value: string; label: string }[];
  currentStatus: string;
  currentSearch: string;
};

export default function AdminFilters({ statusOptions, currentStatus, currentSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-df-blue/40" />
        <input
          type="text"
          placeholder="Rechercher…"
          defaultValue={currentSearch}
          onChange={(e) => updateParams("q", e.target.value)}
          className="w-56 rounded-xl border-2 border-df-blue/15 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-df-blue"
        />
      </div>
      <select
        value={currentStatus}
        onChange={(e) => updateParams("status", e.target.value)}
        className="rounded-xl border-2 border-df-blue/15 px-3 py-2 text-sm font-bold text-df-blue outline-none transition focus:border-df-blue"
      >
        <option value="">Tous</option>
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
