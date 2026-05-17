export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-36 rounded-lg bg-df-surface animate-pulse" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-video rounded-2xl bg-df-surface animate-pulse" />
        ))}
      </div>
    </div>
  );
}
