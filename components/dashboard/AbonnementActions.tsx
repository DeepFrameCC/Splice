"use client";
import { useState, useTransition } from "react";
import { XCircle, RotateCcw } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { resilierAbonnement, reactiverAbonnement } from "@/app/actions/abonnement";
import toast from "react-hot-toast";

type Props = {
  abonnementId: string;
  periodeFin: string | null;
  /** Terme de l'engagement minimum si encore en cours (MENSUEL), sinon null. */
  engagementFin?: string | null;
  cancelAtPeriodEnd: boolean;
};

export default function AbonnementActions({ abonnementId, periodeFin, engagementFin, cancelAtPeriodEnd }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function onResilier() {
    start(async () => {
      try {
        await resilierAbonnement(abonnementId);
        toast.success("Résiliation programmée");
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Échec de la résiliation");
      }
    });
  }

  function onReactiver() {
    start(async () => {
      try {
        await reactiverAbonnement(abonnementId);
        toast.success("Abonnement réactivé");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Échec de la réactivation");
      }
    });
  }

  if (cancelAtPeriodEnd) {
    return (
      <button
        disabled={pending}
        onClick={onReactiver}
        className="inline-flex items-center gap-1.5 rounded-full bg-df-gold px-4 py-2 text-xs font-bold text-white transition hover:bg-df-blue-dark disabled:opacity-50"
      >
        <RotateCcw className="h-3.5 w-3.5" /> {pending ? "…" : "Réactiver mon abonnement"}
      </button>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300">
          <XCircle className="h-3.5 w-3.5" /> Résilier mon abonnement
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#15152A] p-6 shadow-2xl">
          <Dialog.Title className="font-display text-lg text-white">Résilier votre abonnement ?</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-white/60">
            {engagementFin
              ? `Vous êtes engagé jusqu'au ${engagementFin}. Votre abonnement reste actif et facturé jusqu'à cette date, puis prendra fin sans renouvellement. Aucun remboursement.`
              : periodeFin
                ? `Votre abonnement restera actif jusqu'au ${periodeFin}, puis prendra fin sans renouvellement. Aucun remboursement de la période en cours.`
                : "Votre abonnement restera actif jusqu'à la fin de la période en cours, puis prendra fin sans renouvellement. Aucun remboursement de la période en cours."}
          </Dialog.Description>
          <p className="mt-3 text-xs text-white/40">
            Vous pourrez réactiver à tout moment avant cette date.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="rounded-full px-4 py-2 text-xs font-bold text-white/60 transition hover:text-white">
                Garder mon abonnement
              </button>
            </Dialog.Close>
            <button
              disabled={pending}
              onClick={onResilier}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
            >
              {pending ? "Résiliation…" : "Confirmer la résiliation"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
