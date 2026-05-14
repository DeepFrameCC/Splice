export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-10 w-48 rounded-lg bg-df-cream animate-pulse" />
        <div className="mt-2 h-4 w-40 rounded bg-df-cream/60 animate-pulse" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-df-blue/5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-df-cream animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-df-cream animate-pulse" />
              <div className="h-3 w-64 rounded bg-df-cream/60 animate-pulse" />
              <div className="h-3 w-24 rounded bg-df-cream/40 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
