const PARAMS = {
  parallelism: 1,
  iterations: 3,
  memorySize: 65536, // 64 MB — OWASP 2024 recommendation for Argon2id
  hashLength: 32,
  outputType: "encoded" as const,
};

export async function hashPassword(plain: string): Promise<string> {
  const { argon2id } = await import("hash-wasm");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return argon2id({ password: plain, salt, ...PARAMS });
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  const { argon2Verify } = await import("hash-wasm");
  return argon2Verify({ password: plain, hash });
}
