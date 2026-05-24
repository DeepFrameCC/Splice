import type { R2Bucket } from "@cloudflare/workers-types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type BucketName = "SPLICE_CDN" | "SPLICE_DELIVERIES" | "SPLICE_ARCHIVE";

export function getBucket(name: BucketName): R2Bucket {
  const { env } = getCloudflareContext();
  const bucket = (env as unknown as Record<BucketName, R2Bucket>)[name];
  if (!bucket) throw new Error(`[r2] Bucket binding "${name}" not found in env`);
  return bucket;
}

export async function putObject(
  bucket: BucketName,
  key: string,
  body: ReadableStream | ArrayBuffer | ArrayBufferView,
  options?: { contentType?: string; cacheControl?: string; customMetadata?: Record<string, string> },
) {
  const r2 = getBucket(bucket);
  return r2.put(key, body as unknown as ArrayBuffer, {
    httpMetadata: {
      contentType: options?.contentType,
      cacheControl: options?.cacheControl,
    },
    customMetadata: options?.customMetadata,
  });
}

export async function getObject(bucket: BucketName, key: string) {
  return getBucket(bucket).get(key);
}

export async function deleteObject(bucket: BucketName, key: string) {
  return getBucket(bucket).delete(key);
}
