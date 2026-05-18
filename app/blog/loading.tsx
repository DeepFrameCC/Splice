export default function BlogLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-df-ink py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto h-3 w-32 rounded bg-white/10" />
          <div className="mx-auto mt-4 h-12 w-2/3 rounded bg-white/10" />
          <div className="mx-auto mt-5 h-4 w-1/2 rounded bg-white/10" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Featured card skeleton */}
        <div className="mb-12 overflow-hidden rounded-2xl bg-df-surface shadow-lg ring-1 ring-white/[0.08] md:grid md:grid-cols-2">
          <div className="aspect-video bg-df-surface md:aspect-auto md:min-h-[320px]" />
          <div className="space-y-4 p-8">
            <div className="h-4 w-20 rounded bg-white/10" />
            <div className="h-8 w-3/4 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-df-surface shadow-sm ring-1 ring-white/[0.08]">
              <div className="aspect-video bg-df-surface" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="h-5 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
