"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

function Placeholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-df-surface to-df-deep">
      <span className="font-display text-5xl font-bold tracking-wide text-white/20">
        SPL<span className="text-[#F36B1F]/30">ICE</span>
      </span>
      <div className="mt-2 h-0.5 w-12 rounded-full bg-[#F36B1F]/20" />
    </div>
  );
}

export function ServiceCardImage({ src, alt }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return <Placeholder />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition duration-300 group-hover:scale-105"
      onError={() => setHasError(true)}
    />
  );
}
