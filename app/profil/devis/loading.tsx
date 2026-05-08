export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 rounded-lg bg-df-cream animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-df-cream animate-pulse" />
      ))}
    </div>
  );
}
