/**
 * RoktoBondhu — one-time admin assignment script.
 *
 * This is a TRUSTED, SERVER-SIDE-ONLY script. Run it from your own computer
 * (NOT from the phone, NOT committed with secrets, NOT part of the deployed
 * website). It uses the Firebase Admin SDK with a Service Account key to set
 * a secure custom claim { admin: true } on a specific user's Firebase Auth
 * account. The deployed app's Firestore rules trust ONLY this claim —
 * never a Firestore field — to decide admin access.
 *
 * HOW TO USE (see docs/FIREBASE_SETUP_BN.md for full step-by-step Bangla
 * instructions):
 *   1. Firebase Console > Project settings > Service accounts >
 *      "Generate new private key". This downloads a JSON file.
 *   2. Save it OUTSIDE your source code, e.g. as serviceAccountKey.json in
 *      this scripts/ folder. Make sure it is listed in .gitignore and is
 *      NEVER committed or uploaded anywhere public.
 *   3. Run:  node scripts/setAdminClaim.cjs <user-uid> serviceAccountKey.json
 *   4. The target user must sign out and sign in again for the new claim to
 *      take effect in their ID token.
 */

const fs = require("fs");
const path = require("path");

const [, , uid, keyFileArg] = process.argv;

if (!uid) {
  console.error("Usage: node scripts/setAdminClaim.cjs <user-uid> [serviceAccountKey.json]");
  process.exit(1);
}

const keyFile = keyFileArg || path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(keyFile)) {
  console.error(`Service account key file not found at: ${keyFile}`);
  console.error("Download it from Firebase Console > Project settings > Service accounts.");
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require(keyFile)),
});

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Success: uid ${uid} now has { admin: true } custom claim.`);
    console.log("Ask that user to sign out and sign back in to refresh their token.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to set admin claim:", err);
    process.exit(1);
  });
