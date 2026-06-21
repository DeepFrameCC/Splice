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
          if (entry.isIntersecting) setActiveId(entry.target.id);
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
    <nav className="am-toc" aria-label="Sommaire">
      <div className="am-toc__label">Sommaire</div>
      <ol>
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`${h.level === 3 ? "am-toc__l3" : ""} ${activeId === h.id ? "is-active" : ""}`}
            >
              <span className="am-toc__num">{String(i + 1).padStart(2, "0")}</span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
