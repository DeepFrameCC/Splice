export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
      <div className="h-8 w-56 rounded-lg bg-df-cream animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-df-cream animate-pulse" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-df-cream animate-pulse" />
    </div>
  );
}
