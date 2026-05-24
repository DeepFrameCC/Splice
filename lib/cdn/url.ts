const CDN_BASE = process.env.R2_PUBLIC_DOMAIN || "cdn.splicestudio.fr";

export function cdnUrl(key: string, version?: string | number): string {
  const url = `https://${CDN_BASE}/${key}`;
  return version ? `${url}?v=${version}` : url;
}
