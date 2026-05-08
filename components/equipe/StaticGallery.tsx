"use client";

export default function StaticGallery({
  items,
}: {
  items: { src: string; title: string; type: "video" | "image" }[];
}) {
  return (
    <div data-anim="founder-gallery" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.src}
          className="group relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          style={{ aspectRatio: item.type === "video" ? "16/9" : "4/3" }}
        >
          {item.type === "video" ? (
            <video
              className="h-full w-full object-cover"
              src={item.src}
              muted
              loop
              playsInline
              preload="metadata"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            <img
              className="h-full w-full object-cover transition group-hover:scale-105"
              src={item.src}
              alt={item.title}
              loading="lazy"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8">
            <p className="text-xs font-bold text-white">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
