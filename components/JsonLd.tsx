interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <div style={{ display: "none" }} className="hidden" aria-hidden="true">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        className="hidden"
        style={{ display: "none" }}
      />
    </div>
  );
}

