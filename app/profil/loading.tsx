export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded-lg bg-df-cream animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-df-cream animate-pulse" />
        ))}
      </div>
    </div>
  );
}
