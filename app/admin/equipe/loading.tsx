export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-36 rounded-xl bg-df-surface" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/[0.05]" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-white/[0.04]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-white/[0.05]" />
        ))}
      </div>
    </div>
  );
}
