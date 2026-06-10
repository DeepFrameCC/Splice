"use client";

import { usePathname, useRouter } from "next/navigation";

type Item = { href: string; label: string };

/**
 * Nav mobile de l'admin. Remplace les 14 pills en scroll horizontal (IA
 * illisible) par un select natif : compact, accessible, état courant visible.
 */
export default function AdminMobileNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const router = useRouter();

  // Plus long préfixe correspondant = section active (gère les sous-routes).
  const current =
    items
      .filter((i) => (i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href)))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? "/admin";

  return (
    <label className="block">
      <span className="sr-only">Naviguer dans l&apos;administration</span>
      <select
        value={current}
        onChange={(e) => router.push(e.target.value)}
        className="w-full rounded-xl bg-df-surface px-4 py-3 text-sm font-bold text-white ring-1 ring-white/[0.08] focus:outline-none focus:ring-2 focus:ring-df-gold"
      >
        {items.map((i) => (
          <option key={i.href} value={i.href}>
            {i.label}
          </option>
        ))}
      </select>
    </label>
  );
}
