const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: {
    label: "Brouillon",
    className: "bg-amber-500/15 text-amber-400",
  },
  PUBLISHED: {
    label: "Publié",
    className: "bg-green-500/15 text-green-400",
  },
  ARCHIVED: {
    label: "Archivé",
    className: "bg-white/[0.08] text-white/50",
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
