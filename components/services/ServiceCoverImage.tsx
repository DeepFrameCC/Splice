"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
}

export function ServiceCoverImage({ src, alt, priority = false }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm select-none">
        {/* Subtle decorative gold circle elements */}
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-df-gold/5 blur-2xl" />
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-df-gold/5 blur-2xl" />
        
        <div className="flex flex-col items-center gap-3">
          <span className="font-display text-5xl font-bold tracking-wide text-white/15">
            SPL<span className="text-[#F36B1F]/25">ICE</span>
          </span>
          <div className="h-0.5 w-12 rounded-full bg-[#F36B1F]/20" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
            Studio Production
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 500px"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      onError={() => setHasError(true)}
    />
  );
}
