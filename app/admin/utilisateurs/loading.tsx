export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 rounded-lg bg-df-surface animate-pulse" />
      <div className="h-4 w-56 rounded bg-white/[0.05] animate-pulse" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08] animate-pulse" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08] animate-pulse" />
    </div>
  );
}
