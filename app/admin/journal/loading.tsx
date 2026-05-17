export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 rounded-lg bg-df-surface animate-pulse" />
      <div className="h-4 w-40 rounded bg-white/[0.05] animate-pulse" />
      <div className="rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-white/[0.06] px-5 py-4">
              <div className="h-4 w-24 rounded bg-df-surface animate-pulse" />
              <div className="h-4 w-20 rounded bg-df-surface animate-pulse" />
              <div className="h-4 w-28 rounded bg-df-surface animate-pulse" />
              <div className="h-4 w-16 rounded bg-df-surface animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
