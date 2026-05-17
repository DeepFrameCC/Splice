"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function BlogAdminFAB() {
  return (
    <Link
      href="/admin/blog/nouveau"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-df-gold text-white shadow-lg transition hover:scale-110 hover:shadow-xl"
      aria-label="Nouvel article"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
}
