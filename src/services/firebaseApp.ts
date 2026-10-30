import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { safeFirebaseConfig } from "./env";

const existing = getApps();
export const firebaseApp = existing.length ? existing[0] : initializeApp(safeFirebaseConfig);

export const auth = getAuth(firebaseApp);

// ignoreUndefinedProperties: optional fields (phone, bloodGroup, area) may be
// undefined; without this Firestore throws on setDoc/batch.set.
export const db = existing.length
  ? getFirestore(firebaseApp)
  : initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true,
      // Falls back to long polling on networks that block Firestore streaming.
      experimentalAutoDetectLongPolling: true,
    });
