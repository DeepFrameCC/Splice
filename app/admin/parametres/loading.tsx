export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-44 rounded-xl bg-df-surface" />
      <div className="h-64 rounded-2xl bg-white/[0.04]" />
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-white/[0.05]" />
        ))}
      </div>
    </div>
  );
}
