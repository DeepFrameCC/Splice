import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Hardcoded to the verified Resend domain — do not read from env to avoid
// misconfiguration on Cloudflare Workers sending from an unverified domain.
export const MAIL_FROM = "Splice Studio <noreply@splicestudio.fr>";
export const MAIL_REPLY_TO = "contact.splicestudio@gmail.com";
export const MAIL_CONTACT = "contact.splicestudio@gmail.com";
export const MAIL_FOUNDERS = (process.env.MAIL_FOUNDERS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export async function sendMail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string; bcc?: string | string[] }) {
  const resend = getResend();
  if (!resend) {
    // Best-effort : ne jamais bloquer un appelant si la clé est absente/mal
    // configurée. L'envoi d'e-mail est secondaire vis-à-vis de l'action métier.
    console.error("[mailer] RESEND_API_KEY manquante — e-mail non envoyé:", opts.subject, opts.to);
    return { id: "skip-no-key" } as const;
  }
  try {
    const result = await resend.emails.send({
      from: MAIL_FROM,
      replyTo: opts.replyTo ?? MAIL_REPLY_TO,
      ...opts,
    });
    if (result.error) {
      console.error("[mailer] Resend API error:", result.error);
      throw new Error(`Resend API error: ${result.error.message} (code: ${result.error.name})`);
    }
    return result;
  } catch (error: unknown) {
    console.error("[mailer] Failed to send:", opts.subject, "to:", opts.to, error);
    throw error;
  }
}

export const notifyFoundersNewDevis = (numero: string, payload: { client: string; total: number; lieu: string; pack: string }) =>
  sendMail({
    to: MAIL_FOUNDERS.length ? MAIL_FOUNDERS : [MAIL_CONTACT],
    replyTo: MAIL_CONTACT,
    subject: `[Splice] Nouveau devis ${numero} — ${payload.client}`,
    html: `
      <div style="font-family:system-ui;color:#0E0E22">
        <h2 style="color:#F36B1F">Nouveau devis ${numero}</h2>
        <p><strong>Client :</strong> ${payload.client}</p>
        <p><strong>Pack :</strong> ${payload.pack}</p>
        <p><strong>Lieu :</strong> ${payload.lieu}</p>
        <p><strong>Total HT :</strong> ${payload.total.toLocaleString("fr-FR")} €</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/devis" style="background:#F36B1F;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Ouvrir l'admin</a>
      </div>`
  });
