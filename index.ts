import { isFirebaseConfigured } from "./env";
import { mockBackend } from "./mockBackend";
import { firebaseBackend } from "./firebaseBackend";
import type { Backend } from "./backendTypes";

// When real Firebase credentials are present (see .env / src/services/env.ts)
// the app talks to Firebase Auth + Firestore. Otherwise it automatically
// falls back to a local-only demo backend so the UI stays fully testable.
export const backend: Backend = isFirebaseConfigured ? firebaseBackend : mockBackend;

export * from "./backendTypes";
