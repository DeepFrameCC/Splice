"use client";
import { create } from "zustand";
import type { QuoteInput } from "@/lib/pricing";

export type DevisFormState = QuoteInput & {
  step: 1 | 2 | 3 | 4;
  nbFormat916: number;
  nbFormat169: number;
  nomEntreprise: string;
  nomContact: string;
  emailContact: string;
  telContact: string;
  lieuTournage: string;
  dateTournage: string;
  remarques: string;
  next: () => void;
  prev: () => void;
  set: <K extends keyof DevisFormState>(k: K, v: DevisFormState[K]) => void;
  reset: () => void;
};

const initial = {
  step: 1 as 1,
  pack: "BASIQUE" as const,
  duree: "DEMI_JOURNEE" as const,
  usage: "ORGANIQUE" as const,
  delai: "STANDARD" as const,
  villeDepart: "TOURS" as const,
  distanceKm: 0,
  videosSupp: 0,
  videos3D: 0,
  motionDesign: false,
  montageExpress: false,
  introAnimeeSec: null as number | null,
  nbFormat916: 0,
  nbFormat169: 0,
  nomEntreprise: "",
  nomContact: "",
  emailContact: "",
  telContact: "",
  lieuTournage: "",
  dateTournage: "",
  remarques: ""
};

export const useDevisForm = create<DevisFormState>((set) => ({
  ...initial,
  next: () => set((s) => ({ step: Math.min(4, s.step + 1) as 1 | 2 | 3 | 4 })),
  prev: () => set((s) => ({ step: Math.max(1, s.step - 1) as 1 | 2 | 3 | 4 })),
  set: (k, v) => set({ [k]: v } as any),
  reset: () => set(initial)
}));
