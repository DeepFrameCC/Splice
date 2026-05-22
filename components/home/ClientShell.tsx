"use client";

import dynamic from "next/dynamic";

const LandingAnimations = dynamic(() => import("@/components/home/LandingAnimations"), { ssr: false });

export default function ClientShell() {
  return <LandingAnimations />;
}
