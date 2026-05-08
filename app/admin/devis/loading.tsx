export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-4">
      <div className="h-8 w-40 rounded-lg bg-df-cream animate-pulse" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-df-cream animate-pulse" />
      ))}
    </div>
  );
}
