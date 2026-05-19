"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateService } from "@/app/actions/admin-services";

interface ServiceFormData {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introParagraph: string;
  problemQuestion: string;
  problemAnswer: string;
  serviceType: string;
  priceRange: string;
  coverImageUrl: string;
  coverImageAlt: string;
  videoUrl: string;
  category: string;
  sortOrder: number;
  iconName: string;
  zoneText: string;
  isPublished: boolean;
}

interface ServiceFormProps {
  initialData: ServiceFormData;
}

const CATEGORIES = [
  { value: "video", label: "Vidéo" },
  { value: "photo", label: "Photo" },
  { value: "motion", label: "Motion" },
  { value: "audio", label: "Audio" },
];

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialData);
  const [error, setError] = useState("");

  const update = (field: keyof ServiceFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await updateService(form.id, {
          name: form.name,
          shortName: form.shortName,
          slug: form.slug,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          h1: form.h1,
          introParagraph: form.introParagraph,
          problemQuestion: form.problemQuestion,
          problemAnswer: form.problemAnswer,
          serviceType: form.serviceType,
          priceRange: form.priceRange,
          coverImageUrl: form.coverImageUrl,
          coverImageAlt: form.coverImageAlt,
          videoUrl: form.videoUrl || undefined,
          category: form.category as "video" | "photo" | "motion" | "audio",
          sortOrder: form.sortOrder,
          iconName: form.iconName || undefined,
          zoneText: form.zoneText || undefined,
          isPublished: form.isPublished,
        });
        router.push("/admin/services");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inattendue");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Identité */}
      <fieldset className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <legend className="text-sm font-bold uppercase tracking-widest text-df-gold">Identité</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet" value={form.name} onChange={(v) => update("name", v)} />
          <Field label="Nom court" value={form.shortName} onChange={(v) => update("shortName", v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
          <div>
            <label className="mb-1.5 block text-xs font-bold text-white/50">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-df-surface px-3 py-2.5 text-sm text-white outline-none focus:border-df-gold/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type de service" value={form.serviceType} onChange={(v) => update("serviceType", v)} />
          <Field label="Gamme de prix" value={form.priceRange} onChange={(v) => update("priceRange", v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-white/50">Ordre d&apos;affichage</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => update("sortOrder", parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-white/[0.08] bg-df-surface px-3 py-2.5 text-sm text-white outline-none focus:border-df-gold/30"
            />
          </div>
          <Field label="Icône (lucide name)" value={form.iconName} onChange={(v) => update("iconName", v)} />
        </div>
      </fieldset>

      {/* SEO */}
      <fieldset className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <legend className="text-sm font-bold uppercase tracking-widest text-df-gold">SEO</legend>
        <Field label="Meta title" value={form.metaTitle} onChange={(v) => update("metaTitle", v)} />
        <Field label="Meta description" value={form.metaDescription} onChange={(v) => update("metaDescription", v)} textarea />
        <Field label="H1" value={form.h1} onChange={(v) => update("h1", v)} />
      </fieldset>

      {/* Contenu */}
      <fieldset className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <legend className="text-sm font-bold uppercase tracking-widest text-df-gold">Contenu</legend>
        <Field label="Introduction" value={form.introParagraph} onChange={(v) => update("introParagraph", v)} textarea />
        <Field label="Question problématique" value={form.problemQuestion} onChange={(v) => update("problemQuestion", v)} />
        <Field label="Réponse problématique" value={form.problemAnswer} onChange={(v) => update("problemAnswer", v)} textarea />
        <Field label="Zone d'intervention" value={form.zoneText} onChange={(v) => update("zoneText", v)} textarea />
      </fieldset>

      {/* Médias */}
      <fieldset className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <legend className="text-sm font-bold uppercase tracking-widest text-df-gold">Médias</legend>
        <Field label="URL image de couverture" value={form.coverImageUrl} onChange={(v) => update("coverImageUrl", v)} />
        <Field label="Alt image de couverture" value={form.coverImageAlt} onChange={(v) => update("coverImageAlt", v)} />
        <Field label="URL vidéo (optionnel)" value={form.videoUrl} onChange={(v) => update("videoUrl", v)} />
      </fieldset>

      {/* Visibilité */}
      <fieldset className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <legend className="text-sm font-bold uppercase tracking-widest text-df-gold">Visibilité</legend>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="h-5 w-5 rounded border-white/20 bg-df-surface text-df-gold accent-df-gold"
          />
          <span className="text-sm font-bold text-white">
            {form.isPublished ? "Publié (visible sur le site)" : "Masqué (invisible pour les clients)"}
          </span>
        </label>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-df-gold px-8 py-3 text-sm font-bold text-white transition hover:bg-df-gold/90 disabled:opacity-50"
        >
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        <a
          href="/admin/services"
          className="text-sm text-white/50 hover:text-white transition"
        >
          Annuler
        </a>
      </div>
    </form>
  );
}

// ─── Field helper ─────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded-lg border border-white/[0.08] bg-df-surface px-3 py-2.5 text-sm text-white outline-none focus:border-df-gold/30 placeholder:text-white/30";

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-white/50">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}
