export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-10 w-40 rounded-lg bg-df-cream animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded bg-df-cream/60 animate-pulse" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
          <div className="h-6 w-48 rounded bg-df-cream animate-pulse" />
          <div className="mt-6 space-y-4">
            <div className="h-10 w-full rounded-xl bg-df-cream/50 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-df-cream/50 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
