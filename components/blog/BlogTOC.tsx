"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface BlogTOCProps {
  html: string;
}

function extractHeadings(html: string): TOCItem[] {
  const items: TOCItem[] = [];
  const regex = /<h([23])\s[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = match[1];
    const id = match[2];
    const rawText = match[3];
    if (!level || !id || !rawText) continue;
    items.push({
      level: parseInt(level),
      id,
      text: rawText.replace(/<[^>]*>/g, ""),
    });
  }
  return items;
}

export default function BlogTOC({ html }: BlogTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const headings = extractHeadings(html);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <>
      {/* Desktop — sticky sidebar */}
      <nav
        className="hidden lg:block sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto"
        aria-label="Table des matières"
      >
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-df-gold">
          <List className="h-3.5 w-3.5" />
          Sommaire
        </p>
        <ul className="space-y-1.5 border-l border-white/[0.08] text-sm">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block border-l-2 py-1 transition ${
                  h.level === 3 ? "pl-6" : "pl-4"
                } ${
                  activeId === h.id
                    ? "border-df-gold font-medium text-white"
                    : "border-transparent text-white/50 hover:border-white/10 hover:text-white/70"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile — collapsible */}
      <div className="lg:hidden rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between text-sm font-bold text-white"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Sommaire
          </span>
          <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
        </button>
        {isOpen && (
          <ul className="mt-3 space-y-1.5 border-l border-white/[0.08] text-sm">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block py-1 text-white/50 hover:text-white ${h.level === 3 ? "pl-6" : "pl-4"}`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
