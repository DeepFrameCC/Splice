"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, FileText, Receipt, FileSignature, Users, X } from "lucide-react";
import { adminSearch, type SearchResult } from "@/app/actions/admin-search";

export default function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const search = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await adminSearch(value);
      setResults(res);
    } finally {
      setLoading(false);
    }
  }, []);

  function onSelect(result: SearchResult) {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(result.href);
  }

  const iconMap = {
    devis: FileText,
    facture: Receipt,
    contrat: FileSignature,
    user: Users,
  } as const;

  const colorMap = {
    devis: "text-df-blue",
    facture: "text-df-gold",
    contrat: "text-emerald-500",
    user: "text-purple-500",
  } as const;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Rechercher…</span>
        <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/40 sm:inline">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command Panel */}
      <div className="relative w-full max-w-lg animate-in fade-in slide-in-from-top-4 duration-200">
        <Command
          className="overflow-hidden rounded-2xl border border-white/10 bg-df-ink shadow-2xl shadow-black/40"
          shouldFilter={false}
        >
          <div className="flex items-center border-b border-white/10 px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-white/40" />
            <Command.Input
              value={query}
              onValueChange={search}
              placeholder="Rechercher devis, factures, clients…"
              className="flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/30"
            />
            <button
              onClick={() => setOpen(false)}
              className="ml-2 rounded-lg p-1 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2">
            {loading && (
              <Command.Loading>
                <p className="px-4 py-6 text-center text-sm text-white/40">
                  Recherche…
                </p>
              </Command.Loading>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <Command.Empty className="px-4 py-6 text-center text-sm text-white/40">
                Aucun résultat pour &quot;{query}&quot;
              </Command.Empty>
            )}

            {!loading && query.length < 2 && (
              <div className="px-4 py-6 text-center text-sm text-white/30">
                Tapez au moins 2 caractères…
              </div>
            )}

            {results.map((r) => {
              const Icon = iconMap[r.type];
              const color = colorMap[r.type];
              return (
                <Command.Item
                  key={`${r.type}-${r.id}`}
                  value={`${r.type}-${r.id}`}
                  onSelect={() => onSelect(r)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{r.label}</p>
                    <p className="truncate text-xs text-white/40">{r.sub}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase text-white/30">
                    {r.type}
                  </span>
                </Command.Item>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
