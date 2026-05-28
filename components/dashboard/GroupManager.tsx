"use client";

import { useState, useMemo, useTransition } from "react";
import Image from "next/image";
import {
  Layers,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  addMediaToGroup,
  removeMediaFromGroup,
  renameGroup,
  dissolveGroup,
} from "@/app/actions/admin-medias";

interface MediaItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  url: string;
  type: "PHOTO" | "VIDEO";
  groupKey: string | null;
  groupOrder: number | null;
}

interface GroupManagerProps {
  medias: MediaItem[];
}

/* ── Group Card (expandable) ──────────────────────────────── */

interface GroupCardProps {
  groupKey: string;
  members: MediaItem[];
  ungrouped: MediaItem[];
}

function GroupCard({ groupKey, members, ungrouped }: GroupCardProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(groupKey);
  const [addMediaId, setAddMediaId] = useState("");

  const handleRemove = (mediaId: string) => {
    startTransition(async () => {
      try {
        await removeMediaFromGroup(mediaId);
        toast.success("Retiré du groupe");
      } catch {
        toast.error("Erreur lors du retrait");
      }
    });
  };

  const handleMoveUp = (member: MediaItem, idx: number) => {
    if (idx === 0) return;
    const prev = members[idx - 1];
    if (!prev) return;
    startTransition(async () => {
      try {
        await addMediaToGroup({ mediaId: member.id, groupKey, groupOrder: prev.groupOrder ?? 0 });
        await addMediaToGroup({ mediaId: prev.id, groupKey, groupOrder: member.groupOrder ?? 0 });
      } catch {
        toast.error("Erreur lors du déplacement");
      }
    });
  };

  const handleMoveDown = (member: MediaItem, idx: number) => {
    if (idx >= members.length - 1) return;
    const next = members[idx + 1];
    if (!next) return;
    startTransition(async () => {
      try {
        await addMediaToGroup({ mediaId: member.id, groupKey, groupOrder: next.groupOrder ?? 0 });
        await addMediaToGroup({ mediaId: next.id, groupKey, groupOrder: member.groupOrder ?? 0 });
      } catch {
        toast.error("Erreur lors du déplacement");
      }
    });
  };

  const handleRename = () => {
    if (!newName.trim() || newName.trim() === groupKey) {
      setRenaming(false);
      return;
    }
    startTransition(async () => {
      try {
        await renameGroup({ oldGroupKey: groupKey, newGroupKey: newName.trim() });
        toast.success("Groupe renommé");
        setRenaming(false);
      } catch {
        toast.error("Erreur lors du renommage");
      }
    });
  };

  const handleDissolve = () => {
    if (!confirm(`Dissoudre le groupe "${groupKey}" ? Les médias ne seront pas supprimés.`)) return;
    startTransition(async () => {
      try {
        await dissolveGroup(groupKey);
        toast.success("Groupe dissous");
      } catch {
        toast.error("Erreur lors de la dissolution");
      }
    });
  };

  const handleAdd = () => {
    if (!addMediaId) return;
    const nextOrder = members.length > 0
      ? Math.max(...members.map((m) => m.groupOrder ?? 0)) + 1
      : 0;
    startTransition(async () => {
      try {
        await addMediaToGroup({ mediaId: addMediaId, groupKey, groupOrder: nextOrder });
        toast.success("Média ajouté au groupe");
        setAddMediaId("");
      } catch {
        toast.error("Erreur lors de l'ajout");
      }
    });
  };

  const firstThumb = members[0]?.thumbnailUrl || members[0]?.url;

  return (
    <div className={`rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08] transition ${pending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* Collapsed header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
          {firstThumb ? (
            <Image src={firstThumb} alt="" fill sizes="40px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Layers className="h-4 w-4 text-white/20" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-white">{groupKey}</p>
          <p className="text-xs text-white/40">
            {members.length} {members.length === 1 ? "média" : "médias"}
          </p>
        </div>
        <ChevronRight className={`h-4 w-4 text-white/30 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-white/[0.08] p-4 space-y-4">
          {/* Rename */}
          <div className="flex items-center gap-2">
            {renaming ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  className="flex-1 rounded-lg border-2 border-white/10 bg-transparent px-2 py-1 text-sm text-white outline-none focus:border-df-blue"
                  autoFocus
                />
                <button onClick={handleRename} className="rounded-lg bg-df-blue px-3 py-1 text-xs font-bold text-white">
                  OK
                </button>
                <button onClick={() => { setRenaming(false); setNewName(groupKey); }} className="text-xs text-white/40 hover:text-white">
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setRenaming(true)}
                className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition"
              >
                <Pencil className="h-3 w-3" /> Renommer
              </button>
            )}
          </div>

          {/* Members list */}
          <div className="space-y-2">
            {members.map((m, idx) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2">
                <span className="w-6 text-center text-xs font-bold text-white/30">{idx + 1}</span>
                <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {(m.thumbnailUrl || m.url) ? (
                    <Image src={m.thumbnailUrl || m.url} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      {m.type === "VIDEO" ? <Video className="h-3 w-3 text-white/20" /> : <ImageIcon className="h-3 w-3 text-white/20" />}
                    </div>
                  )}
                </div>
                <p className="min-w-0 flex-1 truncate text-sm text-white">{m.title}</p>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${m.type === "VIDEO" ? "bg-purple-500/20 text-purple-400" : "bg-df-gold/20 text-df-gold"}`}>
                  {m.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(m, idx)}
                    disabled={idx === 0}
                    className="rounded-lg p-1 text-white/30 hover:bg-white/5 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                    title="Monter"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(m, idx)}
                    disabled={idx === members.length - 1}
                    className="rounded-lg p-1 text-white/30 hover:bg-white/5 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                    title="Descendre"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(m.id)}
                    className="rounded-lg p-1 text-red-400/60 hover:bg-red-500/10 hover:text-red-400"
                    title="Retirer du groupe"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add media to group */}
          {ungrouped.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={addMediaId}
                onChange={(e) => setAddMediaId(e.target.value)}
                className="flex-1 rounded-xl border-2 border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-df-blue"
              >
                <option value="">Ajouter un média...</option>
                {ungrouped.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.type === "VIDEO" ? "[Vid] " : "[Pho] "}{m.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAdd}
                disabled={!addMediaId}
                className="inline-flex items-center gap-1 rounded-xl bg-df-blue px-3 py-2 text-sm font-bold text-white transition hover:bg-df-blue/90 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </button>
            </div>
          )}

          {/* Dissolve */}
          <button
            type="button"
            onClick={handleDissolve}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 className="h-3 w-3" /> Dissoudre le groupe
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Create Group Form ────────────────────────────────────── */

interface CreateGroupFormProps {
  ungrouped: MediaItem[];
  onDone: () => void;
}

function CreateGroupForm({ ungrouped, onDone }: CreateGroupFormProps) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleMedia = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim() || selectedIds.length === 0) {
      toast.error("Nom du groupe et au moins 1 média requis");
      return;
    }
    startTransition(async () => {
      try {
        for (let i = 0; i < selectedIds.length; i++) {
          const id = selectedIds[i];
          if (!id) continue;
          await addMediaToGroup({ mediaId: id, groupKey: name.trim(), groupOrder: i });
        }
        toast.success(`Groupe "${name.trim()}" créé avec ${selectedIds.length} médias`);
        onDone();
      } catch {
        toast.error("Erreur lors de la création du groupe");
      }
    });
  };

  return (
    <div className={`rounded-2xl bg-df-surface p-4 shadow-sm ring-1 ring-white/[0.08] space-y-4 ${pending ? "opacity-60 pointer-events-none" : ""}`}>
      <h3 className="text-sm font-bold text-white">Nouveau groupe</h3>

      <label>
        <span className="text-xs font-bold text-white/60">Nom du groupe</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: lowrider, mariage-dupont"
          className="mt-1 w-full rounded-xl border-2 border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-df-blue"
        />
      </label>

      {ungrouped.length === 0 ? (
        <p className="text-xs text-white/30">Aucun média non-groupé disponible.</p>
      ) : (
        <div>
          <span className="text-xs font-bold text-white/60">
            Sélectionner les médias ({selectedIds.length} sélectionnés)
          </span>
          <div className="mt-2 max-h-60 space-y-1 overflow-y-auto rounded-xl border border-white/[0.08] p-2">
            {ungrouped.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 transition ${
                  selectedIds.includes(m.id) ? "bg-df-blue/10 ring-1 ring-df-blue/30" : "hover:bg-white/[0.03]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(m.id)}
                  onChange={() => toggleMedia(m.id)}
                  className="h-4 w-4 accent-df-blue"
                />
                <div className="relative h-8 w-12 shrink-0 overflow-hidden rounded-md bg-white/5">
                  {(m.thumbnailUrl || m.url) ? (
                    <Image src={m.thumbnailUrl || m.url} alt="" fill sizes="48px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      {m.type === "VIDEO" ? <Video className="h-3 w-3 text-white/20" /> : <ImageIcon className="h-3 w-3 text-white/20" />}
                    </div>
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-white">{m.title}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${m.type === "VIDEO" ? "bg-purple-500/20 text-purple-400" : "bg-df-gold/20 text-df-gold"}`}>
                  {m.type}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCreate}
          disabled={!name.trim() || selectedIds.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-df-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-df-blue/90 disabled:opacity-40"
        >
          <Layers className="h-4 w-4" /> Créer le groupe
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/5"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

/* ── Main GroupManager ────────────────────────────────────── */

export default function GroupManager({ medias }: GroupManagerProps) {
  const [expanded, setExpanded] = useState(false);
  const [creating, setCreating] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, MediaItem[]>();
    medias.forEach((m) => {
      if (m.groupKey) {
        const arr = map.get(m.groupKey) || [];
        arr.push(m);
        map.set(m.groupKey, arr);
      }
    });
    map.forEach((items) => items.sort((a, b) => (a.groupOrder ?? 0) - (b.groupOrder ?? 0)));
    return map;
  }, [medias]);

  const ungrouped = useMemo(() => medias.filter((m) => !m.groupKey), [medias]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-df-gold"
        >
          <Layers className="h-4 w-4" />
          Groupes / Carrousels
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/60">
            {groups.size}
          </span>
          <ChevronRight className={`h-3.5 w-3.5 text-white/30 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
        {expanded && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-df-blue px-3 py-1.5 text-xs font-bold text-white transition hover:bg-df-blue/90"
          >
            <Plus className="h-3.5 w-3.5" /> Nouveau groupe
          </button>
        )}
      </div>

      {expanded && (
        <div className="space-y-3">
          {/* Create form */}
          {creating && (
            <CreateGroupForm
              ungrouped={ungrouped}
              onDone={() => setCreating(false)}
            />
          )}

          {/* Groups list */}
          {groups.size === 0 && !creating ? (
            <div className="rounded-2xl bg-df-surface p-8 text-center shadow-sm ring-1 ring-white/[0.08]">
              <Layers className="mx-auto h-8 w-8 text-white/15" />
              <p className="mt-3 text-sm text-white/30">Aucun groupe pour le moment.</p>
              <p className="mt-1 text-xs text-white/20">
                Créez un groupe pour regrouper des médias en carrousel dans la galerie.
              </p>
            </div>
          ) : (
            [...groups.entries()].map(([key, members]) => (
              <GroupCard
                key={key}
                groupKey={key}
                members={members}
                ungrouped={ungrouped}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
