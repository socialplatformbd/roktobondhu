import type {
  AreaId,
  AuthUser,
  BloodGroup,
  BloodRequest,
  BloodRequestResponse,
  BloodRequestStatus,
  ContactRequest,
  DonorAvailability,
  Lang,
  Report,
  UrgencyLevel,
  UserProfile,
} from "@/types";

export interface DonorSearchFilters {
  bloodGroup?: BloodGroup | "all";
  area?: AreaId | "all";
}

export interface DonorSearchPage {
  items: UserProfile[];
  cursor: string | null; // opaque cursor for next page, null = no more
}

export interface BloodRequestFilters {
  bloodGroup?: BloodGroup | "all";
  area?: AreaId | "all";
}

export interface BloodRequestPage {
  items: BloodRequest[];
  cursor: string | null;
}

export interface ProfileInput {
  displayName: string;
  phone?: string;
  bloodGroup?: BloodGroup;
  area?: AreaId;
  donorConsent: boolean;
  donorAvailability: DonorAvailability;
  preferredLanguage: Lang;
}

export interface BloodRequestInput {
  bloodGroup: BloodGroup;
  area: AreaId;
  hospitalName: string;
  neededAt: number;
  units: number;
  urgency: UrgencyLevel;
  notes?: string;
  contactMethod: string;
  contactPublicly: boolean;
}

export interface Backend {
  readonly mode: "firebase" | "demo";

  // Auth
  onAuthChange(cb: (user: AuthUser | null) => void): () => void;
  getCurrentUser(): AuthUser | null;
  signUpWithEmail(email: string, password: string, displayName: string): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signOutUser(): Promise<void>;
  sendVerificationEmail(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  deleteAccount(): Promise<void>;

  // Profile
  getMyProfile(): Promise<UserProfile | null>;
  saveMyProfile(input: ProfileInput): Promise<void>;
  withdrawConsent(): Promise<void>;

  // Donor directory
  searchDonors(filters: DonorSearchFilters, cursor: string | null): Promise<DonorSearchPage>;
  getDonorPublic(uid: string): Promise<UserProfile | null>;

  // Contact requests
  sendContactRequest(donorUid: string, message: string): Promise<void>;
  listReceivedContactRequests(): Promise<ContactRequest[]>;
  listSentContactRequests(): Promise<ContactRequest[]>;
  respondToContactRequest(
    id: string,
    status: "accepted" | "declined"
  ): Promise<void>;
  cancelContactRequest(id: string): Promise<void>;

  // Blood requests
  createBloodRequest(input: BloodRequestInput): Promise<void>;
  listBloodRequests(
    filters: BloodRequestFilters,
    cursor: string | null
  ): Promise<BloodRequestPage>;
  getBloodRequest(id: string): Promise<BloodRequest | null>;
  listMyBloodRequests(): Promise<BloodRequest[]>;
  updateBloodRequestStatus(id: string, status: BloodRequestStatus): Promise<void>;

  // Donor responses to blood requests (contact shared only with the request owner)
  respondToBloodRequest(requestId: string, message: string, contact: string): Promise<void>;
  getMyResponseForRequest(requestId: string): Promise<BloodRequestResponse | null>;
  listResponsesForRequest(requestId: string): Promise<BloodRequestResponse[]>;

  // Reports
  reportItem(targetType: Report["targetType"], targetId: string, reason: string): Promise<void>;

  // Admin
  isCurrentUserAdmin(): Promise<boolean>;
  adminListUsers(): Promise<UserProfile[]>;
  adminListReports(): Promise<Report[]>;
  adminResolveReport(id: string, status: "reviewed" | "dismissed"): Promise<void>;
  adminListOpenBloodRequests(): Promise<BloodRequest[]>;
  adminSetBloodRequestStatus(id: string, status: BloodRequestStatus): Promise<void>;
}
