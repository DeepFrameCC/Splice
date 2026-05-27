interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  inHead?: boolean;
  nonce?: string;
}

export default function JsonLd({ data, inHead, nonce }: JsonLdProps) {
  const json = JSON.stringify(data);

  if (inHead) {
    return (
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    );
  }

  return (
    <div
      hidden
      dangerouslySetInnerHTML={{
        __html: `<script type="application/ld+json" ${nonce ? `nonce="${nonce}"` : ""}>${json}</script>`,
      }}
    />
  );
}
