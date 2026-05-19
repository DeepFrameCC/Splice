export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
      <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
      <div className="mt-6 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
