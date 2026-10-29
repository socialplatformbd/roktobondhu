// Core shared types for RoktoBondhu (রক্তবন্ধু)

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-";

export const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

// Controlled list of supported areas. Do NOT add new areas here without
// an official administrator decision — the app intentionally only serves
// Anwara and Halishahar for now.
export type AreaId = "anwara" | "halishahar";

export const SUPPORTED_AREAS: AreaId[] = ["anwara", "halishahar"];

export type Lang = "bn" | "en";

export type DonorAvailability = "available" | "paused";

export type ContactRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled";

export type BloodRequestStatus = "open" | "fulfilled" | "cancelled" | "expired";

export type UrgencyLevel = "normal" | "urgent" | "critical";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  emailVerified: boolean;
  phone?: string; // normalized BD phone, voluntary, not verified
  bloodGroup?: BloodGroup;
  area?: AreaId;
  donorConsent: boolean; // explicit, defaults false
  donorAvailability: DonorAvailability;
  preferredLanguage: Lang;
  consentTimestamp?: number | null;
  createdAt: number;
  updatedAt: number;
}

// Public, minimal donor directory record. Must never contain phone/email.
export interface DonorPublic {
  uid: string;
  displayNameInitial: string; // e.g. "R." instead of full name, for privacy
  displayName: string; // shown only after we decide it's acceptable (first name)
  bloodGroup: BloodGroup;
  area: AreaId;
  donorAvailability: DonorAvailability;
  updatedAt: number;
}

export interface ContactRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  donorId: string;
  bloodGroup: BloodGroup;
  area: AreaId;
  message: string;
  status: ContactRequestStatus;
  createdAt: number;
  respondedAt?: number | null;
  // Only populated client-side after acceptance + authorization check
  donorContactRevealed?: {
    phone?: string;
    email?: string;
  } | null;
}

export interface BloodRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  bloodGroup: BloodGroup;
  area: AreaId;
  hospitalName: string;
  neededAt: number; // timestamp of required date/time
  units: number;
  urgency: UrgencyLevel;
  notes?: string;
  contactMethod?: string; // shown publicly only when the owner explicitly consents
  contactPublicly?: boolean; // explicit consent to display contact method on this request
  status: BloodRequestStatus;
  createdAt: number;
  updatedAt: number;
  reportCount?: number;
}

// A donor's offer to help on a blood request. Readable only by the request
// owner, the donor who wrote it, and admins.
export interface BloodRequestResponse {
  id: string; // `${requestId}_${donorId}` (one response per donor per request)
  requestId: string;
  ownerId: string;
  donorId: string;
  donorName: string;
  message: string;
  contact: string; // phone or other contact the donor chooses to share with the owner
  createdAt: number;
}

export type ReportTargetType = "blood_request" | "donor" | "contact_request";

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reporterId: string;
  reason: string;
  createdAt: number;
  status: "open" | "reviewed" | "dismissed";
}

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  isAdmin: boolean;
}
