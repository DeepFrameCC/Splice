export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-44 rounded-lg bg-df-surface animate-pulse" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-df-surface animate-pulse" />
      ))}
    </div>
  );
}
