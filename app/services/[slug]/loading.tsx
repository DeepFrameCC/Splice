export default function ServiceLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-16">
      <div className="space-y-16 md:space-y-24 animate-pulse">
        {/* Hero skeleton */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Breadcrumb */}
            <div className="h-4 w-48 rounded bg-white/[0.06]" />
            {/* H1 */}
            <div className="h-12 w-full max-w-lg rounded-lg bg-white/[0.06]" />
            <div className="h-12 w-3/4 rounded-lg bg-white/[0.06]" />
            {/* Intro */}
            <div className="h-5 w-full max-w-md rounded bg-white/[0.04] mt-2" />
            <div className="h-5 w-2/3 rounded bg-white/[0.04]" />
            {/* Quick Info Bar */}
            <div className="mt-4 h-20 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
          </div>
          {/* Cover image */}
          <div className="lg:col-span-5 aspect-[4/3] sm:aspect-video lg:aspect-[4/5] rounded-2xl bg-white/[0.04] border border-white/[0.06]" />
        </div>

        {/* Notre Approche skeleton */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-10">
          <div className="flex gap-6">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/[0.06]" />
            <div className="flex-1 space-y-3">
              <div className="h-7 w-3/4 rounded bg-white/[0.06]" />
              <div className="h-4 w-full rounded bg-white/[0.04]" />
              <div className="h-4 w-5/6 rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>

        {/* Features grid skeleton */}
        <div>
          <div className="mb-8 space-y-2">
            <div className="h-3 w-20 rounded bg-white/[0.06]" />
            <div className="h-8 w-56 rounded bg-white/[0.06]" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-3"
              >
                <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
                <div className="h-3 w-full rounded bg-white/[0.04]" />
                <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA skeleton */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-14 flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/[0.06]" />
          <div className="h-8 w-72 rounded-lg bg-white/[0.06]" />
          <div className="h-4 w-96 max-w-full rounded bg-white/[0.04]" />
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-52 rounded-full bg-white/[0.06]" />
            <div className="h-12 w-36 rounded-full bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </main>
  );
}
