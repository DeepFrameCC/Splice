export default function Loading() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "80px 40px 40px" }}>
        {/* Eyebrow */}
        <div className="h-3 w-20 rounded bg-[#1901AD]/10 animate-pulse" />
        {/* Title */}
        <div className="mt-5 h-20 w-[600px] max-w-full rounded-lg bg-[#1901AD]/8 animate-pulse" />
        {/* Paragraph */}
        <div className="mt-5 h-5 w-96 max-w-full rounded bg-black/5 animate-pulse" />
      </div>

      {/* Tabs skeleton */}
      <div style={{ maxWidth: 1320, margin: "36px auto 0", padding: "0 40px" }} className="flex gap-2 border-b border-black/10 pb-4">
        <div className="h-8 w-24 rounded bg-black/5 animate-pulse" />
        <div className="h-8 w-24 rounded bg-black/5 animate-pulse" />
      </div>

      {/* Chips skeleton */}
      <div style={{ maxWidth: 1320, margin: "32px auto 0", padding: "0 40px" }} className="flex gap-2">
        {["w-14", "w-24", "w-28", "w-28", "w-24"].map((w, i) => (
          <div key={i} className={`h-8 ${w} rounded-full bg-black/5 animate-pulse`} />
        ))}
      </div>

      {/* Grid skeleton */}
      <div style={{ maxWidth: 1320, margin: "28px auto 0", padding: "0 40px 80px" }} className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3.5">
            <div className="aspect-[4/3] rounded-[14px] bg-black/5 animate-pulse" />
            <div className="space-y-2">
              <div className="h-2.5 w-28 rounded bg-black/5 animate-pulse" />
              <div className="h-5 w-48 rounded bg-black/5 animate-pulse" />
              <div className="h-3 w-32 rounded bg-black/5 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
