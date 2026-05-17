import { Clock, User } from "lucide-react";

interface BlogAuthorRowProps {
  author: { pseudo: string; id: string } | null;
  publishedAt: Date;
  readingTimeMin: number;
  compact?: boolean;
}

export default function BlogAuthorRow({
  author,
  publishedAt,
  readingTimeMin,
  compact,
}: BlogAuthorRowProps) {
  const date = new Date(publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={`flex items-center gap-3 ${compact ? "text-xs" : "text-sm"} text-white/50`}>
      {/* Avatar */}
      {author && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center rounded-full bg-white/10 ${compact ? "h-6 w-6" : "h-8 w-8"}`}>
            <User className={compact ? "h-3 w-3" : "h-4 w-4"} />
          </div>
          <span className="font-medium text-white/70">{author.pseudo}</span>
          <span className="text-white/30">·</span>
        </div>
      )}

      <time dateTime={new Date(publishedAt).toISOString()}>
        {date}
      </time>

      <span className="text-white/30">·</span>

      <span className="flex items-center gap-1">
        <Clock className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        {readingTimeMin} min
      </span>
    </div>
  );
}
