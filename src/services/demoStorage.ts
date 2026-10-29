// Small helpers for the local-only demo backend. Demo mode is used ONLY when
// Firebase has not been configured (see src/services/env.ts), so a beginner
// can test the full UI before setting up a real backend.

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private-mode errors
  }
}

export function genId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

// We never store plaintext passwords, even in the local demo backend.
// This uses the browser's SubtleCrypto to keep only a SHA-256 digest,
// purely so the demo login flow can validate credentials offline.
export async function hashSecret(value: string): Promise<string> {
  const enc = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
