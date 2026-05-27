interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  inHead?: boolean;
}

export default function JsonLd({ data, inHead }: JsonLdProps) {
  const json = JSON.stringify(data);

  if (inHead) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    );
  }

  return (
    <div
      hidden
      dangerouslySetInnerHTML={{
        __html: `<script type="application/ld+json">${json}</script>`,
      }}
    />
  );
}
