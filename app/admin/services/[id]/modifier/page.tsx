import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ServiceForm from "@/components/services/admin/ServiceForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminServiceEditPage({ params }: Props) {
  const { id } = await params;

  const service = await db.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase tracking-tight text-white">
        Modifier le service
      </h1>
      <ServiceForm
        initialData={{
          id: service.id,
          name: service.name,
          shortName: service.shortName,
          slug: service.slug,
          metaTitle: service.metaTitle,
          metaDescription: service.metaDescription,
          h1: service.h1,
          introParagraph: service.introParagraph,
          problemQuestion: service.problemQuestion,
          problemAnswer: service.problemAnswer,
          serviceType: service.serviceType,
          priceRange: service.priceRange,
          coverImageUrl: service.coverImageUrl,
          coverImageAlt: service.coverImageAlt,
          videoUrl: service.videoUrl ?? "",
          category: service.category,
          sortOrder: service.sortOrder,
          iconName: service.iconName ?? "",
          zoneText: service.zoneText ?? "",
          isPublished: service.isPublished,
        }}
      />
    </div>
  );
}
