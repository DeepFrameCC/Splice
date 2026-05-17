const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: "Brouillon",
    className: "bg-amber-500/15 text-amber-700",
  },
  PUBLISHED: {
    label: "Publié",
    className: "bg-green-100 text-green-700",
  },
  ARCHIVED: {
    label: "Archivé",
    className: "bg-gray-100 text-gray-600",
  },
};

interface BlogStatusBadgeProps {
  status: string;
}

export default function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
