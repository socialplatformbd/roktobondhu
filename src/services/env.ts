// Detects whether real Firebase credentials are present. If not, the app
// transparently falls back to a local-only "demo backend" so the frontend
// remains fully testable on a phone with zero backend setup.

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

// When Firebase isn't configured yet, the Firebase SDK is still statically
// imported (so the real backend code is ready to go), but it must never be
// actually called. We hand it harmless placeholder values purely so
// `initializeApp` doesn't throw during module load in demo mode.
export const safeFirebaseConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: "demo-api-key-not-configured",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project-not-configured",
      storageBucket: "demo-project.appspot.com",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:0000000000000000000000",
    };
