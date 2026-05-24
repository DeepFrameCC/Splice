import { argon2id, argon2Verify } from "hash-wasm";

const PARAMS = {
  parallelism: 1,
  iterations: 3,
  memorySize: 65536, // 64 MB — OWASP 2024 recommendation for Argon2id
  hashLength: 32,
  outputType: "encoded" as const,
};

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return argon2id({ password: plain, salt, ...PARAMS });
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return argon2Verify({ password: plain, hash });
}
