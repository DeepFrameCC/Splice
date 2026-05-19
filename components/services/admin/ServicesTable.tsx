"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { publishService, unpublishService, deleteService } from "@/app/actions/admin-services";
import { useState, useTransition } from "react";

interface ServiceRow {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

interface ServicesTableProps {
  services: ServiceRow[];
}

const CATEGORY_LABELS: Record<string, string> = {
  video: "Vidéo",
  photo: "Photo",
  motion: "Motion",
  audio: "Audio",
};

export default function ServicesTable({ services }: ServicesTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: () => Promise<void>) => {
    setOpenMenu(null);
    startTransition(async () => {
      await action();
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-df-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.04]">
            <th className="px-4 py-3 text-left font-bold text-white/50">Service</th>
            <th className="hidden px-4 py-3 text-left font-bold text-white/50 md:table-cell">Catégorie</th>
            <th className="hidden px-4 py-3 text-left font-bold text-white/50 md:table-cell">Statut</th>
            <th className="hidden px-4 py-3 text-left font-bold text-white/50 lg:table-cell">Ordre</th>
            <th className="hidden px-4 py-3 text-left font-bold text-white/50 md:table-cell">Modifié</th>
            <th className="px-4 py-3 text-right font-bold text-white/50">Actions</th>
          </tr>
        </thead>
        <tbody className={isPending ? "opacity-50" : ""}>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-white/[0.06] last:border-0 hover:bg-df-cream/20 transition">
              <td className="px-4 py-3">
                <div>
                  <p className="font-bold text-white line-clamp-1">{service.name}</p>
                  <p className="text-xs text-white/40 line-clamp-1">/services/{service.slug}</p>
                  <div className="mt-1 flex items-center gap-2 md:hidden">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      service.isPublished
                        ? "bg-green-500/10 text-green-400"
                        : "bg-white/10 text-white/50"
                    }`}>
                      {service.isPublished ? "Publié" : "Masqué"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70">
                  {CATEGORY_LABELS[service.category] ?? service.category}
                </span>
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  service.isPublished
                    ? "bg-green-500/10 text-green-400"
                    : "bg-white/10 text-white/50"
                }`}>
                  {service.isPublished ? "Publié" : "Masqué"}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-white/60 lg:table-cell">
                {service.sortOrder}
              </td>
              <td className="hidden px-4 py-3 text-white/60 md:table-cell">
                {new Date(service.updatedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <div className="relative flex items-center justify-end gap-1">
                  {service.isPublished && (
                    <Link
                      href={`/services/${service.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] hover:text-white transition"
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/services/${service.id}/modifier`}
                    className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] hover:text-white transition"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => setOpenMenu(openMenu === service.id ? null : service.id)}
                    className="rounded-lg p-2 text-white/40 hover:bg-white/[0.06] hover:text-white transition"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {openMenu === service.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-white/[0.08] bg-df-surface p-1 shadow-lg">
                      {service.isPublished ? (
                        <button
                          onClick={() => handleAction(() => unpublishService(service.id))}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-amber-400 hover:bg-amber-500/10 transition"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          Masquer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(() => publishService(service.id))}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-green-400 hover:bg-green-500/10 transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Publier
                        </button>
                      )}
                      <div className="my-1 border-t border-white/[0.08]" />
                      <button
                        onClick={() => {
                          if (window.confirm("Supprimer définitivement ce service ?")) {
                            handleAction(() => deleteService(service.id));
                          } else {
                            setOpenMenu(null);
                          }
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {services.length === 0 && (
        <div className="p-12 text-center text-white/40">
          Aucun service trouvé.
        </div>
      )}
    </div>
  );
}
