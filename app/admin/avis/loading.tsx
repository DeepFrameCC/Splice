export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-10 w-48 rounded-lg bg-df-surface animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded bg-white/[0.05] animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08] animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
