export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-6">
      <div className="h-10 w-40 rounded-lg bg-df-cream animate-pulse" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-video rounded-2xl bg-df-cream animate-pulse" />
        ))}
      </div>
    </div>
  );
}
