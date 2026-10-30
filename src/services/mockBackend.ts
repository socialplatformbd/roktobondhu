import type {
  DonorExtra,
  AuthUser,
  BloodRequest,
  BloodRequestResponse,
  BloodRequestStatus,
  ContactRequest,
  Report,
  UserProfile,
} from "@/types";
import { PAGE_SIZE } from "@/utils/constants";
import { genId, hashSecret, readJson, writeJson } from "./demoStorage";
import type {
  Backend,
  BloodRequestFilters,
  BloodRequestInput,
  BloodRequestPage,
  DonorSearchFilters,
  DonorSearchPage,
  ProfileInput,
} from "./backendTypes";

interface DemoAccount {
  uid: string;
  email: string;
  passwordHash: string;
  displayName: string;
  emailVerified: boolean;
}

const K_ACCOUNTS = "rb_demo_accounts";
const K_SESSION = "rb_demo_session";
const K_PROFILES = "rb_demo_profiles";
const K_CONTACT_REQS = "rb_demo_contact_requests";
const K_BLOOD_REQS = "rb_demo_blood_requests";
const K_REPORTS = "rb_demo_reports";
const K_ADMIN = "rb_demo_admin";
const K_RESPONSES = "rb_demo_responses";
const K_EXTRA = "rb_demo_donor_extra";

type Listener = (user: AuthUser | null) => void;

function loadAccounts(): DemoAccount[] {
  return readJson<DemoAccount[]>(K_ACCOUNTS, []);
}
function saveAccounts(list: DemoAccount[]) {
  writeJson(K_ACCOUNTS, list);
}
function loadProfiles(): Record<string, UserProfile> {
  return readJson<Record<string, UserProfile>>(K_PROFILES, {});
}
function saveProfiles(p: Record<string, UserProfile>) {
  writeJson(K_PROFILES, p);
}
function loadContactReqs(): ContactRequest[] {
  return readJson<ContactRequest[]>(K_CONTACT_REQS, []);
}
function saveContactReqs(list: ContactRequest[]) {
  writeJson(K_CONTACT_REQS, list);
}
function loadBloodReqs(): BloodRequest[] {
  return readJson<BloodRequest[]>(K_BLOOD_REQS, []);
}
function saveBloodReqs(list: BloodRequest[]) {
  writeJson(K_BLOOD_REQS, list);
}
function loadReports(): Report[] {
  return readJson<Report[]>(K_REPORTS, []);
}
function saveReports(list: Report[]) {
  writeJson(K_REPORTS, list);
}

function loadResponses(): BloodRequestResponse[] {
  return readJson<BloodRequestResponse[]>(K_RESPONSES, []);
}
function saveResponses(list: BloodRequestResponse[]) {
  writeJson(K_RESPONSES, list);
}

function loadExtra(): Record<string, DonorExtra> {
  return readJson<Record<string, DonorExtra>>(K_EXTRA, {});
}
function saveExtra(x: Record<string, DonorExtra>) {
  writeJson(K_EXTRA, x);
}

function currentSessionUid(): string | null {
  return readJson<string | null>(K_SESSION, null);
}

function accountToAuthUser(a: DemoAccount): AuthUser {
  return {
    uid: a.uid,
    email: a.email,
    emailVerified: a.emailVerified,
    displayName: a.displayName,
    isAdmin: readJson<boolean>(K_ADMIN, false),
  };
}

function expireIfNeeded(req: BloodRequest): BloodRequest {
  if (req.status === "open" && req.neededAt < Date.now() - 1000 * 60 * 60 * 24) {
    return { ...req, status: "expired" };
  }
  return req;
}

class MockBackend implements Backend {
  readonly mode = "demo" as const;
  private listeners: Listener[] = [];

  constructor() {
    window.addEventListener("storage", () => {
      this.emit();
    });
  }

  private emit() {
    const user = this.getCurrentUser();
    this.listeners.forEach((l) => l(user));
  }

  onAuthChange(cb: Listener): () => void {
    this.listeners.push(cb);
    cb(this.getCurrentUser());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  getCurrentUser(): AuthUser | null {
    const uid = currentSessionUid();
    if (!uid) return null;
    const acc = loadAccounts().find((a) => a.uid === uid);
    return acc ? accountToAuthUser(acc) : null;
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<void> {
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("auth/email-already-in-use");
    }
    const uid = genId();
    const passwordHash = await hashSecret(password);
    const account: DemoAccount = {
      uid,
      email,
      passwordHash,
      displayName,
      emailVerified: false,
    };
    accounts.push(account);
    saveAccounts(accounts);
    writeJson(K_SESSION, uid);

    const now = Date.now();
    const profiles = loadProfiles();
    profiles[uid] = {
      uid,
      displayName,
      email,
      emailVerified: false,
      donorConsent: false,
      donorAvailability: "paused",
      preferredLanguage: "bn",
      createdAt: now,
      updatedAt: now,
    };
    saveProfiles(profiles);
    this.emit();
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    const accounts = loadAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account) throw new Error("auth/user-not-found");
    const hash = await hashSecret(password);
    if (hash !== account.passwordHash) throw new Error("auth/wrong-password");
    writeJson(K_SESSION, account.uid);
    this.emit();
  }

