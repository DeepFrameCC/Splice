import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FOUNDER_LABEL } from "@/lib/pricing";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function VideoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await db.media.findUnique({ where: { id }, include: { monteur: { select: { pseudo: true } } } });
  if (!m || m.type !== "VIDEO") notFound();

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/videos" className="mb-6 inline-flex items-center gap-2 text-df-blue hover:text-df-gold">
        <ArrowLeft className="h-4 w-4" /> Retour à la galerie
      </Link>
      <div className="overflow-hidden rounded-3xl bg-black shadow-2xl">
        <video src={m.url} poster={m.thumbnailUrl ?? undefined} controls autoPlay className="aspect-video w-full" />
      </div>
      <div className="mt-6">
        <p className="font-display italic text-xl text-df-gold">{FOUNDER_LABEL[m.owner]}</p>
        <h1 className="mt-1 font-display text-4xl italic text-df-blue">{m.title}</h1>
        {m.description && <p className="mt-4 text-df-blue/80">{m.description}</p>}
      </div>
    </section>
  );
}
