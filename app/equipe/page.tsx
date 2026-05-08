import Nav from "@/components/layout/Nav";
import EquipeAnimations from "@/components/equipe/EquipeAnimations";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { FOUNDER_LABEL } from "@/lib/pricing";
import type { Founder } from "@prisma/client";
import MediaCard from "@/components/gallery/MediaCard";
import VideoCard from "@/components/gallery/VideoCard";
import { toggleLike } from "@/app/actions/likes";
import { Instagram, ArrowLeft } from "lucide-react";
import Link from "next/link";
import StaticGallery from "@/components/equipe/StaticGallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Équipe",
  description:
    "Découvrez les portfolios de Papi, Louisia et Ty — les trois fondateurs de DeepFrame.",
};

const FOUNDERS: {
  key: Founder;
  name: string;
  role: string;
  handle: string;
  insta: string;
  gradient: string;
  accentColor: string;
  bio: string[];
  specs: string[];
  portfolio?: string;
}[] = [
    {
      key: "PAPI",
      name: "Papi",
      role: "Réalisateur & DOP",
      handle: "@papiforcex",
      insta: "https://instagram.com/papiforcex",
      portfolio: "https://papiforcex.com",
      gradient: "linear-gradient(145deg, #FFE0B0 0%, #FFBD59 100%)",
      accentColor: "#C48B00",
      bio: [
        "Réalisateur principal et directeur de la photographie, Papi est la colonne vertébrale créative de DeepFrame. Il conçoit et dirige chaque tournage avec une obsession pour la lumière et le cadre.",
      ],
      specs: ["Caméra 4K ", "Insta 360", "Rolling shot"],
    },
    {
      key: "LOUISIA",
      name: "Louisia",
      role: "Productrice",
      handle: "@by.louisia",
      insta: "https://instagram.com/by.louisia",
      gradient: "linear-gradient(145deg, #B7B0FF 0%, #1901AD 100%)",
      accentColor: "#1901AD",
      bio: [
        "Productrice et photographe, Louisia orchestre les projets de A à Z — de la direction artistique à la logistique terrain. Elle garantit que chaque tournage se déroule dans les meilleures conditions.",
        "Son œil photographique (portrait, mode, image de marque) nourrit la direction visuelle de tous les projets DeepFrame.",
      ],
      specs: ["Direction artistique", "Portrait", "Photographie", "Retouche avancée"],
    },
    {
      key: "TY",
      name: "Ty",
      role: "Monteur · Étalonneur",
      handle: "@t.y97one",
      insta: "https://instagram.com/t.y97one",
      gradient: "linear-gradient(145deg, #F2D8A8 0%, #5C3A1F 100%)",
      accentColor: "#7A4F20",
      bio: [
        "Monteur et étalonneur, Ty est la dernière main sur chaque film. Il transforme les rushes bruts en un récit fluide et cohérent, avec un sens du rythme affûté.",
        "Spécialisé dans les formats réseaux (Reels, TikTok) autant que dans les longs formats.",
      ],
      specs: ["Montage narratif", "Formats réseaux"],
    },
  ];

const STATIC_PORTFOLIO: Record<string, { src: string; title: string; type: "video" | "image" }[]> = {
  PAPI: [
    { src: "/Le saviez-vous Le PPF (Paint Protection Film) est un film transparent appliqué sur la carrosseri.mp4", title: "Porsche 911 — Pose PPF", type: "video" },
    { src: "/Time (Par Fayad).mp4", title: "Time — Clip", type: "video" },
  ],
  LOUISIA: [
    { src: "/Alerte Nouvelle Pépite ✨️Le Bistrot de la Croix Morin c'est lendroit parfait pour manger des pl.mp4", title: "Alerte Nouvelle Pépite — Bistrot de la Croix Morin", type: "video" },
    { src: "/Interview cklean auto.mp4", title: "Interview CKCleanAuto45", type: "video" },
    { src: "/Présentation (Par Louisia).mp4", title: "Présentation CKCleanAuto45", type: "video" },
    { src: "/P7.jpg", title: "CKCleanAuto45 — Session photo", type: "image" },
    { src: "/P18.jpg", title: "CKCleanAuto45 — Finition PPF", type: "image" },
    { src: "/P24.jpg", title: "CKCleanAuto45 — Résultat final", type: "image" },
    { src: "/travail 4 porche.jpg", title: "Porsche — Travail de détail", type: "image" },
  ],
  TY: [],
};

