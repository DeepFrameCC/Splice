"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";
import { registerLivraison } from "@/app/actions/livraisons";

type Client = { id: string; label: string };

// Doit refléter la whitelist MIME de /api/upload.
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,application/pdf,application/zip";

function safeName(name: string): string {
  return name.normalize("NFKD").replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(0, 120) || "fichier";
}

export default function AdminLivraisonUpload({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const userId = String(fd.get("userId") || "");
    const titre = String(fd.get("titre") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const file = fd.get("file") as File | null;

    if (!userId) return setError("Choisis un client destinataire.");
    if (!titre) return setError("Donne un titre à la livraison.");
    if (!file || file.size === 0) return setError("Sélectionne un fichier.");

    setBusy(true);
    try {
      // 1) Upload du binaire dans R2 via le Route Handler (pas de limite Server Action).
      const key = `${userId}/${crypto.randomUUID()}-${safeName(file.name)}`;
      const upload = new FormData();
      upload.append("file", file);
      upload.append("bucket", "SPLICE_DELIVERIES");
      upload.append("key", key);

      const res = await fetch("/api/upload", { method: "POST", body: upload });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
        const detail = body && body.error ? JSON.stringify(body.error) : `Upload échoué (${res.status})`;
        throw new Error(detail);
      }

      // 2) Enregistrement des métadonnées + notification client.
      const result = await registerLivraison({
        userId,
        titre,
        description: description || null,
        r2Key: key,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        taille: file.size,
      });
      if (result?.error) throw new Error(result.error);

      setOk(true);
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="liv-client" className="mb-1.5 block text-sm font-semibold text-white/80">
          Client destinataire
        </label>
        <select
          id="liv-client"
          name="userId"
          required
          defaultValue=""
          className="w-full rounded-xl bg-df-night px-4 py-2.5 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-df-gold"
        >
          <option value="" disabled>Sélectionner…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="liv-titre" className="mb-1.5 block text-sm font-semibold text-white/80">
          Titre
        </label>
        <input
          id="liv-titre"
          name="titre"
          type="text"
          required
          maxLength={160}
          placeholder="Montage final — Interview Cklean Auto"
          className="w-full rounded-xl bg-df-night px-4 py-2.5 text-sm text-white ring-1 ring-white/10 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-df-gold"
        />
      </div>

      <div>
        <label htmlFor="liv-desc" className="mb-1.5 block text-sm font-semibold text-white/80">
          Description <span className="font-normal text-white/40">(optionnel)</span>
        </label>
        <textarea
          id="liv-desc"
          name="description"
          rows={2}
          maxLength={2000}
          placeholder="Version 4K, format 16:9. Master livré."
          className="w-full rounded-xl bg-df-night px-4 py-2.5 text-sm text-white ring-1 ring-white/10 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-df-gold"
        />
      </div>

      <div>
        <label htmlFor="liv-file" className="mb-1.5 block text-sm font-semibold text-white/80">
          Fichier <span className="font-normal text-white/40">(vidéo, image, PDF ou ZIP)</span>
        </label>
        <input
          id="liv-file"
          name="file"
          type="file"
          required
          accept={ACCEPT}
          className="w-full rounded-xl bg-df-night text-sm text-white/70 ring-1 ring-white/10 file:mr-4 file:cursor-pointer file:border-0 file:bg-white/10 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white hover:file:bg-white/15"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-300 ring-1 ring-rose-500/20">
          {error}
        </p>
      )}
      {ok && (
        <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/20">
          Livraison déposée, le client a été notifié.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-df-gold px-5 py-2.5 text-sm font-bold text-white transition hover:bg-df-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UploadCloud className="h-4 w-4" aria-hidden />}
        {busy ? "Envoi en cours…" : "Déposer la livraison"}
      </button>
    </form>
  );
}
