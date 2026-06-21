"use client";

import { useEffect, useState } from "react";

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
    <nav
      aria-label="Sommaire"
      className="rounded-2xl bg-df-surface p-6 ring-1 ring-white/[0.08] md:px-7"
    >
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-white/45">
        Sommaire
      </p>
      <ol className="flex flex-col gap-3">
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`flex gap-3 text-[15px] transition ${
                h.level === 3 ? "pl-6" : ""
              } ${
                activeId === h.id
                  ? "font-medium text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span className="font-mono text-[13px] font-medium text-df-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