export default async function EquipePage() {
  let allMedias: any[] = [];
  let likedIds = new Set<string>();
  let userId: string | undefined;

  try {
    const session = await auth();
    userId = (session?.user as any)?.id as string | undefined;

    const [fetchedMedias, likes] = await Promise.all([
      db.media.findMany({
        where: { published: true },
        include: { monteur: { select: { pseudo: true } } },
        orderBy: { createdAt: "desc" },
      }),
      userId
        ? db.like.findMany({ where: { userId }, select: { mediaId: true } })
        : Promise.resolve([]),
    ]);

    allMedias = fetchedMedias;
    likedIds = new Set(likes.map((l) => l.mediaId));
  } catch (e) {
    console.error("[equipe] DB error:", e);
  }

  return (
    <>
      <Nav />
      <EquipeAnimations />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #0A0A23 0%, #1901AD 100%)",
          paddingTop: "calc(80px + 5rem)",
          paddingBottom: "5rem",
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-white/50 uppercase transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Link>

          <div
            className="mb-3 h-px w-10"
            style={{ background: "#FFBD59" }}
          />
          <p
            className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#FFBD59" }}
          >
            Équipe
          </p>
          <h1
            data-anim="hero-title"
            className="text-5xl font-black text-white md:text-7xl"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            Trois{" "}
            <em
              className="italic"
              style={{ color: "#FFBD59" }}
            >
              artisans
            </em>
            <br />
            de l&apos;image.
          </h1>
          <p data-anim="hero-sub" className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            Une petite équipe, un grand matériel, de vraies idées. Chacun apporte
            une expertise distincte — ensemble ils couvrent tout le spectre de
            la production audiovisuelle.
          </p>

          {/* Ancres rapides */}
          <div data-anim="hero-anchors" className="mt-10 flex flex-wrap gap-3">
            {FOUNDERS.map((f) => (
              <a
                key={f.key}
                href={`#${f.key.toLowerCase()}`}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/70 transition hover:border-white/60 hover:text-white"
              >
                {f.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fondateurs ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-28">
          {FOUNDERS.map((founder) => {
            const medias = allMedias.filter((m) => m.owner === founder.key);

            return (
              <section key={founder.key} id={founder.key.toLowerCase()} data-anim="founder-section">

                {/* Carte fondateur */}
                <div className="mb-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
                  <div className="flex items-start gap-6">

                    {/* Initiale avec gradient */}
                    <div
                      data-anim="founder-card"
                      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-4xl font-black text-white shadow-lg md:h-28 md:w-28 md:text-5xl"
                      style={{ background: founder.gradient }}
                    >
                      {founder.name[0]}
                    </div>

                    <div data-anim="founder-info" className="pt-1">
                      <h2
                        className="text-3xl font-black text-df-ink md:text-4xl"
                        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}
                      >
                        {founder.name}
                      </h2>
                      <p
                        className="mt-1 text-base font-semibold uppercase tracking-widest"
                        style={{ color: founder.accentColor, fontSize: "0.75rem" }}
                      >
                        {founder.role}
                      </p>

                      {/* Specs */}
                      <div data-anim="founder-specs" className="mt-4 flex flex-wrap gap-2">
                        {founder.specs.map((s) => (
                          <span
                            key={s}
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ background: "#FFF6E5", color: founder.accentColor }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <a
                    href={founder.insta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition hover:opacity-70 md:mt-1"
                    style={{ borderColor: founder.accentColor, color: founder.accentColor }}
                  >
                    <Instagram className="h-4 w-4" />
                    {founder.handle}
                  </a>
                </div>

                {/* Bio */}
                <div
                  data-anim="founder-bio"
                  className="mb-12 rounded-2xl p-6 md:p-8"
                  style={{ background: "#F7F5FF", borderLeft: `4px solid ${founder.accentColor}` }}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {founder.bio.map((para, i) => (
                      <p key={i} className="text-base leading-relaxed text-df-ink/70">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Galerie */}
                <div>
                  <div data-anim="founder-gallery-title" className="mb-6 flex items-center gap-4">
                    <h3
                      className="text-xl font-bold text-df-ink"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Réalisations
                    </h3>
                    {medias.length > 0 && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ background: founder.gradient, color: "#fff" }}
                      >
                        {medias.length} {medias.length === 1 ? "projet" : "projets"}
                      </span>
                    )}
                    <div className="h-px flex-1" style={{ background: "#E8E5FF" }} />
                  </div>

                  {/* Portfolio externe */}
                  {founder.portfolio && (
                    <a
                      href={founder.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:shadow-lg"
                      style={{ background: founder.gradient }}
                    >
                      Voir le portfolio complet → {founder.portfolio.replace("https://", "")}
                    </a>
                  )}

                  {medias.length === 0 && (STATIC_PORTFOLIO[founder.key]?.length ?? 0) === 0 ? (
                    <div
                      className="rounded-2xl px-8 py-14 text-center"
                      style={{ background: "#FAFAFA", border: "2px dashed #E5E0FF" }}
                    >
                      <p className="text-sm text-df-ink/40">
                        Aucune réalisation publiée pour l&apos;instant — bientôt en ligne.
                      </p>
                    </div>
                  ) : medias.length === 0 ? (
                    <StaticGallery items={STATIC_PORTFOLIO[founder.key] ?? []} />
                  ) : (
                    <div data-anim="founder-gallery" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {medias.map((m) =>
                        m.type === "VIDEO" ? (
                          <VideoCard
                            key={m.id}
                            id={m.id}
                            src={m.url}
                            thumbnail={m.thumbnailUrl ?? ""}
                            preview={m.previewUrl ?? undefined}
                            title={m.title}
                            ownerHandle={FOUNDER_LABEL[m.owner as Founder]}
                            prixEstime={m.prixEstime}
                            materiel={m.materiel}
                            monteur={m.monteur?.pseudo ?? null}
                            liked={likedIds.has(m.id)}
                            isAuthed={Boolean(userId)}
                            toggleLike={toggleLike}
                          />
                        ) : (
                          <MediaCard
                            key={m.id}
                            id={m.id}
                            src={m.url}
                            title={m.title}
                            ownerHandle={FOUNDER_LABEL[m.owner as Founder]}
                            prixEstime={m.prixEstime}
                            materiel={m.materiel}
                            monteur={m.monteur?.pseudo ?? null}
                            liked={likedIds.has(m.id)}
                            isAuthed={Boolean(userId)}
                            toggleLike={toggleLike}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ── CTA bas de page ───────────────────────────────────────────── */}
      <section
        data-anim="cta"
        className="mt-4 py-20 text-center"
        style={{ background: "#FFF6E5" }}
      >
        <p
          className="mb-2 text-sm font-semibold uppercase tracking-widest"
          style={{ color: "#FFBD59" }}
        >
          Travaillons ensemble
        </p>
        <h2
          className="mb-6 text-3xl font-black text-df-ink md:text-4xl"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}
        >
          Un projet en tête&nbsp;?
        </h2>
        <Link
          href="/devis"
          className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-df-blue transition hover:scale-105 hover:shadow-lg active:scale-95"
          style={{ background: "#FFBD59" }}
        >
          Demandez votre devis →
        </Link>
      </section>
    </>
  );
}
