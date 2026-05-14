export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-16 rounded bg-df-blue/10" />
        <div className="h-10 w-2/3 rounded bg-df-blue/10" />
        <div className="h-4 w-1/2 rounded bg-df-blue/10" />
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10">
              <div className="h-3 w-24 rounded bg-df-blue/10" />
              <div className="mt-3 h-6 w-3/4 rounded bg-df-blue/10" />
              <div className="mt-2 h-4 w-full rounded bg-df-blue/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
