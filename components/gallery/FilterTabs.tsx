import Link from "next/link";

const tabs: { value?: string; label: string }[] = [
  { value: undefined, label: "Tous" },
  { value: "LOUISIA", label: "@by.louisia" },
  { value: "TY",      label: "@t.y97one" },
];

export default function FilterTabs({
  basePath,
  current,
  extraParams = {},
}: {
  basePath: string;
  current?: string;
  extraParams?: Record<string, string>;
}) {
  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const params = new URLSearchParams(extraParams);
        if (t.value) params.set("owner", t.value);
        const href = params.size > 0 ? `${basePath}?${params}` : basePath;
        const active = (current ?? undefined) === t.value;
        return (
          <Link
            key={t.label}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              active ? "bg-df-gold text-white" : "bg-df-surface text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
