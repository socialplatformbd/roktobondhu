import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import type {
  AuthUser,
  BloodRequest,
  BloodRequestResponse,
  BloodRequestStatus,
  ContactRequest,
  DonorExtra,
  DonorPublic,
  Report,
  UserProfile,
} from "@/types";
import { PAGE_SIZE } from "@/utils/constants";
import { auth, db } from "./firebaseApp";
import type {
  Backend,
  BloodRequestFilters,
  BloodRequestInput,
  BloodRequestPage,
  DonorSearchFilters,
  DonorSearchPage,
  ProfileInput,
} from "./backendTypes";

function authUserFromFirebase(user: User | null, isAdmin: boolean): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    isAdmin,
  };
}

async function getAdminFlag(user: User | null): Promise<boolean> {
  if (!user) return false;
  try {
    const token = await user.getIdTokenResult();
    return token.claims.admin === true;
  } catch {
    return false;
  }
}

async function ensureUserDoc(user: User): Promise<void> {
  const ref = doc(db, "users_private", user.uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return;
  const now = Date.now();
  await setDoc(ref, {
    uid: user.uid,
    displayName: user.displayName ?? "User",
    email: user.email,
    emailVerified: user.emailVerified,
    donorConsent: false,
    donorAvailability: "paused",
    preferredLanguage: "bn",
    createdAt: now,
    updatedAt: now,
  } satisfies UserProfile);
}

// Completes a Google sign-in that used the redirect fallback.
getRedirectResult(auth)
  .then((res) => (res ? ensureUserDoc(res.user) : undefined))
  .catch(() => undefined);

class FirebaseBackend implements Backend {
  readonly mode = "firebase" as const;

  onAuthChange(cb: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      const isAdmin = await getAdminFlag(user);
      cb(authUserFromFirebase(user, isAdmin));
    });
  }

  getCurrentUser(): AuthUser | null {
    return authUserFromFirebase(auth.currentUser, false);
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    const now = Date.now();
    try {
      await setDoc(doc(db, "users_private", cred.user.uid), {
        uid: cred.user.uid,
        displayName,
        email: cred.user.email ?? email,
        emailVerified: false,
        donorConsent: false,
        donorAvailability: "paused",
        preferredLanguage: "bn",
        createdAt: now,
        updatedAt: now,
      } satisfies UserProfile);
    } catch {
      // The account exists already; the profile document is created on first
      // "save profile" instead of failing the whole registration.
    }
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      await ensureUserDoc(cred.user);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      // Popups are unreliable on mobile browsers / installed PWAs: fall back to redirect.
      if (
        code === "auth/popup-blocked" ||
        code === "auth/operation-not-supported-in-this-environment" ||
        code === "auth/web-storage-unsupported"
      ) {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw err;
    }
  }

  async signOutUser(): Promise<void> {
    await signOut(auth);
  }

  async sendVerificationEmail(): Promise<void> {
    if (!auth.currentUser) throw new Error("auth/not-signed-in");
    await sendEmailVerification(auth.currentUser);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  async deleteAccount(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const uid = user.uid;

    // Firebase requires a recent sign-in to delete an account. Check BEFORE
    // deleting any data so we never end up with data gone but account alive.
    const lastSignIn = user.metadata.lastSignInTime ? Date.parse(user.metadata.lastSignInTime) : 0;
    if (!lastSignIn || Date.now() - lastSignIn > 4 * 60 * 1000) {
      throw new Error("auth/requires-recent-login");
    }

    // Clean up documents owned by this account before deleting Authentication.
    // Firestore batches are capped at 500 writes; use small chunks.
    const ownedRequests = await getDocs(query(collection(db, "blood_requests"), where("ownerId", "==", uid), fbLimit(100)));
    const receivedContacts = await getDocs(query(collection(db, "contact_requests"), where("donorId", "==", uid), fbLimit(400)));
    const sentContacts = await getDocs(query(collection(db, "contact_requests"), where("requesterId", "==", uid), fbLimit(400)));

    const ownedResponses = await getDocs(query(collection(db, "request_responses"), where("ownerId", "==", uid), fbLimit(100)));
    const sentResponses = await getDocs(query(collection(db, "request_responses"), where("donorId", "==", uid), fbLimit(100)));

    const refs = new Map<string, ReturnType<typeof doc>>();
    refs.set(`users_private/${uid}`, doc(db, "users_private", uid));
    refs.set(`donor_public/${uid}`, doc(db, "donor_public", uid));
    refs.set(`donor_profiles/${uid}`, doc(db, "donor_profiles", uid));
    ownedRequests.docs.forEach((d) => refs.set(`blood_requests/${d.id}`, d.ref));
    ownedRequests.docs.forEach((d) => refs.set(`blood_request_contacts/${d.id}`, doc(db, "blood_request_contacts", d.id)));
    ownedResponses.docs.forEach((d) => refs.set(`request_responses/${d.id}`, d.ref));
    sentResponses.docs.forEach((d) => refs.set(`request_responses/${d.id}`, d.ref));
    receivedContacts.docs.forEach((d) => refs.set(`contact_requests/${d.id}`, d.ref));
    sentContacts.docs.forEach((d) => refs.set(`contact_requests/${d.id}`, d.ref));

    const allRefs = [...refs.values()];
    for (let i = 0; i < allRefs.length; i += 400) {
      const batch = writeBatch(db);
      allRefs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
      await batch.commit();
    }

    // Firebase may require recent authentication; surface that error to the UI.
    await deleteUser(user);
  }

  async getMyProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;
    const snap = await getDoc(doc(db, "users_private", user.uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  }

  async saveMyProfile(input: ProfileInput): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const now = Date.now();
    const existingSnap = await getDoc(doc(db, "users_private", user.uid));
    const existing = existingSnap.exists() ? (existingSnap.data() as UserProfile) : null;

    const profile: UserProfile = {
      uid: user.uid,
      displayName: input.displayName,
      // Keep the stored values: Firestore rules forbid changing email/emailVerified
      // (the typed email may differ in letter case from user.email, and
      // emailVerified flips after the user verifies their address).
      email: existing ? existing.email : user.email,
      emailVerified: existing ? existing.emailVerified : user.emailVerified,
      phone: input.phone,
      bloodGroup: input.bloodGroup,
      area: input.area,
      donorConsent: input.donorConsent,
      donorAvailability: input.donorConsent ? input.donorAvailability : "paused",
      preferredLanguage: input.preferredLanguage,
      consentTimestamp: input.donorConsent ? existing?.consentTimestamp ?? now : null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const batch = writeBatch(db);
    batch.set(doc(db, "users_private", user.uid), profile);

    // Optional bio + photo, stored apart from the public donor card.
    const extraSnap = await getDoc(doc(db, "donor_profiles", user.uid)).catch(() => null);
    const currentExtra = extraSnap && extraSnap.exists() ? (extraSnap.data() as DonorExtra) : null;
    const bio = input.bio !== undefined ? input.bio.trim().slice(0, 150) : currentExtra?.bio ?? "";
    const photo = input.photo === null ? undefined : input.photo !== undefined ? input.photo : currentExtra?.photo;

    if (input.donorConsent && input.bloodGroup && input.area) {
      const firstName = input.displayName.trim().split(/\s+/)[0] || "User";
      const publicDoc: DonorPublic = {
        uid: user.uid,
        displayName: firstName,
        displayNameInitial: firstName.charAt(0).toUpperCase() + ".",
        bloodGroup: input.bloodGroup,
        area: input.area,
        donorAvailability: input.donorAvailability,
        updatedAt: now,
      };
      batch.set(doc(db, "donor_public", user.uid), publicDoc);
      if (bio || photo) {
        const extra: DonorExtra = { uid: user.uid, bio, ...(photo ? { photo } : {}), updatedAt: now };
        batch.set(doc(db, "donor_profiles", user.uid), extra);
      } else {
        batch.delete(doc(db, "donor_profiles", user.uid));
      }
    } else {
      batch.delete(doc(db, "donor_public", user.uid));
      batch.delete(doc(db, "donor_profiles", user.uid));
    }
    await batch.commit();
  }

  async withdrawConsent(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const batch = writeBatch(db);
    batch.update(doc(db, "users_private", user.uid), {
      donorConsent: false,
      donorAvailability: "paused",
      updatedAt: Date.now(),
    });
    batch.delete(doc(db, "donor_public", user.uid));
    batch.delete(doc(db, "donor_profiles", user.uid));
    await batch.commit();
  }

  async searchDonors(filters: DonorSearchFilters, cursor: string | null): Promise<DonorSearchPage> {
    const constraints = [where("donorAvailability", "==", "available")];
    if (filters.bloodGroup && filters.bloodGroup !== "all") {
      constraints.push(where("bloodGroup", "==", filters.bloodGroup));
    }
    if (filters.area && filters.area !== "all") {
      constraints.push(where("area", "==", filters.area));
    }
    let q = query(
      collection(db, "donor_public"),
      ...constraints,
      orderBy("updatedAt", "desc"),
      fbLimit(PAGE_SIZE)
    );
    if (cursor) {
      q = query(
        collection(db, "donor_public"),
        ...constraints,
        orderBy("updatedAt", "desc"),
        startAfter(Number(cursor)),
        fbLimit(PAGE_SIZE)
      );
    }
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => d.data() as unknown as UserProfile);
    const last = snap.docs[snap.docs.length - 1];
    const nextCursor =
      snap.docs.length === PAGE_SIZE && last ? String((last.data() as DonorPublic).updatedAt) : null;
    return { items, cursor: nextCursor };
  }

  async getDonorExtra(uid: string): Promise<DonorExtra | null> {
    if (!auth.currentUser) return null;
    try {
      const snap = await getDoc(doc(db, "donor_profiles", uid));
      return snap.exists() ? (snap.data() as DonorExtra) : null;
    } catch {
      return null;
    }
  }

  async adminRemoveDonorExtra(uid: string): Promise<void> {
    await deleteDoc(doc(db, "donor_profiles", uid));
  }

  async getDonorPublic(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "donor_public", uid));
    if (!snap.exists()) return null;
    return snap.data() as unknown as UserProfile;
  }

  async sendContactRequest(donorUid: string, message: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const donorSnap = await getDoc(doc(db, "donor_public", donorUid));
    if (!donorSnap.exists()) throw new Error("donor/not-available");
    const donor = donorSnap.data() as DonorPublic;
    const id = doc(collection(db, "contact_requests")).id;
    await setDoc(doc(db, "contact_requests", id), {
      id,
      requesterId: user.uid,
      requesterName: user.displayName ?? "User",
      donorId: donorUid,
      bloodGroup: donor.bloodGroup,
      area: donor.area,
      message,
      status: "pending",
      createdAt: Date.now(),
      respondedAt: null,
      donorContactRevealed: null,
    } satisfies ContactRequest);
  }

  async listReceivedContactRequests(): Promise<ContactRequest[]> {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "contact_requests"),
      where("donorId", "==", user.uid),
      orderBy("createdAt", "desc"),
      fbLimit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ContactRequest);
  }

  async listSentContactRequests(): Promise<ContactRequest[]> {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "contact_requests"),
      where("requesterId", "==", user.uid),
      orderBy("createdAt", "desc"),
      fbLimit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ContactRequest);
  }

  async respondToContactRequest(id: string, status: "accepted" | "declined"): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const ref = doc(db, "contact_requests", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("not-found");
    const data = snap.data() as ContactRequest;
    if (data.donorId !== user.uid) throw new Error("forbidden");

    let donorContactRevealed: ContactRequest["donorContactRevealed"] = null;
    if (status === "accepted") {
      const profileSnap = await getDoc(doc(db, "users_private", user.uid));
      const profile = profileSnap.exists() ? (profileSnap.data() as UserProfile) : null;
      donorContactRevealed = {
        ...(profile?.phone ? { phone: profile.phone } : {}),
        ...(profile?.email ? { email: profile.email } : {}),
      };
    }
    await updateDoc(ref, {
      status,
      respondedAt: Date.now(),
      donorContactRevealed,
    });
  }

  async cancelContactRequest(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const ref = doc(db, "contact_requests", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("not-found");
    const data = snap.data() as ContactRequest;
    if (data.requesterId !== user.uid) throw new Error("forbidden");
    await updateDoc(ref, { status: "cancelled" });
  }

  async createBloodRequest(input: BloodRequestInput): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");

    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    const dupQuery = query(
      collection(db, "blood_requests"),
      where("ownerId", "==", user.uid),
      where("bloodGroup", "==", input.bloodGroup),
      orderBy("createdAt", "desc"),
      fbLimit(5)
    );
    const dupSnap = await getDocs(dupQuery);
    const dup = dupSnap.docs.find((d) => {
      const r = d.data() as BloodRequest;
      return (
        r.hospitalName.trim().toLowerCase() === input.hospitalName.trim().toLowerCase() &&
        r.createdAt > fiveMinAgo
      );
    });
    if (dup) throw new Error("request/duplicate");

    const id = doc(collection(db, "blood_requests")).id;
    const now = Date.now();
    const publicRequest: BloodRequest = {
      id,
      ownerId: user.uid,
      ownerName: user.displayName ?? "User",
      bloodGroup: input.bloodGroup,
      area: input.area,
      hospitalName: input.hospitalName,
      neededAt: input.neededAt,
      units: input.units,
      urgency: input.urgency,
      notes: input.notes ?? "",
      ...(input.contactPublicly ? { contactMethod: input.contactMethod, contactPublicly: true } : { contactPublicly: false }),
      status: "open",
      createdAt: now,
      updatedAt: now,
      reportCount: 0,
    };
    const batch = writeBatch(db);
    batch.set(doc(db, "blood_requests", id), publicRequest);
    batch.set(doc(db, "blood_request_contacts", id), {
      requestId: id,
      ownerId: user.uid,
      contactMethod: input.contactMethod,
      createdAt: now,
      updatedAt: now,
    });
    await batch.commit();
  }

  async listBloodRequests(filters: BloodRequestFilters, cursor: string | null): Promise<BloodRequestPage> {
    const constraints = [where("status", "==", "open")];
    if (filters.bloodGroup && filters.bloodGroup !== "all") {
      constraints.push(where("bloodGroup", "==", filters.bloodGroup));
    }
    if (filters.area && filters.area !== "all") {
      constraints.push(where("area", "==", filters.area));
    }
    let q = query(
      collection(db, "blood_requests"),
      ...constraints,
      orderBy("createdAt", "desc"),
      fbLimit(PAGE_SIZE)
    );
    if (cursor) {
      q = query(
        collection(db, "blood_requests"),
        ...constraints,
        orderBy("createdAt", "desc"),
        startAfter(Number(cursor)),
        fbLimit(PAGE_SIZE)
      );
    }
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => d.data() as BloodRequest);
    const last = snap.docs[snap.docs.length - 1];
    const nextCursor =
      snap.docs.length === PAGE_SIZE && last ? String((last.data() as BloodRequest).createdAt) : null;
    return { items, cursor: nextCursor };
  }

  async getBloodRequest(id: string): Promise<BloodRequest | null> {
    const snap = await getDoc(doc(db, "blood_requests", id));
    return snap.exists() ? (snap.data() as BloodRequest) : null;
  }

  async listMyBloodRequests(): Promise<BloodRequest[]> {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "blood_requests"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc"),
      fbLimit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as BloodRequest);
  }

  async updateBloodRequestStatus(id: string, status: BloodRequestStatus): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const ref = doc(db, "blood_requests", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("not-found");
    if ((snap.data() as BloodRequest).ownerId !== user.uid) throw new Error("forbidden");
    await updateDoc(ref, { status, updatedAt: Date.now() });
  }

  async respondToBloodRequest(requestId: string, message: string, contact: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const reqSnap = await getDoc(doc(db, "blood_requests", requestId));
    if (!reqSnap.exists()) throw new Error("not-found");
    const req = reqSnap.data() as BloodRequest;
    if (req.status !== "open") throw new Error("request/closed");
    if (req.ownerId === user.uid) throw new Error("forbidden");
    const id = `${requestId}_${user.uid}`;
    await setDoc(doc(db, "request_responses", id), {
      id,
      requestId,
      ownerId: req.ownerId,
      donorId: user.uid,
      donorName: (user.displayName ?? "User").slice(0, 80),
      message: message.slice(0, 300),
      contact: contact.slice(0, 100),
      createdAt: Date.now(),
    } satisfies BloodRequestResponse);
  }

  async getMyResponseForRequest(requestId: string): Promise<BloodRequestResponse | null> {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      const snap = await getDoc(doc(db, "request_responses", `${requestId}_${user.uid}`));
      return snap.exists() ? (snap.data() as BloodRequestResponse) : null;
    } catch {
      return null;
    }
  }

  async listResponsesForRequest(requestId: string): Promise<BloodRequestResponse[]> {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "request_responses"),
      where("ownerId", "==", user.uid),
      where("requestId", "==", requestId),
      fbLimit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as BloodRequestResponse).sort((a, b) => b.createdAt - a.createdAt);
  }

  async reportItem(targetType: Report["targetType"], targetId: string, reason: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("auth/not-signed-in");
    const id = doc(collection(db, "reports")).id;
    await setDoc(doc(db, "reports", id), {
      id,
      targetType,
      targetId,
      reporterId: user.uid,
      reason,
      createdAt: Date.now(),
      status: "open",
    } satisfies Report);
  }

  async isCurrentUserAdmin(): Promise<boolean> {
    return getAdminFlag(auth.currentUser);
  }

  async adminListUsers(): Promise<UserProfile[]> {
    const q = query(collection(db, "users_private"), orderBy("createdAt", "desc"), fbLimit(200));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as UserProfile);
  }

  async adminListReports(): Promise<Report[]> {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), fbLimit(100));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Report);
  }

  async adminResolveReport(id: string, status: "reviewed" | "dismissed"): Promise<void> {
    await updateDoc(doc(db, "reports", id), { status });
  }

  async adminListOpenBloodRequests(): Promise<BloodRequest[]> {
    const q = query(collection(db, "blood_requests"), orderBy("createdAt", "desc"), fbLimit(100));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as BloodRequest);
  }

  async adminSetBloodRequestStatus(id: string, status: BloodRequestStatus): Promise<void> {
    await updateDoc(doc(db, "blood_requests", id), { status, updatedAt: Date.now() });
  }
}

export const firebaseBackend: Backend = new FirebaseBackend();
