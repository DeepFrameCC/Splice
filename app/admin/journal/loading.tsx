export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 rounded-lg bg-df-cream animate-pulse" />
      <div className="h-4 w-40 rounded bg-df-cream/60 animate-pulse" />
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-df-blue/10">
        <div className="space-y-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-df-blue/5 px-5 py-4">
              <div className="h-4 w-24 rounded bg-df-cream animate-pulse" />
              <div className="h-4 w-20 rounded bg-df-cream animate-pulse" />
              <div className="h-4 w-28 rounded bg-df-cream animate-pulse" />
              <div className="h-4 w-16 rounded bg-df-cream animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
