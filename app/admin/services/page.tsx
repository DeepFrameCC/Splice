import { db } from "@/lib/db";
import ServicesTable from "@/components/services/admin/ServicesTable";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

const tabs = [
  { label: "Tous", value: "ALL" },
  { label: "Publiés", value: "PUBLISHED" },
  { label: "Masqués", value: "HIDDEN" },
];

export default async function AdminServicesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status || "ALL";

  const where =
    status === "PUBLISHED"
      ? { isPublished: true }
      : status === "HIDDEN"
        ? { isPublished: false }
        : {};

  const services = await db.service.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      shortName: true,
      category: true,
      isPublished: true,
      sortOrder: true,
      updatedAt: true,
    },
  });

  const serialized = services.map((s) => ({
    ...s,
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">Services</h1>
          <p className="mt-1 text-sm text-white/55">{services.length} service{services.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-white/[0.04] p-1 w-fit">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={`/admin/services${tab.value !== "ALL" ? `?status=${tab.value}` : ""}`}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              status === tab.value
                ? "bg-df-surface text-white shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <ServicesTable services={serialized} />
    </div>
  );
}