  async signInWithGoogle(): Promise<void> {
    // In demo mode we cannot perform a real Google OAuth sign-in.
    throw new Error("demo/google-not-available");
  }

  async signOutUser(): Promise<void> {
    writeJson(K_SESSION, null);
    this.emit();
  }

  async sendVerificationEmail(): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    // Demo mode cannot send real emails; mark verified locally so the
    // flow can still be exercised end-to-end for UI testing purposes.
    const accounts = loadAccounts();
    const idx = accounts.findIndex((a) => a.uid === uid);
    if (idx >= 0) {
      accounts[idx].emailVerified = true;
      saveAccounts(accounts);
      this.emit();
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    const accounts = loadAccounts();
    if (!accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("auth/user-not-found");
    }
    // No real email can be sent in demo mode.
  }

  async deleteAccount(): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) return;
    saveAccounts(loadAccounts().filter((a) => a.uid !== uid));
    const profiles = loadProfiles();
    delete profiles[uid];
    saveProfiles(profiles);
    const extras = loadExtra();
    delete extras[uid];
    saveExtra(extras);
    saveContactReqs(loadContactReqs().filter((c) => c.requesterId !== uid && c.donorId !== uid));
    saveBloodReqs(loadBloodReqs().filter((b) => b.ownerId !== uid));
    saveResponses(loadResponses().filter((r) => r.ownerId !== uid && r.donorId !== uid));
    writeJson(K_SESSION, null);
    this.emit();
  }

  async getMyProfile(): Promise<UserProfile | null> {
    const uid = currentSessionUid();
    if (!uid) return null;
    return loadProfiles()[uid] ?? null;
  }

  async saveMyProfile(input: ProfileInput): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const profiles = loadProfiles();
    const existing = profiles[uid];
    const now = Date.now();
    profiles[uid] = {
      ...existing,
      uid,
      email: existing?.email ?? null,
      emailVerified: existing?.emailVerified ?? false,
      displayName: input.displayName,
      phone: input.phone,
      bloodGroup: input.bloodGroup,
      area: input.area,
      donorConsent: input.donorConsent,
      donorAvailability: input.donorConsent ? input.donorAvailability : "paused",
      preferredLanguage: input.preferredLanguage,
      consentTimestamp: input.donorConsent
        ? existing?.consentTimestamp ?? now
        : null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    saveProfiles(profiles);

    const extras = loadExtra();
    const cur = extras[uid];
    const bio = input.bio !== undefined ? input.bio.trim().slice(0, 150) : cur?.bio ?? "";
    const photo = input.photo === null ? undefined : input.photo !== undefined ? input.photo : cur?.photo;
    if (input.donorConsent && input.bloodGroup && input.area && (bio || photo)) {
      extras[uid] = { uid, bio, ...(photo ? { photo } : {}), updatedAt: now };
    } else {
      delete extras[uid];
    }
    saveExtra(extras);

    // Keep the account's display name in sync
    const accounts = loadAccounts();
    const idx = accounts.findIndex((a) => a.uid === uid);
    if (idx >= 0) {
      accounts[idx].displayName = input.displayName;
      saveAccounts(accounts);
    }
    this.emit();
  }

  async withdrawConsent(): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const profiles = loadProfiles();
    if (profiles[uid]) {
      profiles[uid].donorConsent = false;
      profiles[uid].donorAvailability = "paused";
      profiles[uid].updatedAt = Date.now();
      saveProfiles(profiles);
    }
    const extras = loadExtra();
    delete extras[uid];
    saveExtra(extras);
  }

  async searchDonors(filters: DonorSearchFilters, cursor: string | null): Promise<DonorSearchPage> {
    const all = Object.values(loadProfiles()).filter(
      (p) => p.donorConsent && p.donorAvailability === "available" && p.bloodGroup && p.area
    );
    const filtered = all.filter((p) => {
      if (filters.bloodGroup && filters.bloodGroup !== "all" && p.bloodGroup !== filters.bloodGroup) {
        return false;
      }
      if (filters.area && filters.area !== "all" && p.area !== filters.area) {
        return false;
      }
      return true;
    });
    filtered.sort((a, b) => b.updatedAt - a.updatedAt);
    const start = cursor ? parseInt(cursor, 10) : 0;
    const page = filtered.slice(start, start + PAGE_SIZE);
    const nextCursor = start + PAGE_SIZE < filtered.length ? String(start + PAGE_SIZE) : null;
    return { items: page, cursor: nextCursor };
  }

  async getDonorPublic(uid: string): Promise<UserProfile | null> {
    const profile = loadProfiles()[uid];
    if (!profile || !profile.donorConsent || profile.donorAvailability !== "available") return null;
    return profile;
  }

  async sendContactRequest(donorUid: string, message: string): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const profiles = loadProfiles();
    const me = profiles[uid];
    const donor = profiles[donorUid];
    if (!donor || !donor.donorConsent || donor.donorAvailability !== "available") {
      throw new Error("donor/not-available");
    }
    const list = loadContactReqs();
    const req: ContactRequest = {
      id: genId(),
      requesterId: uid,
      requesterName: me?.displayName ?? "User",
      donorId: donorUid,
      bloodGroup: donor.bloodGroup!,
      area: donor.area!,
      message,
      status: "pending",
      createdAt: Date.now(),
      respondedAt: null,
      donorContactRevealed: null,
    };
    list.push(req);
    saveContactReqs(list);
  }

  async listReceivedContactRequests(): Promise<ContactRequest[]> {
    const uid = currentSessionUid();
    if (!uid) return [];
    return loadContactReqs()
      .filter((r) => r.donorId === uid)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async listSentContactRequests(): Promise<ContactRequest[]> {
    const uid = currentSessionUid();
    if (!uid) return [];
    const profiles = loadProfiles();
    return loadContactReqs()
      .filter((r) => r.requesterId === uid)
      .map((r) => {
        if (r.status === "accepted") {
          const donor = profiles[r.donorId];
          return {
            ...r,
            donorContactRevealed: donor
              ? { phone: donor.phone, email: donor.email ?? undefined }
              : null,
          };
        }
        return r;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async respondToContactRequest(id: string, status: "accepted" | "declined"): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const list = loadContactReqs();
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("not-found");
    if (list[idx].donorId !== uid) throw new Error("forbidden");
    list[idx].status = status;
    list[idx].respondedAt = Date.now();
    saveContactReqs(list);
  }

  async cancelContactRequest(id: string): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const list = loadContactReqs();
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("not-found");
    if (list[idx].requesterId !== uid) throw new Error("forbidden");
    list[idx].status = "cancelled";
    saveContactReqs(list);
  }

  async createBloodRequest(input: BloodRequestInput): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const profiles = loadProfiles();
    const me = profiles[uid];

    // simple spam/duplicate guard: block identical hospital+bloodGroup within 5 minutes
    const existing = loadBloodReqs();
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    const dup = existing.find(
      (r) =>
        r.ownerId === uid &&
        r.hospitalName.trim().toLowerCase() === input.hospitalName.trim().toLowerCase() &&
        r.bloodGroup === input.bloodGroup &&
        r.createdAt > fiveMinAgo
    );
    if (dup) throw new Error("request/duplicate");

    const now = Date.now();
    const req: BloodRequest = {
      id: genId(),
      ownerId: uid,
      ownerName: me?.displayName ?? "User",
      bloodGroup: input.bloodGroup,
      area: input.area,
      hospitalName: input.hospitalName,
      neededAt: input.neededAt,
      units: input.units,
      urgency: input.urgency,
      notes: input.notes,
      ...(input.contactPublicly ? { contactMethod: input.contactMethod, contactPublicly: true } : { contactPublicly: false }),
      status: "open",
      createdAt: now,
      updatedAt: now,
      reportCount: 0,
    };
    existing.push(req);
    saveBloodReqs(existing);
  }

  async listBloodRequests(filters: BloodRequestFilters, cursor: string | null): Promise<BloodRequestPage> {
    let all = loadBloodReqs().map(expireIfNeeded);
    all = all.filter((r) => r.status === "open");
    const filtered = all.filter((r) => {
      if (filters.bloodGroup && filters.bloodGroup !== "all" && r.bloodGroup !== filters.bloodGroup) return false;
      if (filters.area && filters.area !== "all" && r.area !== filters.area) return false;
      return true;
    });
    filtered.sort((a, b) => b.createdAt - a.createdAt);
    const start = cursor ? parseInt(cursor, 10) : 0;
    const page = filtered.slice(start, start + PAGE_SIZE);
    const nextCursor = start + PAGE_SIZE < filtered.length ? String(start + PAGE_SIZE) : null;
    return { items: page, cursor: nextCursor };
  }

  async getBloodRequest(id: string): Promise<BloodRequest | null> {
    const found = loadBloodReqs().find((r) => r.id === id);
    return found ? expireIfNeeded(found) : null;
  }

  async listMyBloodRequests(): Promise<BloodRequest[]> {
    const uid = currentSessionUid();
    if (!uid) return [];
    return loadBloodReqs()
      .map(expireIfNeeded)
      .filter((r) => r.ownerId === uid)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async updateBloodRequestStatus(id: string, status: BloodRequestStatus): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const list = loadBloodReqs();
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("not-found");
    if (list[idx].ownerId !== uid) throw new Error("forbidden");
    list[idx].status = status;
    list[idx].updatedAt = Date.now();
    saveBloodReqs(list);
  }

  async reportItem(targetType: Report["targetType"], targetId: string, reason: string): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const list = loadReports();
    list.push({
      id: genId(),
      targetType,
      targetId,
      reporterId: uid,
      reason,
      createdAt: Date.now(),
      status: "open",
    });
    saveReports(list);

    if (targetType === "blood_request") {
      const reqs = loadBloodReqs();
      const idx = reqs.findIndex((r) => r.id === targetId);
      if (idx >= 0) {
        reqs[idx].reportCount = (reqs[idx].reportCount ?? 0) + 1;
        saveBloodReqs(reqs);
      }
    }
  }

  async getDonorExtra(uid: string): Promise<DonorExtra | null> {
    if (!currentSessionUid()) return null;
    return loadExtra()[uid] ?? null;
  }

  async adminRemoveDonorExtra(uid: string): Promise<void> {
    const extras = loadExtra();
    delete extras[uid];
    saveExtra(extras);
  }

  async respondToBloodRequest(requestId: string, message: string, contact: string): Promise<void> {
    const uid = currentSessionUid();
    if (!uid) throw new Error("auth/not-signed-in");
    const req = loadBloodReqs().find((r) => r.id === requestId);
    if (!req) throw new Error("not-found");
    if (expireIfNeeded(req).status !== "open") throw new Error("request/closed");
    if (req.ownerId === uid) throw new Error("forbidden");
    const id = `${requestId}_${uid}`;
    const list = loadResponses();
    if (list.some((r) => r.id === id)) throw new Error("already-responded");
    const me = loadProfiles()[uid];
    list.push({
      id,
      requestId,
      ownerId: req.ownerId,
      donorId: uid,
      donorName: me?.displayName ?? "User",
      message: message.slice(0, 300),
      contact: contact.slice(0, 100),
      createdAt: Date.now(),
    });
    saveResponses(list);
  }

  async getMyResponseForRequest(requestId: string): Promise<BloodRequestResponse | null> {
    const uid = currentSessionUid();
    if (!uid) return null;
    return loadResponses().find((r) => r.id === `${requestId}_${uid}`) ?? null;
  }

  async listResponsesForRequest(requestId: string): Promise<BloodRequestResponse[]> {
    const uid = currentSessionUid();
    if (!uid) return [];
    return loadResponses()
      .filter((r) => r.requestId === requestId && r.ownerId === uid)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async adminListUsers(): Promise<UserProfile[]> {
    const accounts = loadAccounts();
    return Object.values(loadProfiles())
      .map((p) => ({ ...p, email: p.email ?? accounts.find((a) => a.uid === p.uid)?.email ?? null }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async isCurrentUserAdmin(): Promise<boolean> {
    return readJson<boolean>(K_ADMIN, false);
  }

  async adminListReports(): Promise<Report[]> {
    return loadReports().sort((a, b) => b.createdAt - a.createdAt);
  }

  async adminResolveReport(id: string, status: "reviewed" | "dismissed"): Promise<void> {
    const list = loadReports();
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      saveReports(list);
    }
  }

  async adminListOpenBloodRequests(): Promise<BloodRequest[]> {
    return loadBloodReqs().map(expireIfNeeded).sort((a, b) => b.createdAt - a.createdAt);
  }

  async adminSetBloodRequestStatus(id: string, status: BloodRequestStatus): Promise<void> {
    const list = loadBloodReqs();
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      list[idx].updatedAt = Date.now();
      saveBloodReqs(list);
    }
  }
}

export function setDemoAdminFlag(value: boolean) {
  writeJson(K_ADMIN, value);
}
export function getDemoAdminFlag(): boolean {
  return readJson<boolean>(K_ADMIN, false);
}

export const mockBackend: Backend = new MockBackend();
