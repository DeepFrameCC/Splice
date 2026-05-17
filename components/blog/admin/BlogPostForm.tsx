"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createBlogPost, updateBlogPost, publishBlogPost } from "@/app/actions/admin-blog";
import type { BlogPostFormData } from "@/lib/blog/types";
import { generateSlug } from "@/lib/blog/slug";
import { Save, Send, ExternalLink, Loader2 } from "lucide-react";

const BlogEditor = dynamic(() => import("../editor/BlogEditor"), { ssr: false });

interface BlogPostFormProps {
  mode: "create" | "edit";
  initialData?: Partial<BlogPostFormData> & { id?: string; status?: string };
  categories: { id: string; name: string; slug: string; color: string | null }[];
  services: { id: string; name: string }[];
  authors: { id: string; pseudo: string }[];
}

export default function BlogPostForm({
  mode,
  initialData,
  categories,
  services,
  authors,
}: BlogPostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.coverImageAlt ?? "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [parentServiceId, setParentServiceId] = useState(initialData?.parentServiceId ?? "");
  const [authorId, setAuthorId] = useState(initialData?.authorId ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(initialData?.categoryIds ?? []);

  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (!slugEdited) {
        setSlug(generateSlug(value));
      }
    },
    [slugEdited],
  );

  const handleSlugChange = useCallback((value: string) => {
    setSlugEdited(true);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-"),
    );
  }, []);

  const handleAddTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    },
    [tags],
  );

  const toggleCategory = useCallback(
    (id: string) => {
      setCategoryIds(
        categoryIds.includes(id)
          ? categoryIds.filter((c) => c !== id)
          : [...categoryIds, id],
      );
    },
    [categoryIds],
  );

  const buildFormData = (): BlogPostFormData => ({
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    coverImageAlt,
    metaTitle,
    metaDescription,
    tags,
    parentServiceId,
    authorId,
    categoryIds,
  });

  const handleSaveDraft = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = buildFormData();
        if (mode === "create") {
          const result = await createBlogPost(data);
          router.push(`/admin/blog/${result.id}/modifier`);
        } else if (initialData?.id) {
          await updateBlogPost(initialData.id, data);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde");
      }
    });
  };

  const handlePublish = () => {
    setError(null);
    startTransition(async () => {
      try {
        const data = buildFormData();
        if (mode === "create") {
          const result = await createBlogPost(data);
          await publishBlogPost(result.id);
          router.push("/admin/blog");
        } else if (initialData?.id) {
          await updateBlogPost(initialData.id, data);
          await publishBlogPost(initialData.id);
          router.push("/admin/blog");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur lors de la publication");
      }
    });
  };

  return (
    <div>
      {/* Sticky action bar */}
      <div className="sticky top-[3.5rem] z-30 -mx-4 mb-6 border-b border-white/[0.08] bg-white/95 px-4 py-3 backdrop-blur-sm md:-mx-0 md:rounded-xl md:border md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isPending}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-df-blue transition hover:bg-df-blue/5 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="flex items-center gap-2 rounded-full bg-df-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-df-blue/90 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publier
            </button>
          </div>

          {mode === "edit" && initialData?.status === "PUBLISHED" && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-df-blue/50 hover:text-df-blue transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Aperçu
            </a>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left — main content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-bold text-df-blue/70">
              Titre
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Le titre de votre article"
              className="w-full rounded-xl border border-white/[0.08] bg-df-surface px-4 py-3 text-lg font-bold text-df-blue placeholder:text-df-blue/30 outline-none transition focus:border-df-blue/30 focus:ring-2 focus:ring-white/[0.08]"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="mb-1.5 block text-sm font-bold text-df-blue/70">
              Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-df-blue/40">/blog/</span>
              <input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="mon-article"
                className="flex-1 rounded-xl border border-white/[0.08] bg-df-surface px-4 py-2 text-sm text-df-blue placeholder:text-df-blue/30 outline-none transition focus:border-df-blue/30 focus:ring-2 focus:ring-white/[0.08]"
              />
            </div>
          </div>

          {/* Editor */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-df-blue/70">
              Contenu
            </label>
            <BlogEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Right — sidebar fields */}
        <div className="space-y-6">
          {/* Cover image */}
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <label className="mb-2 block text-sm font-bold text-df-blue/70">Image de couverture</label>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30"
            />
            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImageUrl}
                alt="Preview"
                className="mt-3 aspect-video w-full rounded-lg object-cover"
              />
            )}
            <input
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              placeholder="Texte alternatif"
              className="mt-2 w-full rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30"
            />
          </div>

          {/* Excerpt */}
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <label className="mb-2 block text-sm font-bold text-df-blue/70">Extrait</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumé court de l'article..."
              rows={3}
              className="w-full rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30 resize-none"
            />
          </div>

          {/* Categories */}
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <label className="mb-2 block text-sm font-bold text-df-blue/70">Catégories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    categoryIds.includes(cat.id)
                      ? "ring-2 ring-df-blue"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: cat.color ? `${cat.color}20` : "rgba(243,107,31,0.08)",
                    color: cat.color || "#F36B1F",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <label className="mb-2 block text-sm font-bold text-df-blue/70">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Ajouter un tag..."
                className="flex-1 rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg bg-df-blue/10 px-3 py-2 text-sm font-bold text-df-blue hover:bg-df-blue/20 transition"
              >
                +
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-df-blue/5 px-2.5 py-0.5 text-xs text-df-blue/70"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-df-blue/40 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Service parent */}
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <label className="mb-2 block text-sm font-bold text-df-blue/70">Service parent</label>
            <select
              value={parentServiceId}
              onChange={(e) => setParentServiceId(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30"
            >
              <option value="">Aucun</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <label className="mb-2 block text-sm font-bold text-df-blue/70">Auteur</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30"
            >
              <option value="">Aucun</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.pseudo}
                </option>
              ))}
            </select>
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-white/[0.08] bg-df-surface p-4">
            <label className="mb-2 block text-sm font-bold text-df-blue/70">SEO</label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Meta title (max 70 car.)"
              maxLength={70}
              className="w-full rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30"
            />
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Meta description (max 160 car.)"
              maxLength={160}
              rows={2}
              className="mt-2 w-full rounded-lg border border-white/[0.08] px-3 py-2 text-sm outline-none focus:border-df-blue/30 resize-none"
            />
            <p className="mt-1 text-xs text-df-blue/40">
              {metaTitle.length}/70 · {metaDescription.length}/160
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
