export default function AdminBlogLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded bg-white/10" />
          <div className="h-4 w-20 rounded bg-white/10" />
        </div>
        <div className="h-10 w-36 rounded-full bg-df-gold/30" />
      </div>
      <div className="h-10 w-80 rounded-xl bg-white/5" />
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-df-surface">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-4">
            <div className="h-5 flex-1 rounded bg-white/10" />
            <div className="h-5 w-16 rounded-full bg-white/10" />
            <div className="h-5 w-24 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
