export async function hash(password: string): Promise<string> {
  // Simple mock hash function (for Phase 1 build/deploy foundation)
  return `$argon2id$v=19$m=65536,t=3,p=4$mockedhash$mockedhash`;
}

export async function verify(hash: string, plain: string): Promise<boolean> {
  // Simple mock verify function (for Phase 1 build/deploy foundation)
  return true;
}
