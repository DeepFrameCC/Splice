"use client";
import { create } from "zustand";
import type {
  PlanId,
  BillingCycle,
  DevisMode,
  OptionKey,
  BanniereSize,
} from "@/lib/pricing";
import type { DureeTournage, DelaiLivraison, VilleDepart } from "@prisma/client";

export interface DevisFormState {
  step: 1 | 2 | 3;
  mode: DevisMode;

  // Abonnement fields
  planId: PlanId;
  billingCycle: BillingCycle;
  useLaunchPrice: boolean;

  // Pack Particulier fields
  nbVideos: number | null;
  nbPhotos: number | null;
  banniere: BanniereSize | null;
  villeDepart: VilleDepart;
  distanceKm: number;
  delai: DelaiLivraison;
  duree: DureeTournage;

  // Shared options
  options: Partial<Record<OptionKey, boolean>>;

  // Coordonnées (Step 3)
  nomEntreprise: string;
  nomContact: string;
  emailContact: string;
  telContact: string;
  lieuTournage: string;
  dateTournage: string;
  remarques: string;

  // Actions
  next: () => void;
  prev: () => void;
  set: <K extends keyof DevisFormState>(k: K, v: DevisFormState[K]) => void;
  toggleOption: (key: OptionKey) => void;
  reset: () => void;
}

const initial = {
  step: 1 as const,
  mode: "ABONNEMENT" as DevisMode,

  planId: "PRO" as PlanId,
  billingCycle: "MENSUEL" as BillingCycle,
  useLaunchPrice: true,

  nbVideos: null as number | null,
  nbPhotos: null as number | null,
  banniere: null as BanniereSize | null,
  villeDepart: "TOURS" as VilleDepart,
  distanceKm: 0,
  delai: "STANDARD" as DelaiLivraison,
  duree: "DEMI_JOURNEE" as DureeTournage,

  options: {} as Partial<Record<OptionKey, boolean>>,

  nomEntreprise: "",
  nomContact: "",
  emailContact: "",
  telContact: "",
  lieuTournage: "",
  dateTournage: "",
  remarques: "",
};

export const useDevisForm = create<DevisFormState>((set) => ({
  ...initial,
  next: () =>
    set((s) => ({ step: Math.min(3, s.step + 1) as 1 | 2 | 3 })),
  prev: () =>
    set((s) => ({ step: Math.max(1, s.step - 1) as 1 | 2 | 3 })),
  set: (k, v) => set({ [k]: v } as Partial<DevisFormState>),
  toggleOption: (key) =>
    set((s) => ({
      options: { ...s.options, [key]: !s.options[key] },
    })),
  reset: () => set(initial),
}));
