"use client";

import dynamic from "next/dynamic";

const IntroScreen       = dynamic(() => import("@/components/home/IntroScreen"),       { ssr: false });
const LandingAnimations = dynamic(() => import("@/components/home/LandingAnimations"), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <IntroScreen />
      <LandingAnimations />
    </>
  );
}
