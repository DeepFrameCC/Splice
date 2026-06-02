"use client";
import { useState, useTransition } from "react";
import { CheckCircle, XCircle, CalendarClock } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { validerDevis, refuserDevis, proposerAutreDate } from "@/app/actions/admin";
import toast from "react-hot-toast";

export function ValiderBtn({ devisId }: { devisId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await validerDevis(devisId); toast.success("Devis validé"); })}
      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-200 disabled:opacity-50"
    >
      <CheckCircle className="h-3.5 w-3.5" /> {pending ? "…" : "Valider"}
    </button>
  );
}

export function RefuserBtn({ devisId }: { devisId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await refuserDevis(devisId); toast.success("Devis refusé"); })}
      className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-800 transition hover:bg-rose-200 disabled:opacity-50"
    >
      <XCircle className="h-3.5 w-3.5" /> {pending ? "…" : "Refuser"}
    </button>
  );
}

export function ProposerDateBtn({ devisId }: { devisId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    const texte = message.trim();
    if (texte.length < 5) {
      toast.error("Écrivez un message d'au moins 5 caractères.");
      return;
    }
    start(async () => {
      try {
        await proposerAutreDate(devisId, texte);
        toast.success("Proposition envoyée au client");
        setOpen(false);
        setMessage("");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Échec de l'envoi");
      }
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1.5 text-xs font-bold text-amber-300 transition hover:bg-amber-400/25"
        >
          <CalendarClock className="h-3.5 w-3.5" /> Proposer une date
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#15152A] p-6 shadow-2xl">
          <Dialog.Title className="font-display text-lg text-white">Proposer une autre date</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-white/60">
            Le client reçoit ce message par e-mail et notification. Le devis reste « en attente » : vous le validez plus tard.
          </Dialog.Description>
          <textarea
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="Ex : Nous ne sommes pas disponibles le 12/06. Le 19 ou le 20/06 vous conviendraient-ils  ? Un doute sur nos dispos ? Écrivez-nous, on vous répond vite."
            className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-df-gold/60"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="rounded-full px-4 py-2 text-xs font-bold text-white/60 transition hover:text-white">
                Annuler
              </button>
            </Dialog.Close>
            <button
              disabled={pending}
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-full bg-df-gold px-4 py-2 text-xs font-bold text-white transition hover:bg-df-blue-dark disabled:opacity-50"
            >
              {pending ? "Envoi…" : "Envoyer la proposition"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
